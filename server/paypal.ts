// PayPal integration - based on Replit PayPal blueprint
import { Request, Response } from "express";
import paypalSdk from "@paypal/paypal-server-sdk";

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

if (!PAYPAL_CLIENT_ID) {
  throw new Error("Missing PAYPAL_CLIENT_ID");
}
if (!PAYPAL_CLIENT_SECRET) {
  throw new Error("Missing PAYPAL_CLIENT_SECRET");
}

const client = new paypalSdk.Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: PAYPAL_CLIENT_ID,
    oAuthClientSecret: PAYPAL_CLIENT_SECRET,
  },
  timeout: 0,
  environment:
    process.env.NODE_ENV === "production"
      ? paypalSdk.Environment.Production
      : paypalSdk.Environment.Sandbox,
  logging: {
    logLevel: paypalSdk.LogLevel.Info,
    logRequest: {
      logBody: true,
    },
    logResponse: {
      logHeaders: true,
    },
  },
});

const ordersController = new paypalSdk.OrdersController(client);
const oAuthAuthorizationController = new paypalSdk.OAuthAuthorizationController(client);

export async function getClientToken() {
  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");

  const { result } = await oAuthAuthorizationController.requestToken(
    {
      authorization: `Basic ${auth}`,
    },
    { intent: "sdk_init", response_type: "client_token" },
  );

  return result.accessToken;
}

export async function createPaypalOrder(req: Request, res: Response) {
  try {
    const { amount, currency, intent } = req.body;

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res
        .status(400)
        .json({ error: "Invalid amount. Amount must be a positive number." });
    }

    if (!currency) {
      return res
        .status(400)
        .json({ error: "Invalid currency. Currency is required." });
    }

    if (!intent) {
      return res
        .status(400)
        .json({ error: "Invalid intent. Intent is required." });
    }

    const collect = {
      body: {
        intent: intent,
        purchaseUnits: [
          {
            amount: {
              currencyCode: currency,
              value: amount,
            },
          },
        ],
      },
      prefer: "return=minimal",
    };

    const { body, ...httpResponse } =
      await ordersController.createOrder(collect);

    const jsonResponse = JSON.parse(String(body));
    const httpStatusCode = httpResponse.statusCode;

    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
}

export async function capturePaypalOrder(req: Request, res: Response) {
  try {
    const { orderID } = req.params;
    const collect = {
      id: orderID,
      prefer: "return=minimal",
    };

    const { body, ...httpResponse } =
      await ordersController.captureOrder(collect);

    const jsonResponse = JSON.parse(String(body));
    const httpStatusCode = httpResponse.statusCode;

    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to capture order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
}

export async function verifyPaypalOrder(orderId: string, expectedAmount?: string): Promise<{
  verified: boolean;
  status: string;
  amount?: string;
  currency?: string;
  payerEmail?: string;
}> {
  try {
    const { body } = await ordersController.getOrder({ id: orderId });
    const order = JSON.parse(String(body));

    const status = order.status;
    const purchaseUnit = order.purchase_units?.[0];
    const amount = purchaseUnit?.amount?.value;
    const currency = purchaseUnit?.amount?.currency_code;
    const payerEmail = order.payer?.email_address || order.payment_source?.paypal?.email_address;

    if (status !== "COMPLETED") {
      return { verified: false, status };
    }

    const checkAmount = expectedAmount || "200.00";
    if (amount !== checkAmount || currency !== "EUR") {
      return { verified: false, status, amount, currency };
    }

    return { verified: true, status, amount, currency, payerEmail };
  } catch (error) {
    console.error("Failed to verify PayPal order:", error);
    return { verified: false, status: "error" };
  }
}

export async function loadPaypalDefault(req: Request, res: Response) {
  const clientToken = await getClientToken();
  res.json({
    clientToken,
  });
}
