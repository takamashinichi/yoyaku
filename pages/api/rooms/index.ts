import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const rooms = await prisma.room.findMany()
      res.status(200).json(rooms)
    } catch (error) {
      console.error('部屋取得エラー:', error)
      res.status(500).json({ error: '部屋情報の取得に失敗しました' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 