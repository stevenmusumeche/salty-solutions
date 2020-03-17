import { ScheduledHandler } from "aws-lambda";
import { SQS } from "aws-sdk";
import { getAll } from "../services/location";

const sqs = new SQS();

export const forecast: ScheduledHandler = async () => {
  for (const location of getAll()) {
    const params: SQS.Types.SendMessageRequest = {
      QueueUrl: process.env.QUEUE_URL!,
      MessageBody: JSON.stringify({ locationId: location.id })
    };

    await sqs.sendMessage(params).promise();
  }
};
