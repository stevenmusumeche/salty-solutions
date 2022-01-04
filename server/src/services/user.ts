import { Maybe, Platform, UserLoggedInInput } from "../generated/graphql";
import { getItemByKey, put } from "./db";
import { getPurchase, isAppleSubscriptionActive } from "./purchase";
import { differenceInMinutes } from "date-fns";

// number of minutes since the last validation that must pass before another validation is performed
const PREMIUM_VALIDATION_THRESHOLD_MINUTES = 60 * 24 * 1;

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
  createdAt: string;
}

export async function create(
  userToken: UserToken,
  email?: Maybe<string>
): Promise<UserDAO> {
  const timestamp = new Date().toISOString();
  let existingUser = await getUser(userToken.sub);
  if (existingUser) return existingUser;

  let mergedToken: UserToken = userToken;
  if (email) {
    mergedToken = { ...mergedToken, email };
  }

  const newUser = toUserDao(mergedToken, timestamp);
  await saveUserToDB(newUser);
  return newUser;
}

export async function loggedIn(
  input: UserLoggedInInput,
  userToken: UserToken
): Promise<boolean> {
  try {
    const now = new Date();
    await put({
      table: "user",
      item: {
        Item: {
          pk: PK.user(userToken.sub),
          sk: SK.userLogin(now),
          data: {
            timestamp: now.toISOString(),
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
  };
}

async function saveUserToDB(user: UserDAO): Promise<void> {
  put({
    item: {
      Item: {
        pk: PK.user(user.id),
        sk: SK.userDetails(),
        data: user,
      },
    },
    table: "user",
  });
}

export async function getUser(userId: string): Promise<UserDAO | null> {
  return (
    (await getItemByKey<UserDAO>({
      pk: PK.user(userId),
      sk: SK.userDetails(),
      table: "user",
    })) || null
  );
}

/**
 * Is this user entitled to the premium product?
 */
export async function isEntitledToPremium(userId: string): Promise<boolean> {
  try {
    const { purchase, allPurchases } = await getPurchase(userId, "PREMIUM_V1");
    if (!purchase) return false;

    const minsSinceLastValidation = differenceInMinutes(
      new Date(),
      new Date(purchase.lastValidatedDate)
    );

    // if last validated date is recent, return database value
    if (minsSinceLastValidation < PREMIUM_VALIDATION_THRESHOLD_MINUTES) {
      return purchase.isActive;
    }

    // if last validated date is old, verify with third party, update database and return true/false
    let isActive = false;
    if (purchase.platform === Platform.Ios) {
      isActive = await isAppleSubscriptionActive(purchase);
    } else if (purchase.platform === Platform.Android) {
      // todo: android
      isActive = false;
    }

    const updatedPurchases = allPurchases.map((purchase) => {
      // only modify the relevant purchase
      if (purchase.id === purchase.id) {
        return {
          ...purchase,
          isActive,
          lastValidatedDate: new Date().toISOString(),
        };
      }

      return purchase;
    });

    await put({
      table: "user",
      item: {
        Item: {
          pk: PK.user(userId),
          sk: SK.userPurchases(),
          data: updatedPurchases,
        },
      },
    });

    return isActive;
  } catch (e) {
    console.error("Error calculating premium entitlement", e);
    return false;
  }
}

/**
 * Database partition key generators
 */
export const PK = {
  user: (userId: string) => `user::${userId}`,
  appConfig: () => "app-config",
};

/**
 * Database sort key generators
 */
export const SK = {
  userDetails: () => "user-details",
  userLogin: (timestamp: Date) => `user-login::${timestamp.toISOString()}`,
  userPurchases: () => "purchases",
  featureFlags: () => "feature-flags",
};
