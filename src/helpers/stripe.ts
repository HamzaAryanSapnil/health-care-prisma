import Stripe from "stripe";
import config from "../config";

if (!config.stripeSecretKey) {
    throw new Error(
        "STRIPE_SECRET_KEY is required. Please add it to your .env file.\n" +
        "Get your Stripe test key from: https://dashboard.stripe.com/test/apikeys\n" +
        "Format: STRIPE_SECRET_KEY=sk_test_..."
    );
}

export const stripe = new Stripe(config.stripeSecretKey as string);