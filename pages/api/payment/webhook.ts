import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import stripe from '../../../lib/stripe';

// raw bodyを解析するための設定
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as string;

  if (!sig) {
    return res.status(400).json({ error: 'Missing Stripe signature' });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(500).json({ error: 'Stripe webhook secret is not set' });
  }

  let event: Stripe.Event;

  try {
    // Webhookシグネチャを検証
    event = stripe.webhooks.constructEvent(
      buf.toString(),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  // イベントタイプに基づいて処理
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      
      // 他のイベントタイプに応じて処理を追加
      
      default:
        console.log(`処理されていないイベントタイプ: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook処理エラー:', err);
    res.status(500).json({ error: 'Webhook処理中にエラーが発生しました' });
  }
}

// 決済成功時の処理
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);
  
  // 予約IDなどのメタデータを取得
  const { reservationId } = paymentIntent.metadata;
  
  if (reservationId) {
    // TODO: データベースの予約ステータスを「支払い完了」に更新
    // await prisma.reservation.update({
    //   where: { id: reservationId },
    //   data: { paymentStatus: 'PAID' },
    // });
    
    // TODO: 予約確認メールを送信
  }
}

// 決済失敗時の処理
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed:', paymentIntent.id);
  
  const { reservationId } = paymentIntent.metadata;
  
  if (reservationId) {
    // TODO: データベースの予約ステータスを「支払い失敗」に更新
    // await prisma.reservation.update({
    //   where: { id: reservationId },
    //   data: { paymentStatus: 'FAILED' },
    // });
  }
} 