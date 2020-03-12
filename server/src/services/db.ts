import { DynamoDB } from "aws-sdk";
import { MapAttributeValue } from "aws-sdk/clients/dynamodb";
const client = new DynamoDB.DocumentClient();
import { subMinutes } from "date-fns";

const tableName = `salty-solutions-${process.env.SERVERLESS_STAGE}`;

export const getCacheVal = async <T extends MapAttributeValue>(
  key: string,
  maxAgeMins: number
): Promise<T | void> => {
  try {
    const cutoff = subMinutes(new Date(), maxAgeMins);
    const result = await client
      .query({
        TableName: tableName,
        KeyConditionExpression: "pk = :key AND sk >= :date",
        ExpressionAttributeValues: {
          ":key": key,
          ":date": cutoff.getTime()
        },
        Limit: 1,
        ScanIndexForward: false
      })
      .promise();

    if (result.Count === 0) return;
    return result.Items![0].data as T;
  } catch (e) {
    console.log("Error fetching cached value", e);

    return;
  }
};

export const setCacheVal = async <T extends MapAttributeValue>(
  key: string,
  data: T
): Promise<T> => {
  await client
    .put({
      TableName: tableName,
      Item: {
        pk: key,
        sk: Date.now(),
        data
      }
    })
    .promise();
  return data;
};
