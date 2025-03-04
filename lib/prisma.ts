import { PrismaClient } from '@prisma/client'

// PrismaClientのグローバルインスタンス
let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  // 開発環境では接続を再利用
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient()
  }
  prisma = (global as any).prisma
}

export default prisma 