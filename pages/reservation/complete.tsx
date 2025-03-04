// pages/reservation/complete.tsx – 予約完了
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'

export default function ReservationCompletePage() {
  const router = useRouter()
  const { session_id } = router.query  // Stripeから渡されたセッションID

  const backToHome = () => {
    router.push('/')
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>予約完了 | 宿泊予約システム</title>
        <meta name="description" content="宿泊予約が完了しました" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>予約が完了しました</h1>

        <div className={styles.dateSelectionForm}>
          <div className={styles.card}>
            <h2>ご予約ありがとうございます</h2>
            <p>
              お客様の予約が正常に確定されました。<br />
              登録したメールアドレスに予約確認メールをお送りしています。
            </p>
            
            {session_id && (
              <div className={styles.summaryBox}>
                <h3>予約情報</h3>
                <p>決済ID: {session_id}</p>
              </div>
            )}
            
            <button 
              onClick={backToHome} 
              className={styles.button}
              style={{ marginTop: '2rem' }}
            >
              トップページへ戻る
            </button>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2023 宿泊予約システム</p>
      </footer>
    </div>
  )
} 