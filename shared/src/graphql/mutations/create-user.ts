import gql from "graphql-tag";

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($email: String) {
    createUser(input: { email: $email }) {
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
  }
`;
