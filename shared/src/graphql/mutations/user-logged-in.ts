import gql from "graphql-tag";

export const USER_LOGGED_IN_MUTATION = gql`
  mutation UserLoggedIn($platform: Platform!) {
    userLoggedIn(input: { platform: $platform }) {
      success
    }
  }
`;
