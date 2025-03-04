import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // 予約一覧の取得
    try {
      const reservations = await prisma.reservation.findMany({
        include: { room: true, plan: true }  // 関連する部屋・プラン情報も取得
      })
      res.status(200).json(reservations)
    } catch (error) {
      res.status(500).json({ error: '予約情報の取得に失敗しました' })
    }
  } 
  else if (req.method === 'POST') {
    // 新規予約の作成
    try {
      const { guestName, guestEmail, checkIn, checkOut, planId, roomId } = req.body
      
      // 日付のバリデーション
      const checkInDate = new Date(checkIn)
      const checkOutDate = new Date(checkOut)
      
      if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        return res.status(400).json({ error: '無効な日付形式です' })
      }
      
      if (checkInDate >= checkOutDate) {
        return res.status(400).json({ error: 'チェックアウト日はチェックイン日より後にしてください' })
      }
      
      // 部屋の予約重複チェック
      const overlapReservations = await prisma.reservation.findMany({
        where: {
          roomId: Number(roomId),
          OR: [
            {
              // 選択期間に既存の予約が含まれる
              AND: [
                { checkIn: { lte: new Date(checkIn) } },
                { checkOut: { gte: new Date(checkIn) } }
              ]
            },
            {
              // 選択期間内に既存の予約が始まる
              AND: [
                { checkIn: { gte: new Date(checkIn) } },
                { checkIn: { lt: new Date(checkOut) } }
              ]
            }
          ]
        }
      })
      
      if (overlapReservations.length > 0) {
        return res.status(409).json({ 
          error: '選択した期間に既に予約が入っています。別の日程または部屋を選択してください' 
        })
      }
      
      // プラン・部屋情報を取得して総額を計算
      const plan = await prisma.plan.findUnique({ where: { id: Number(planId) } })
      const room = await prisma.room.findUnique({ where: { id: Number(roomId) } })
      
      if (!plan || !room) {
        return res.status(400).json({ error: '指定されたプランまたは部屋が見つかりません' })
      }
      
      const nights = Math.max(1, Math.round(
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000*60*60*24)
      ))
      const totalPrice = (plan.price + room.price) * nights
      
      // 予約レコードの作成
      const newReservation = await prisma.reservation.create({
        data: {
          guestName,
          guestEmail,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          planId: Number(planId),
          roomId: Number(roomId),
          totalPrice
        }
      })
      res.status(201).json(newReservation)
    } catch (error) {
      console.error('予約作成エラー:', error)
      res.status(500).json({ error: '予約の作成に失敗しました' })
    }
  } 
  else {
    // その他のメソッドは許可しない
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 