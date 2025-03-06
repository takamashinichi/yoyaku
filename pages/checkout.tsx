// pages/checkout.tsx – 支払い（Stripe決済）
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CheckoutForm from '../components/CheckoutForm'
import ErrorMessage from '../components/ErrorMessage'
import AlternativePaymentOptions from '../components/AlternativePaymentOptions'
import styles from '../styles/Home.module.css'

// Stripeの公開可能キーを使って初期化
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

const CheckoutPage: React.FC = () => {
  const router = useRouter()
  const [clientSecret, setClientSecret] = useState<string>('')
  const [amount, setAmount] = useState<number>(0)
  const [reservation, setReservation] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<string | null>(null)

  useEffect(() => {
    // URLからパラメータを取得
    const { 
      reservationId, 
      amount: queryAmount,
      roomName,
      checkIn,
      checkOut,
      guestName
    } = router.query;
    
    // 決済に必要な情報をURLパラメータから取得
    if (reservationId && queryAmount) {
      const parsedAmount = parseInt(queryAmount as string, 10);
      setAmount(parsedAmount);
      
      // 予約情報を設定
      setReservation({
        id: reservationId as string,
        roomType: roomName as string || 'お部屋',
        checkIn: checkIn as string || '未設定',
        checkOut: checkOut as string || '未設定',
        guestName: guestName as string || 'ゲスト',
        totalPrice: parsedAmount,
      });
      
      // PaymentIntentを作成するAPIを呼び出し
      fetchPaymentIntent(parsedAmount, reservationId as string);
    } else {
      setError('予約情報が不足しています');
      setErrorCode('MISSING_PARAMS');
      setLoading(false);
    }
  }, [router.query]);

  // 日付をフォーマット
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // PaymentIntentを作成
  const fetchPaymentIntent = async (amount: number, reservationId: string) => {
    try {
      console.log('Stripe API Key設定の確認中...');
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.includes('sk_test_51...')) {
        throw new Error('Stripe API Keyが正しく設定されていません。環境変数を確認してください。');
      }
      
      const response = await fetch('/api/payment/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount,
          metadata: {
            reservationId,
          },
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || '決済の初期化に失敗しました');
      }
      
      const data = await response.json();
      if (!data.clientSecret) {
        throw new Error('決済の初期化中にエラーが発生しました: Client Secretが取得できませんでした');
      }
      
      setClientSecret(data.clientSecret);
      setLoading(false);
    } catch (error: any) {
      console.error('Payment intent creation error:', error);
      let errorMessage = '決済の初期化中にエラーが発生しました。';
      let code = 'PAYMENT_INIT_ERROR';
      
      // より詳細なエラーメッセージ
      if (error instanceof Error) {
        if (error.message.includes('API Key')) {
          errorMessage = 'Stripe APIキーが正しく設定されていません。管理者にお問い合わせください。';
          code = 'INVALID_API_KEY';
        } else if (error.message.includes('network') || error.message.includes('connection')) {
          errorMessage = 'ネットワーク接続に問題があります。インターネット接続を確認して再度お試しください。';
          code = 'NETWORK_ERROR';
        }
      }
      
      setError(errorMessage);
      setErrorCode(code);
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    router.push('/reservation/complete');
  };

  const handleError = (errorMsg: string) => {
    setError(errorMsg);
    setErrorCode('PAYMENT_PROCESS_ERROR');
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setErrorCode(null);
    if (reservation && reservation.id) {
      fetchPaymentIntent(amount, reservation.id);
    } else {
      router.reload();
    }
  };

  // Stripe Elementsのオプション
  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#4F46E5',
      colorBackground: '#ffffff',
      colorText: '#1F2937',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      borderRadius: '8px',
    },
  };

  const options = {
    clientSecret,
    appearance,
    locale: 'ja' as const,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>お支払い | 宿泊予約システム</title>
        <meta name="description" content="宿泊予約のお支払い手続きを行います。" />
      </Head>
      
      <Header />
      
      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">ご予約のお支払い</h1>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
              <p className="ml-3 text-lg">決済情報を読み込み中...</p>
            </div>
          ) : error ? (
            <div>
              <ErrorMessage 
                title="決済情報の読み込みエラー"
                message={error}
                code={errorCode || undefined}
                onRetry={handleRetry}
                showRetry={!errorCode?.includes('API_KEY')}
              />
              
              {reservation && (
                <AlternativePaymentOptions 
                  reservationId={reservation.id}
                  onBack={() => router.back()}
                />
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                {clientSecret ? (
                  <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm
                      amount={amount}
                      onSuccess={handleSuccess}
                      onError={handleError}
                    />
                  </Elements>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <p className="text-yellow-800">決済情報の読み込みに問題が発生しました。再読み込みしてください。</p>
                    <button 
                      onClick={handleRetry}
                      className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                    >
                      再読み込み
                    </button>
                  </div>
                )}
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
                <h2 className="text-xl font-semibold mb-4">予約情報</h2>
                {reservation && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">宿泊タイプ</p>
                      <p className="font-medium">{reservation.roomType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">チェックイン</p>
                      <p className="font-medium">{formatDate(reservation.checkIn)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">チェックアウト</p>
                      <p className="font-medium">{formatDate(reservation.checkOut)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">宿泊者名</p>
                      <p className="font-medium">{reservation.guestName}</p>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">支払い金額</p>
                        <p className="font-bold text-xl text-primary-700">
                          {amount.toLocaleString()}円
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">（税込）</p>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => router.back()}
                  className="mt-6 w-full py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                >
                  戻る
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default CheckoutPage