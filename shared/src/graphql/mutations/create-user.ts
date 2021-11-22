import gql from "graphql-tag";

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser {
    createUser {
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
    purchases {
      id
      item
      priceCents
      platform
      isActive
      purchaseDate
      endDate
    }
  }
`;
