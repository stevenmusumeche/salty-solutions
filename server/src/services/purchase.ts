import { Platform, UserPurchase } from "../generated/graphql";
import { getUser, PK, SK, UserToken } from "./user";
import axios from "axios";
import { v4 } from "uuid";
import { update, UpdateInput, getItemByKey } from "./db";
import jwt from "jsonwebtoken";
import { google } from "googleapis";
import { isAfter } from "date-fns";
import { sendMessage } from "./queue";
import { sendToAdmin } from "./email";

const APPLE_ITUNES_SANDBOX_URL =
  "https://sandbox.itunes.apple.com/verifyReceipt";
const APPLE_ITUNES_PRODUCTION_URL =
  "https://buy.itunes.apple.com/verifyReceipt";
const APPLE_STOREKIT_SANDBOX_DOMAIN = `https://api.storekit-sandbox.itunes.apple.com`;
const APPLE_STOREKIT_PRODUCTION_DOMAIN = `https://api.storekit.itunes.apple.com`;
const APPLE_SUBSCRIPTION_GROUP = "20879881";
const APPLE_APP_STORE_CONNECT_ISSUER_ID =
  "157f3bdf-1ecb-4cdf-9881-0e43bf2111c5";

const googleAuthClient = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  undefined,
  process.env.GOOGLE_CLIENT_PRIVATE_KEY,
  ["https://www.googleapis.com/auth/androidpublisher"]
);

export type PurchasableItem = "PREMIUM_V1" | "PREMIUM_V0";

interface BasePurchaseDAO {
  id: string;
  item: PurchasableItem;
  isActive: boolean;
  lastValidatedDate: string;
  purchaseDate: string;
  priceCents: number;
}

interface ApplePurchaseDAO extends BasePurchaseDAO {
  platform: Platform.Ios;
  iosTransactionId: string;
  iosReceipt: string;
}

export interface AndroidPurchaseDAO extends BasePurchaseDAO {
  platform: Platform.Android;
  androidOrderId: string;
  androidReceipt: string;
}

// shape of data in the database
export type UserPurchaseDAO = AndroidPurchaseDAO | ApplePurchaseDAO;

export interface PurchaseCompletedEvent {
  userId: string;
  timestamp: string;
}

/**
 * Get all purchases for a user
 */
const getPurchases = async (userId: string): Promise<UserPurchaseDAO[]> => {
  const items = await getItemByKey<UserPurchaseDAO[]>({
    table: "user",
    pk: PK.user(userId),
    sk: SK.userPurchases(),
  });

  return items || [];
};

/**
 * Get a particular purchase for a user
 */
interface GetPurchaseResponse {
  allPurchases: UserPurchaseDAO[];
  purchase?: UserPurchaseDAO;
}
export const getPurchase = async (
  userId: string,
  item: PurchasableItem
): Promise<GetPurchaseResponse> => {
  // get user purchases
  const purchases = await getPurchases(userId);

  // find most recent purchase for item type
  const premiumV1Purchases = purchases
    // only look at PremiumV1 purchases
    .filter((purchase) => purchase.item === item)
    // use most recent purchase
    .sort(
      (a, b) =>
        new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
    );

  return { allPurchases: purchases, purchase: premiumV1Purchases[0] };
};

/**
 * Mark a purchase as completed in the database
 */
export const completePurchase = async (
  userToken: UserToken,
  platform: Platform,
  receipt: string,
  priceCents: number
): Promise<boolean> => {
  const now = new Date().toISOString();
  let purchase: UserPurchaseDAO;

  if (platform === Platform.Ios) {
    const { isValid, transactionId: iosTransactionId } =
      await validateAppleReceipt(receipt);

    if (!isValid) {
      console.log("Invalid iOS transaction", userToken.sub, receipt);
      return false;
    }

    purchase = {
      id: v4(),
      item: "PREMIUM_V1",
      platform,
      iosTransactionId: iosTransactionId as string,
      iosReceipt: receipt,
      isActive: true,
      lastValidatedDate: now,
      purchaseDate: now,
      priceCents,
    };
  } else if (platform === Platform.Android) {
    const { isValid, orderId: androidOrderId } = await validateAndroidReceipt(
      receipt
    );

    if (!isValid) {
      console.log("Invalid Android transaction", userToken.sub, receipt);
      return false;
    }

    purchase = {
      id: v4(),
      item: "PREMIUM_V1",
      platform,
      androidOrderId: androidOrderId as string,
      androidReceipt: receipt,
      isActive: true,
      lastValidatedDate: now,
      purchaseDate: now,
      priceCents,
    };
  } else {
    return false;
  }

  try {
    const params: UpdateInput = {
      table: "user",
      Key: {
        pk: PK.user(userToken.sub),
        sk: SK.userPurchases(),
      },
      UpdateExpression:
        "set #attrName = list_append(if_not_exists(#attrName, :empty_list), :purchase)",
      ExpressionAttributeNames: {
        "#attrName": "data",
      },
      ExpressionAttributeValues: {
        ":purchase": [purchase],
        ":empty_list": [],
      },
      ReturnValues: "UPDATED_NEW",
    };

    await update(params);
    console.log("Purchase completed for ", userToken.sub);
  } catch (e) {
    console.error("Error completing purchase", e);
    return false;
  }

  // send SQS event
  try {
    await sendMessage<PurchaseCompletedEvent>(
      process.env.PURCHASE_COMPLETED_QUEUE_URL!,
      "purchase-completed",
      { userId: userToken.sub, timestamp: new Date().toISOString() }
    );
  } catch (e) {
    console.error("Error sending SQS completed purchase message");
  }

  return true;
};

/**
 * Verify that a purchase receipt is valid and extract the transaction ID
 */
async function validateAppleReceipt(
  receipt: string
): Promise<
  | { isValid: true; transactionId: string }
  | { isValid: false; transactionId: undefined }
> {
  try {
    /**
     * Verify your receipt first with the production URL; then verify with the sandbox URL if you receive
     * a 21007 status code. This approach ensures you do not have to switch between URLs while your
     * application is tested, reviewed by App Review, or live in the App Store.
     */
    let resp = await _validateAppleReceipt(
      APPLE_ITUNES_PRODUCTION_URL,
      receipt
    );
    if (resp.data.status === 21007) {
      resp = await _validateAppleReceipt(APPLE_ITUNES_SANDBOX_URL, receipt);
    }

    // get most recent receipt
    const sortedReceipts = resp.data.receipt.in_app.sort(
      (a: any, b: any) =>
        Number(b.purchase_date_ms) - Number(a.purchase_date_ms)
    );
    const currentReceipt = sortedReceipts[0];

    return {
      isValid: resp.data.status === 0,
      transactionId: currentReceipt
        ? currentReceipt.original_transaction_id
        : undefined,
    };
  } catch (e) {
    console.error(e);
    return { isValid: false, transactionId: undefined };
  }
}

async function _validateAppleReceipt(url: string, receipt: string) {
  return axios.post(url, {
    password: process.env.APPLE_IAP_SHARED_SECRET,
    "exclude-old-transaction": true,
    "receipt-data": receipt,
  });
}

/**
 * Call Apple Storekit API to determine the subscription status
 */
export async function isAppleSubscriptionActive(purchase: ApplePurchaseDAO) {
  if (purchase.platform !== Platform.Ios) return false;

  const jwt = buildAppleStoreAuthToken();
  const resp = await axios.get(
    `${APPLE_STOREKIT_PRODUCTION_DOMAIN}/inApps/v1/subscriptions/${purchase.iosTransactionId}`,
    { headers: { authorization: `Bearer ${jwt}` } }
  );

  const entryForSubscriptionGroup = resp.data.data.find(
    (data: any) => data.subscriptionGroupIdentifier === APPLE_SUBSCRIPTION_GROUP
  );
  if (!entryForSubscriptionGroup) return false;

  const transaction = entryForSubscriptionGroup.lastTransactions.find(
    (data: any) => data.originalTransactionId === purchase.iosTransactionId
  );
  if (!transaction) return false;

  // https://developer.apple.com/documentation/appstoreserverapi/status
  return transaction.status === 1;
}

/**
 * Build JWT used to call Apple Storekit API
 */
function buildAppleStoreAuthToken(): string {
  if (!process.env.APPLE_STORE_SERVER_PRIVATE_KEY) {
    throw new Error(
      "Missing environment variable APPLE_STORE_SERVER_PRIVATE_KEY"
    );
  }
  if (!process.env.APPLE_STORE_SERVER_PRIVATE_KEY_ID) {
    throw new Error(
      "Missing environment variable APPLE_STORE_SERVER_PRIVATE_KEY_ID"
    );
  }

  const now = Date.now() / 1000;
  const jwtPayload = {
    // Your issuer ID from the Keys page in App Store Connect
    iss: APPLE_APP_STORE_CONNECT_ISSUER_ID,
    iat: now,
    // expires in 30 minutes
    exp: now + 60 * 30,
    aud: "appstoreconnect-v1",
    // An arbitrary number you create and use only once
    nonce: v4(),
    bid: "com.musumeche.salty.solutions",
  };

  return jwt.sign(jwtPayload, process.env.APPLE_STORE_SERVER_PRIVATE_KEY, {
    algorithm: "ES256",
    keyid: process.env.APPLE_STORE_SERVER_PRIVATE_KEY_ID,
  });
}

async function validateAndroidReceipt(
  purchaseToken: string
): Promise<
  { isValid: true; orderId: string } | { isValid: false; orderId: undefined }
> {
  await googleAuthClient.authorize();

  try {
    const androidPublisher = google.androidpublisher("v3");
    const res = await androidPublisher.purchases.subscriptions.get({
      auth: googleAuthClient,
      packageName: "com.musumeche.salty.solutions",
      subscriptionId: "premium.monthly.v1",
      token: purchaseToken,
    });

    if (res.data.kind !== "androidpublisher#subscriptionPurchase") {
      throw new Error("Invalid kind " + res.data.purchaseType);
    }
    if (!res.data.orderId) {
      throw new Error("Missing orderId");
    }
    if (res.data.cancelReason !== undefined) {
      throw new Error("Already canceled");
    }
    if (res.data.paymentState === undefined) {
      throw new Error("Invalid payment state");
    }

    return {
      isValid: true,
      orderId: res.data.orderId,
    };
  } catch (e) {
    console.error(e);
    return { isValid: false, orderId: undefined };
  }
}

export async function isAndroidSubscriptionActive(androidReceipt: string) {
  try {
    await googleAuthClient.authorize();
    const androidPublisher = google.androidpublisher("v3");
    const res = await androidPublisher.purchases.subscriptions.get({
      auth: googleAuthClient,
      packageName: "com.musumeche.salty.solutions",
      subscriptionId: "premium.monthly.v1",
      token: androidReceipt,
    });

    if (!res.data.expiryTimeMillis) {
      return false;
    }

    const endTime = new Date(Number(res.data.expiryTimeMillis));

    return isAfter(endTime, new Date());
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function sendPurchaseEmail(payload: PurchaseCompletedEvent) {
  const user = await getUser(payload.userId);
  if (!user) {
    throw new Error("Invariant. Unable to load user");
  }
  try {
    await sendToAdmin({
      subject: "Salty Solutions New IAP",
      replyTo: "noreply@musumeche.com",
      body: JSON.stringify(user),
    });
    console.log("Sent purchase email for", payload.userId);
  } catch (e) {
    console.error("Error sending email", e);
  }
}
