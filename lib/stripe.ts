import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-10-29.clover",
  typescript: true,
});

// Price IDs - You'll need to create these in your Stripe Dashboard
// For now, these are placeholders
export const STRIPE_PRICE_IDS = {
  monthly: process.env.STRIPE_MONTHLY_PRICE_ID || "price_monthly_placeholder",
  yearly: process.env.STRIPE_YEARLY_PRICE_ID || "price_yearly_placeholder",
};
