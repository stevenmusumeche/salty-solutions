import { SQSHandler } from "aws-lambda";

export const forecast: SQSHandler = async (event, ctx, cb) => {
  console.log(
    "received sqs event with this many records",
    event.Records.length
  );

  event.Records.forEach(record => {
    const payload = JSON.parse(record.body);
    console.log("received SQS forecast event", payload);
  });

  // cb("test error");
};
