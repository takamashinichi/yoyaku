// pages/checkout.tsx – 支払い（Stripe決済）
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { loadStripe } from '@stripe/stripe-js'
import styles from '../styles/Home.module.css'

// Stripeの公開可能キーを使って初期化
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

export default function CheckoutPage() {
  const router = useRouter()
  const { reservationId, total } = router.query  // 予約IDと合計金額
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // URLパラメータのバリデーション
  useEffect(() => {
    if (router.isReady && (!reservationId || !total)) {
      setError('予約情報が不完全です。もう一度最初からやり直してください')
    }
  }, [router.isReady, reservationId, total])

  const handlePayment = async () => {
    if (!reservationId) return
    
    setLoading(true)
    try {
      // 決済セッション作成をAPI経由でリクエスト
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId: Number(reservationId) })
      })
      const data = await res.json()
      
      if (res.ok && data.sessionId) {
        const stripe = await stripePromise
        if (stripe) {
          // Stripeのチェックアウトページへ遷移
          const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId })
          if (error) {
            setError(`決済の初期化に失敗しました: ${error.message}`)
          }
        } else {
          setError('Stripeの初期化に失敗しました')
        }
      } else {
        setError(data.error || '決済の処理に失敗しました')
      }
    } catch (err) {
      console.error('決済エラー:', err)
      setError('決済処理中にエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>お支払い | 宿泊予約システム</title>
        <meta name="description" content="宿泊予約の決済手続き" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>お支払い手続き</h1>

        <div className={styles.dateSelectionForm}>
          <h2>お支払い情報</h2>

          {error ? (
            <p className={styles.errorMessage}>{error}</p>
          ) : (
            <>
              <div className={styles.summaryBox}>
                <h3>予約内容</h3>
                <p>予約ID: {reservationId}</p>
                {total && <p className={styles.priceTag}>お支払い金額: ¥{Number(total).toLocaleString()}</p>}
              </div>
              
              <p>
                「お支払いに進む」ボタンをクリックすると、Stripeの安全な決済ページに移動します。
                クレジットカード情報を入力して、予約を完了してください。
              </p>
              
              <button 
                onClick={handlePayment} 
                disabled={loading || !reservationId}
                className={styles.button}
              >
                {loading ? (
                  <>
                    <span className={styles.loading}></span>
                    処理中...
                  </>
                ) : 'お支払いに進む'}
              </button>
            </>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2023 宿泊予約システム</p>
      </footer>
    </div>
  )
}