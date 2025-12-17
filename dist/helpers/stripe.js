"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../config"));
if (!config_1.default.stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is required. Please add it to your .env file.\n" +
        "Get your Stripe test key from: https://dashboard.stripe.com/test/apikeys\n" +
        "Format: STRIPE_SECRET_KEY=sk_test_...");
}
exports.stripe = new stripe_1.default(config_1.default.stripeSecretKey);
