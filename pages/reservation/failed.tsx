// pages/reservation/failed.tsx – 予約失敗
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'

export default function ReservationFailedPage() {
  const router = useRouter()

  const backToHome = () => {
    router.push('/')
  }

  const tryAgain = () => {
    // 新しい予約フローを開始
    router.push('/')
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>予約失敗 | 宿泊予約システム</title>
        <meta name="description" content="宿泊予約が完了しませんでした" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>予約が完了しませんでした</h1>

        <div className={styles.dateSelectionForm}>
          <div className={styles.card}>
            <h2>決済処理が中断されました</h2>
            <p className={styles.errorMessage}>
              お客様の予約手続きが完了しませんでした。<br />
              決済がキャンセルされたか、エラーが発生した可能性があります。
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button 
                onClick={tryAgain} 
                className={styles.button}
              >
                再度予約する
              </button>
              
              <button 
                onClick={backToHome} 
                className={styles.button}
                style={{ backgroundColor: '#6c757d' }}
              >
                トップページへ戻る
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2023 宿泊予約システム</p>
      </footer>
    </div>
  )
} 