import { DynamoDB } from "aws-sdk";
var dynamodb = new DynamoDB({
  maxRetries: 5,
  retryDelayOptions: { base: 300 },
});
export const client = new DynamoDB.DocumentClient({ service: dynamodb });
import { subMinutes, addDays } from "date-fns";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
type WriteRequest = DocumentClient.WriteRequest;

export const tableName = process.env.DATABASE_TABLE_NAME!;

export const getCacheVal = async <T>(
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

export const setCacheVal = async <T>(key: string, data: T): Promise<T> => {
  await client
    .put({
      TableName: tableName,
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
  table = tableName,
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
      (result.UnprocessedItems ? result.UnprocessedItems[tableName] : []) || [];

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

export const queryTimeSeriesData = async <T>(
  pk: string,
  start: Date,
  end: Date
): Promise<T[]> => {
  const result = await client
    .query({
      TableName: tableName,
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
