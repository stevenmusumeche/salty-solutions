import { DynamoDB } from "aws-sdk";
const client = new DynamoDB.DocumentClient();
import { subMinutes, addDays } from "date-fns";

const tableName = process.env.DATABASE_TABLE_NAME!;

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

export const setCacheVal = async <T>(key: string, data: T): Promise<T> => {
  await client
    .put({
      TableName: tableName,
      Item: {
        pk: key,
        sk: Date.now(),
        ttl: addDays(new Date(), 30).getTime(),
        data
      }
    })
    .promise();
  return data;
};
