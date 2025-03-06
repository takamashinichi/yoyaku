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

    // 金額のバリデーション
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: '有効な金額を指定してください' });
    }

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
    });
  } catch (error) {
    console.error('Stripe Payment Intent作成エラー:', error);
    res.status(500).json({ error: '決済処理の初期化に失敗しました' });
  }
} 