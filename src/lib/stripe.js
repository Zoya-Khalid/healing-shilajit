import { loadStripe } from "@stripe/stripe-js";

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Format amount for Stripe (multiply by 100)
export const formatAmountForStripe = (amount) => {
  return Math.round(amount * 100);
};

