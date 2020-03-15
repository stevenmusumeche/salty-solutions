import { SQSHandler } from "aws-lambda";

export const forecast: SQSHandler = async (event, ctx, cb) => {
  console.log("received SQS forecast event", event.Records);
};
