import { SESV2 } from "aws-sdk";

const ses = new SESV2({ apiVersion: "2019-09-27" });

const ADMIN_EMAIL = "steven@musumeche.com";

interface SendToAdminParams {
  replyTo: string;
  subject: string;
  body: string;
}

/**
 * Send an email to the site admin. Internal use only.
 */
export function sendToAdmin(input: SendToAdminParams) {
  return ses
    .sendEmail({
      FromEmailAddress: ADMIN_EMAIL,
      Destination: {
        ToAddresses: [ADMIN_EMAIL],
      },
      ReplyToAddresses: [input.replyTo],
      Content: {
        Simple: {
          Subject: { Data: input.subject },
          Body: { Text: { Data: input.body } },
        },
      },
    })
    .promise();
}
