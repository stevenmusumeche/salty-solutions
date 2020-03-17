import { SQS } from "aws-sdk";

const sqs = new SQS();

export const sendMessage = (
  queueUrl: string,
  producerName: string,
  body: Object
) => {
  const params: SQS.Types.SendMessageRequest = {
    QueueUrl: queueUrl,
    MessageAttributes: {
      producer: {
        DataType: "String",
        StringValue: producerName
      }
    },
    MessageBody: JSON.stringify(body)
  };

  return sqs.sendMessage(params).promise();
};
