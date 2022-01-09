import gql from "graphql-tag";

export const COMPLETE_PURCHASE_MUTATION = gql`
  mutation CompletePurchase($input: CompletePurchaseInput!) {
    completePurchase(input: $input) {
      isComplete
      user {
        ...UserFields
      }
    }
  }

  fragment UserFields on User {
    id
    email
    name
    picture
    createdAt
    entitledToPremium
  }
`;
