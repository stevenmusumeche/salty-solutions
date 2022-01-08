import gql from "graphql-tag";

export const UPSERT_USER_MUTATION = gql`
  mutation UpsertUser($input: UpsertUserInput!) {
    upsertUser(input: $input) {
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
