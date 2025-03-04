// pages/index.tsx - トップページ/宿泊日選択
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function HomePage() {
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    // バリデーション
    if (!checkInDate || !checkOutDate) {
      setError('チェックイン日とチェックアウト日を入力してください')
      return
    }

    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    
    if (checkOut <= checkIn) {
      setError('チェックアウト日はチェックイン日より後の日付にしてください')
      return
    }

    // エラーをクリア
    setError('')
    
    // 部屋選択ページに遷移
    router.push({
      pathname: '/rooms',
      query: { 
        checkIn: checkInDate, 
        checkOut: checkOutDate 
      }
    })
  }

  // 今日の日付を取得してデフォルト値に設定
  const today = new Date()
  const minDate = today.toISOString().split('T')[0]
  
  // デフォルトのチェックアウト日（チェックイン日の翌日）
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const defaultCheckOut = tomorrow.toISOString().split('T')[0]

  // 特徴一覧
  const features = [
    {
      icon: 'ri-hotel-bed-line',
      title: '豪華な客室',
      description: '上質な空間でゆったりとお過ごしいただけます'
    },
    {
      icon: 'ri-restaurant-line',
      title: '美食体験',
      description: '地元の食材を活かした料理をお楽しみください'
    },
    {
      icon: 'ri-service-line',
      title: 'おもてなし',
      description: '一流のスタッフによる心のこもったサービス'
    },
    {
      icon: 'ri-spa-line',
      title: 'リラクゼーション',
      description: 'スパ&温泉で心身ともにリフレッシュ'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>宿泊予約システム | 最高の宿泊体験</title>
        <meta name="description" content="最高の宿泊体験をご提供します。快適な客室と心のこもったサービスで、忘れられない思い出をお手伝いします。" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      {/* ヒーローセクション */}
      <div className="relative h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')" 
          }}
        ></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white leading-tight mb-6">
              最高の<span className="text-primary-400">宿泊体験</span>をご提供します
            </h1>
            <p className="text-xl text-white/90 mb-8">
              快適な客室と心のこもったサービスで、忘れられない思い出をお手伝いします
            </p>
            <a href="#reservation" className="btn-primary text-lg px-8 py-4">
              今すぐ予約する <i className="ri-arrow-right-line ml-2"></i>
            </a>
          </div>
        </div>
      </div>

      {/* 予約フォームセクション */}
      <section id="reservation" className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-elegant p-6 sm:p-10 -mt-24 relative z-30">
            <h2 className="text-3xl font-bold text-center mb-8">宿泊日を選択</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700 mb-1">
                    チェックイン日
                  </label>
                  <input
                    type="date"
                    id="checkInDate"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700 mb-1">
                    チェックアウト日
                  </label>
                  <input
                    type="date"
                    id="checkOutDate"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    min={checkInDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-red-700">{error}</p>
                </div>
              )}
              
              <div className="text-center">
                <button type="submit" className="btn-primary text-lg px-8 py-3 w-full md:w-auto">
                  空室を確認 <i className="ri-search-line ml-2"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">上質な宿泊体験</h2>
            <p className="text-gray-600 text-lg">
              当ホテルでは、お客様に最高の滞在をお約束します。上質なサービスと快適な環境で、特別な思い出を作りましょう。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 特徴1 */}
            <div className="bg-white p-8 rounded-xl shadow-card hover:shadow-elegant transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <i className="ri-hotel-bed-line text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">快適な客室</h3>
              <p className="text-gray-600 text-center">
                高品質のマットレスと寝具で、最高の睡眠をお約束します。全室防音対策済みで静かな環境をご提供。
              </p>
            </div>
            
            {/* 特徴2 */}
            <div className="bg-white p-8 rounded-xl shadow-card hover:shadow-elegant transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <i className="ri-restaurant-line text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">こだわりの食事</h3>
              <p className="text-gray-600 text-center">
                地元の新鮮な食材を使用した料理をご堪能いただけます。朝食から夕食まで、多彩なメニューをご用意。
              </p>
            </div>
            
            {/* 特徴3 */}
            <div className="bg-white p-8 rounded-xl shadow-card hover:shadow-elegant transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <i className="ri-service-line text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">専属スタッフ</h3>
              <p className="text-gray-600 text-center">
                経験豊富なスタッフが24時間対応。お客様のあらゆるご要望にお応えし、快適な滞在をサポートします。
              </p>
            </div>
            
            {/* 特徴4 */}
            <div className="bg-white p-8 rounded-xl shadow-card hover:shadow-elegant transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <i className="ri-wifi-line text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">充実の設備</h3>
              <p className="text-gray-600 text-center">
                高速Wi-Fi、最新のエンターテイメントシステム、温水プールなど、快適な滞在に必要な設備を完備。
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 