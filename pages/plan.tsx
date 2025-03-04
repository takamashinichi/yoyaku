// pages/plan.tsx – プランと部屋の選択
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

interface Plan { 
  id: number; 
  name: string; 
  description: string | null;
  price: number 
}

interface Room { 
  id: number; 
  name: string; 
  capacity: number;
  price: number 
}

export default function PlanSelectPage() {
  const router = useRouter()
  const { checkIn, checkOut } = router.query  // 前画面から渡された日付
  const [plans, setPlans] = useState<Plan[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // URLパラメータが利用可能になったら
    if (checkIn && checkOut) {
      // プランと部屋の一覧を取得（APIルートからデータフェッチ）
      setIsLoading(true)
      Promise.all([
        fetch('/api/plans').then(res => res.json()),
        fetch('/api/rooms').then(res => res.json())
      ]).then(([plansData, roomsData]) => {
        setPlans(plansData)
        setRooms(roomsData)
        setIsLoading(false)
      }).catch(err => {
        console.error('データ取得エラー:', err)
        setError('データの取得に失敗しました')
        setIsLoading(false)
      })
    }
  }, [checkIn, checkOut])

  const goToGuestInfo = () => {
    if (selectedPlan !== null && selectedRoom !== null && checkIn && checkOut) {
      // 宿泊者情報入力ページへ、選択内容と日付をクエリで渡す
      router.push(
        `/guest-info?planId=${selectedPlan}&roomId=${selectedRoom}&checkIn=${checkIn}&checkOut=${checkOut}`
      )
    }
  }

  // 宿泊料金の計算
  const calculateTotalPrice = () => {
    if (selectedPlan === null || selectedRoom === null || !checkIn || !checkOut) return 0

    const selectedPlanObj = plans.find(p => p.id === selectedPlan)
    const selectedRoomObj = rooms.find(r => r.id === selectedRoom)
    
    if (!selectedPlanObj || !selectedRoomObj) return 0
    
    const checkInDate = new Date(checkIn as string)
    const checkOutDate = new Date(checkOut as string)
    const nights = Math.max(1, Math.round(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    ))
    
    return (selectedPlanObj.price + selectedRoomObj.price) * nights
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>プラン・部屋の選択 | 宿泊予約システム</title>
        <meta name="description" content="宿泊プランと部屋を選択" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>宿泊プランと部屋の選択</h1>
        
        {isLoading ? (
          <p>データを読み込み中...</p>
        ) : error ? (
          <p className={styles.errorMessage}>{error}</p>
        ) : (
          <div style={{ width: '100%', maxWidth: '600px' }}>
            <div className={styles.dateSelectionForm}>
              <h2>宿泊プランを選択</h2>
              <div className={styles.grid}>
                {plans.map(plan => (
                  <div 
                    key={plan.id}
                    className={`${styles.planCard} ${selectedPlan === plan.id ? styles.selected : ''}`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <h3>{plan.name}</h3>
                    {plan.description && <p>{plan.description}</p>}
                    <p className={styles.priceTag}>¥{plan.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <h2>部屋を選択</h2>
              <div className={styles.grid}>
                {rooms.map(room => (
                  <div 
                    key={room.id}
                    className={`${styles.roomCard} ${selectedRoom === room.id ? styles.selected : ''}`}
                    onClick={() => setSelectedRoom(room.id)}
                  >
                    <h3>{room.name}</h3>
                    <p>定員: {room.capacity}名</p>
                    <p className={styles.priceTag}>¥{room.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {selectedPlan !== null && selectedRoom !== null && (
                <div className={styles.summaryBox}>
                  <h3>料金概算</h3>
                  <p>
                    チェックイン: {checkIn}<br />
                    チェックアウト: {checkOut}
                  </p>
                  <p className={styles.priceTag}>
                    合計: ¥{calculateTotalPrice().toLocaleString()}
                  </p>
                </div>
              )}

              <button 
                onClick={goToGuestInfo} 
                disabled={selectedPlan === null || selectedRoom === null}
                className={styles.button}
              >
                次へ
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2023 宿泊予約システム</p>
      </footer>
    </div>
  )
} 