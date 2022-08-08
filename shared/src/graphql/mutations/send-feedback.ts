import gql from "graphql-tag";

export const SEND_FEEDBACK_MUTATION = gql`
  mutation SendFeedback($input: SendFeedbackInput!) {
    sendFeedback(input: $input) {
      success
    }
  }
`;
