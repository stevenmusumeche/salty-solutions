import { User, UserLoggedInInput } from "../generated/graphql";
import { getItemByKey, put } from "./db";

export async function loggedIn(input: UserLoggedInInput): Promise<User> {
  let existingUser = await getUser(input.id);

  if (!existingUser) {
    await createUser(input);
    existingUser = await getUser(input.id);
    if (!existingUser) {
      throw new Error("Unable to create new user");
    }
  }

  // create login record
  const timestamp = new Date().toISOString();
  await put({
    table: "user",
    item: {
      Item: {
        pk: getUserLoginPk(existingUser.id),
        sk: timestamp,
        data: {
          timestamp,
          platform: input.platform,
        },
      },
    },
  });

  return existingUser;
}

async function createUser(
  user: Pick<User, "id" | "email" | "picture" | "name">
): Promise<void> {
  put({
    item: {
      Item: {
        pk: getUserPk(user.id),
        sk: getUserSk(user.email),
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture ?? undefined,
          purchases: [],
        },
      },
    },
    table: "user",
  });
}

export async function getUser(userId: string): Promise<User | undefined> {
  return await getItemByKey<User>({ pk: getUserPk(userId), table: "user" });
}

function getUserPk(userId: string) {
  return "user-" + userId;
}

function getUserSk(email: string) {
  return "email-" + email;
}

function getUserLoginPk(userId: string) {
  return "user-login-" + userId;
}
