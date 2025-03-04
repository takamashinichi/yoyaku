// pages/guest-info.tsx – 宿泊者情報入力フォーム
import { useRouter } from 'next/router'
import { useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function GuestInfoPage() {
  const router = useRouter()
  const { planId, roomId, checkIn, checkOut } = router.query  // 選択済みのプラン・部屋・日付
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const validateForm = () => {
    if (!guestName.trim()) {
      setError('氏名を入力してください')
      return false
    }
    if (!guestEmail.trim()) {
      setError('メールアドレスを入力してください')
      return false
    }
    // 簡易的なメールアドレスの検証
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(guestEmail)) {
      setError('有効なメールアドレスを入力してください')
      return false
    }
    setError('')
    return true
  }

  const handleReserve = async () => {
    if (!validateForm()) return
    if (!planId || !roomId || !checkIn || !checkOut) {
      setError('予約情報が不完全です。もう一度最初からやり直してください')
      return
    }

    setIsLoading(true)
    try {
      // 予約作成API呼び出し
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName,
          guestEmail,
          checkIn,
          checkOut,
          planId: Number(planId),
          roomId: Number(roomId)
        })
      })
      const data = await res.json()
      
      if (res.ok) {
        // 予約IDと合計金額をクエリに付けて決済ページへ遷移
        router.push(`/checkout?reservationId=${data.id}&total=${data.totalPrice}`)
      } else {
        setError(data.error || '予約の作成に失敗しました')
      }
    } catch (err) {
      console.error('予約エラー:', err)
      setError('予約処理中にエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>宿泊者情報の入力 | 宿泊予約システム</title>
        <meta name="description" content="宿泊者情報の入力" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>宿泊者情報の入力</h1>

        <div className={styles.dateSelectionForm}>
          <h2>宿泊者情報</h2>

          <div className={styles.formGroup}>
            <label htmlFor="guestName">氏名:</label>
            <input 
              id="guestName"
              type="text" 
              value={guestName} 
              onChange={e => setGuestName(e.target.value)} 
              placeholder="氏名を入力" 
              className={styles.textInput}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="guestEmail">メールアドレス:</label>
            <input 
              id="guestEmail"
              type="email" 
              value={guestEmail} 
              onChange={e => setGuestEmail(e.target.value)} 
              placeholder="email@example.com" 
              className={styles.textInput}
            />
          </div>
          
          {error && <p className={styles.errorMessage}>{error}</p>}

          <div className={styles.summaryBox}>
            <h3>予約内容の確認</h3>
            <p>
              チェックイン: {checkIn}<br />
              チェックアウト: {checkOut}<br />
              プランID: {planId}<br />
              部屋ID: {roomId}
            </p>
          </div>
          
          <button 
            onClick={handleReserve} 
            disabled={isLoading || !guestName || !guestEmail}
            className={styles.button}
          >
            {isLoading ? (
              <>
                <span className={styles.loading}></span>
                処理中...
              </>
            ) : '予約を確定する'}
          </button>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2023 宿泊予約システム</p>
      </footer>
    </div>
  )
} 