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

export const sendMessageBatch = (
  queueUrl: string,
  producerName: string,
  bodies: Object[]
) => {
  return sqs
    .sendMessageBatch({
      QueueUrl: queueUrl,
      Entries: bodies.map((body, i) => ({
        Id: String(i),
        MessageAttributes: {
          producer: {
            DataType: "String",
            StringValue: producerName
          }
        },
        MessageBody: JSON.stringify(body)
      }))
    })
    .promise();
};
