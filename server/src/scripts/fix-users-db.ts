import { Key, WriteRequest } from "aws-sdk/clients/dynamodb";
import {
  client,
  mainTableName,
  userTableName,
  batchWrite,
} from "../services/db";
import { SK } from "../services/user";

async function run() {
  const items = await fetchAll();
  const requests: WriteRequest[] = [];

  for (let i = 0; i < items.length; i++) {
    const oldItem = items[i];
    const newItem = transformItem(oldItem);
    const itemRequests = buildRequests(oldItem, newItem);
    requests.push(...itemRequests);
  }

  console.log(requests.length, "updates to perform");

  // await batchWrite(requests, userTableName);
}

function buildRequests(
  oldItem: any,
  newItem: any
): [WriteRequest, WriteRequest] {
  const newRequest: WriteRequest = {
    PutRequest: {
      Item: {
        ...newItem,
      },
    },
  };
  const deleteRequest: WriteRequest = {
    DeleteRequest: {
      Key: {
        pk: oldItem.pk,
        sk: oldItem.sk,
      },
    },
  };

  return [newRequest, deleteRequest];
}

function transformItem(oldItem: any) {
  return {
    ...oldItem,
    sk: SK.userDetails(),
    data: {
      ...oldItem.data,
      purchases: undefined,
    },
  };
}

async function fetchAll() {
  let allItems = [];
  let lastKey: Key | undefined;
  let maxPages = 1000;
  let numPages = 0;

  do {
    numPages++;
    console.log("Fetching page", numPages);
    const resp = await client
      .scan({
        TableName: userTableName,
        Limit: 50,
        FilterExpression: "begins_with(pk, :pk) AND begins_with(sk, :sk)",
        ExpressionAttributeValues: {
          ":pk": "user::",
          ":sk": "email::",
        },
        ExclusiveStartKey: lastKey,
      })
      .promise();

    lastKey = resp.LastEvaluatedKey;
    const items = resp.Items ?? [];
    allItems.push(...items);
  } while (!!lastKey && numPages < maxPages);

  return allItems;
}

run();
