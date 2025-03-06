// pages/reservation/complete.tsx – 予約完了
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const CompleteReservation: React.FC = () => {
  const router = useRouter();
  const [reservationDetails, setReservationDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // URLからpayment_intent_client_secretを取得
    const { payment_intent, payment_intent_client_secret } = router.query;

    if (payment_intent) {
      // 支払いが完了した場合、予約詳細を取得（実際にはAPIから取得する）
      // ここではモックデータを使用
      setReservationDetails({
        id: 'R' + Math.floor(Math.random() * 10000),
        status: '確認済み',
        paymentStatus: '支払い完了',
        roomType: 'デラックスルーム',
        checkIn: '2023-12-01',
        checkOut: '2023-12-03',
        guestName: '山田太郎',
        totalAmount: 45000,
        paymentId: payment_intent,
      });
      setLoading(false);
    } else if (router.isReady) {
      // payment_intentが存在しない場合（直接アクセスなど）
      setError('予約情報の取得に失敗しました。有効な予約経路からアクセスしてください。');
      setLoading(false);
    }
  }, [router.isReady, router.query]);

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>予約完了 | 宿泊予約システム</title>
        <meta name="description" content="宿泊予約が完了しました" />
      </Head>

      <Header />

      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
              <p className="ml-3 text-lg">予約情報を読み込み中...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p>{error}</p>
              <Link href="/">
                <a className="mt-3 inline-block text-sm font-medium text-red-600 hover:text-red-500">
                  トップページに戻る
                </a>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">予約が完了しました</h1>
                <p className="mt-2 text-lg text-gray-600">
                  お支払いと予約手続きが正常に完了しました。ご予約内容の詳細は以下をご確認ください。
                </p>
              </div>

              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h2 className="text-lg font-medium text-gray-900">予約詳細</h2>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    予約ID: {reservationDetails.id}
                  </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">予約ステータス</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {reservationDetails.status}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">支払いステータス</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {reservationDetails.paymentStatus}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">宿泊タイプ</dt>
                      <dd className="mt-1 text-sm text-gray-900">{reservationDetails.roomType}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">宿泊者名</dt>
                      <dd className="mt-1 text-sm text-gray-900">{reservationDetails.guestName}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">チェックイン</dt>
                      <dd className="mt-1 text-sm text-gray-900">{reservationDetails.checkIn}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">チェックアウト</dt>
                      <dd className="mt-1 text-sm text-gray-900">{reservationDetails.checkOut}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">支払い金額</dt>
                      <dd className="mt-1 text-sm text-gray-900 font-bold">
                        {reservationDetails.totalAmount.toLocaleString()}円
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">決済ID</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {reservationDetails.paymentId}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
                <Link href="/">
                  <a className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    トップページに戻る
                  </a>
                </Link>
                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                  予約詳細を印刷
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CompleteReservation; 