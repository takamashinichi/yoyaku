import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is missing. Please set in your .env file');
}

// Stripe APIキー
const apiKey = process.env.STRIPE_SECRET_KEY || '';

// Stripeインスタンスの作成
// カスタム設定は最小限にして接続問題を回避
const stripe = new Stripe(apiKey, {
  apiVersion: '2025-02-24.acacia', // 型エラーを修正
  typescript: true,
  httpClient: Stripe.createFetchHttpClient(), // Fetch APIベースのクライアントを使用
});

export default stripe; 