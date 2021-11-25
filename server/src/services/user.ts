import { User, UserLoggedInInput } from "../generated/graphql";
import { getItemByKey, put } from "./db";

// shape of data from the decoded JWT
export interface UserToken {
  given_name: string;
  family_name: string;
  nickname: string;
  name: string;
  picture: string;
  updated_at: string;
  email: string;
  email_verified: boolean;
  iss: string;
  sub: string;
  aud: string;
  iat: number;
  exp: number;
  nonce: string;
}

// shape of data in the database
export interface UserDAO {
  id: string;
  email: string;
  name: string;
  picture?: string;
  purchases: [];
  createdAt: string;
}

export async function create(userToken: UserToken): Promise<UserDAO> {
  const timestamp = new Date().toISOString();
  let existingUser = await getUser(userToken.sub);
  if (existingUser) return existingUser;

  const newUser = toUserDao(userToken, timestamp);
  await saveUserToDB(newUser);
  return newUser;
}

export async function loggedIn(
  input: UserLoggedInInput,
  userToken: UserToken
): Promise<boolean> {
  try {
    const timestamp = new Date().toISOString();
    await put({
      table: "user",
      item: {
        Item: {
          pk: getUserLoginPk(userToken.sub),
          sk: timestamp,
          data: {
            timestamp,
            platform: input.platform,
          },
        },
      },
    });
    return true;
  } catch (e) {
    console.error("Error creating login record", e);
    return false;
  }
}

function toUserDao(userToken: UserToken, createdAt: string): UserDAO {
  return {
    id: userToken.sub,
    email: userToken.email,
    name: userToken.name,
    picture: userToken.picture,
    createdAt,
    purchases: [],
  };
}

async function saveUserToDB(user: UserDAO): Promise<void> {
  put({
    item: {
      Item: {
        pk: getUserPk(user.id),
        sk: getUserSk(user.email),
        data: user,
      },
    },
    table: "user",
  });
}

export async function getUser(userId: string): Promise<UserDAO | null> {
  return (
    (await getItemByKey<UserDAO>({ pk: getUserPk(userId), table: "user" })) ||
    null
  );
}

function getUserPk(userId: string) {
  return "user::" + userId;
}

function getUserSk(email: string) {
  return "email::" + email;
}

function getUserLoginPk(userId: string) {
  return "user-login::" + userId;
}
