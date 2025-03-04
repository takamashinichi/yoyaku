import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15'
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end('Method Not Allowed')
  }
  try {
    const { reservationId } = req.body
    // 予約情報を取得
    const reservation = await prisma.reservation.findUnique({
      where: { id: Number(reservationId) },
      include: { room: true, plan: true }
    })
    if (!reservation) {
      return res.status(400).json({ error: '無効な予約IDです' })
    }
    // 決済金額と商品名を設定
    const amount = reservation.totalPrice
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: `${reservation.room.name} (${reservation.plan.name})`  // 商品名を部屋名+プラン名に
            },
            unit_amount: amount  // 日本円の場合は単位がそのまま円になる
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/reservation/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/reservation/failed`
    })
    // セッションIDをクライアントに返す
    res.status(200).json({ sessionId: session.id })
  } catch (error: any) {
    console.error('Stripeエラー:', error)
    res.status(500).json({ error: 'Stripe決済の作成に失敗しました' })
  }
} 