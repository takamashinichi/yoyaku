import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const plans = await prisma.plan.findMany()
      res.status(200).json(plans)
    } catch (error) {
      console.error('プラン取得エラー:', error)
      res.status(500).json({ error: 'プラン情報の取得に失敗しました' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 