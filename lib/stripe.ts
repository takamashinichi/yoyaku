import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is missing. Please set in your .env file');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia', // Stripeの最新APIバージョンを使用
  // appInfoのカスタム設定を削除してデフォルト設定を使用
});

export default stripe; 