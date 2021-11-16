import { DynamoDB } from "aws-sdk";
var dynamodb = new DynamoDB({
  maxRetries: 5,
  retryDelayOptions: { base: 300 },
});
export const client = new DynamoDB.DocumentClient({ service: dynamodb });
import { subMinutes, addDays } from "date-fns";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
type WriteRequest = DocumentClient.WriteRequest;
type PutItemInputAttributeMap = DocumentClient.PutItemInputAttributeMap;

export const mainTableName = process.env.DATABASE_TABLE_NAME!;
export const userTableName = process.env.DATABASE_USER_TABLE_NAME!;
type Table = "main" | "user";
const tables: Record<Table, string> = {
  main: mainTableName,
  user: userTableName,
};

export const getCacheVal = async <T>(
  key: string,
  maxAgeMins: number
): Promise<T | void> => {
  try {
    const cutoff = subMinutes(new Date(), maxAgeMins);
    const result = await client
      .query({
        TableName: mainTableName,
        KeyConditionExpression: "pk = :key AND sk >= :date",
        ExpressionAttributeValues: {
          ":key": key,
          ":date": cutoff.getTime(),
        },
        Limit: 1,
        ScanIndexForward: false,
      })
      .promise();

    if (result.Count === 0) return;
    return result.Items![0].data as T;
  } catch (e) {
    console.log("Error fetching cached value", e);

    return;
  }
};

export const getLatestValue = async <T>(
  key: string
): Promise<{ key: string; createdAt: Date; data: T } | void> => {
  try {
    const result = await client
      .query({
        TableName: mainTableName,
        KeyConditionExpression: "pk = :key",
        ExpressionAttributeValues: {
          ":key": key,
        },
        Limit: 1,
        ScanIndexForward: false,
      })
      .promise();

    if (result.Count === 0) return;

    const item = result.Items![0];
    const data = item.data as T;

    return { data, key, createdAt: new Date(item.sk) };
  } catch (e) {
    console.log("Error fetching latest value", e);

    return;
  }
};

export const setCacheVal = async <T>(key: string, data: T): Promise<T> => {
  await client
    .put({
      TableName: mainTableName,
      Item: {
        pk: key,
        sk: Date.now(),
        ttl: addDays(new Date(), 30).getTime(),
        data,
      },
    })
    .promise();
  return data;
};

export const batchWrite = async (
  queries: WriteRequest[],
  table = mainTableName,
  batchSize = 25
) => {
  const maxLoops = Math.ceil(queries.length / batchSize) * 3;
  let curLoop = 0;
  while (queries.length && curLoop < maxLoops) {
    const cur = queries.splice(0, batchSize);
    const result = await client
      .batchWrite({
        RequestItems: {
          [table]: cur,
        },
      })
      .promise();

    const unprocessed: WriteRequest[] =
      (result.UnprocessedItems ? result.UnprocessedItems[mainTableName] : []) ||
      [];

    queries.concat(unprocessed);
    curLoop++;
  }

  if (queries.length) {
    console.error(
      JSON.stringify({
        message: "Unable to write all batch items",
        remainingQueries: queries,
      })
    );
  }
};

type PutInput = { item: PutItemInputAttributeMap; table: Table };
export const put = async (input: PutInput) => {
  return await client
    .put({
      Item: input.item.Item,
      TableName: tables[input.table],
    })
    .promise();
};

interface UpdateInput
  extends Omit<DocumentClient.UpdateItemInput, "TableName"> {
  table: Table;
}
export const update = async (input: UpdateInput) => {
  return client
    .update({
      TableName: tables[input.table],
      ...input,
    })
    .promise();
};

// todo: paging? only can return 1mb at a time
export const queryTimeSeriesData = async <T>(
  pk: string,
  start: Date,
  end: Date
): Promise<T[]> => {
  const result = await client
    .query({
      TableName: mainTableName,
      KeyConditionExpression: "pk = :key AND sk BETWEEN :start AND :end",
      ExpressionAttributeValues: {
        ":key": pk,
        ":start": start.getTime(),
        ":end": end.getTime(),
      },
    })
    .promise();

  if (!result.Items) return [];

  return result.Items.map((item) => ({
    timestamp: new Date(item.sk).toISOString(),
    ...item.data,
  }));
};

type GetItemByKeyInput =
  | {
      table: "main";
      pk: string;
      sk?: number;
    }
  | {
      table: "user";
      pk: string;
      sk?: string;
    };

export const getItemByKey = async <T>(
  input: GetItemByKeyInput
): Promise<T | undefined> => {
  if (input.sk) {
    // if we have both pk and sk, we can use GetItem
    const resp = await client
      .get({
        TableName: tables[input.table],
        Key: {
          pk: input.pk,
          sk: input.sk,
        },
      })
      .promise();

    return resp.Item ? (resp.Item.data as T) : undefined;
  }

  // otherwise we have to query
  const result = await client
    .query({
      TableName: tables[input.table],
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": input.pk,
      },
      Limit: 1,
    })
    .promise();

  if (result.Count === 0) return;
  return result.Items![0].data as T;
};
