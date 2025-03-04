import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 管理者ユーザーの作成（簡易的にパスワードは平文。実際には必ずハッシュ化すること）
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: 'adminpassword123',
      role: 'admin'
    }
  })

  // 部屋の作成
  const room1 = await prisma.room.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'スタンダードシングル',
      capacity: 1,
      price: 8000
    }
  })

  const room2 = await prisma.room.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'デラックスシングル',
      capacity: 1,
      price: 10000
    }
  })

  const room3 = await prisma.room.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'スタンダードツイン',
      capacity: 2,
      price: 15000
    }
  })

  const room4 = await prisma.room.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: 'デラックスツイン',
      capacity: 2,
      price: 20000
    }
  })

  // 宿泊プランの作成
  const plan1 = await prisma.plan.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: '素泊まりプラン',
      description: '食事なしの素泊まりプランです',
      price: 0
    }
  })

  const plan2 = await prisma.plan.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: '朝食付きプラン',
      description: '朝食付きのプランです',
      price: 2000
    }
  })

  const plan3 = await prisma.plan.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: '2食付きプラン',
      description: '朝食と夕食が付いたプランです',
      price: 5000
    }
  })

  console.log('シードデータを作成しました')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 