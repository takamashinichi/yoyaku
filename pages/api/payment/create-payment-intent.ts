import { NextApiRequest, NextApiResponse } from 'next';
import stripe from '../../../lib/stripe';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, currency = 'jpy', metadata = {} } = req.body;

    // APIキーの検証
    if (!process.env.STRIPE_SECRET_KEY || 
        process.env.STRIPE_SECRET_KEY === 'sk_test_51...' ||
        process.env.STRIPE_SECRET_KEY.startsWith('sk_test_*')) {
      console.error('無効なStripe APIキー');
      return res.status(500).json({ 
        error: 'Stripe APIキーが正しく設定されていません。', 
        code: 'invalid_api_key' 
      });
    }

    // 金額のバリデーション
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ 
        error: '有効な金額を指定してください',
        code: 'invalid_amount'
      });
    }

    try {
      // PaymentIntentを作成
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // クライアントシークレットを返す（クライアント側で決済処理に使用）
      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id
      });
    } catch (stripeError: any) {
      console.error('Stripe API Error:', stripeError);
      
      // Stripeエラーの種類に応じたメッセージ
      let errorMessage = '決済処理の初期化に失敗しました';
      let errorCode = 'stripe_error';
      
      if (stripeError.type === 'StripeAuthenticationError') {
        errorMessage = 'Stripe認証エラー: APIキーを確認してください';
        errorCode = 'authentication_error';
      } else if (stripeError.type === 'StripeConnectionError') {
        errorMessage = 'Stripeサーバーへの接続に失敗しました';
        errorCode = 'connection_error';
      } else if (stripeError.type === 'StripeRateLimitError') {
        errorMessage = 'リクエストが多すぎます。しばらく待ってから再試行してください';
        errorCode = 'rate_limit_error';
      }
      
      return res.status(500).json({ 
        error: errorMessage,
        code: errorCode,
        details: process.env.NODE_ENV === 'development' ? stripeError.message : undefined
      });
    }
  } catch (error) {
    console.error('Stripe Payment Intent作成エラー:', error);
    res.status(500).json({ 
      error: '決済処理の初期化に失敗しました',
      code: 'server_error'
    });
  }
} 