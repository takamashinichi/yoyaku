import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

// 仮のルームデータ (rooms.tsxと同じデータ)
const DUMMY_ROOMS = [
  {
    id: 1,
    name: 'スタンダードルーム',
    description: '快適な空間で、ビジネスや観光の拠点に最適。高速Wi-Fiと作業スペースを完備。',
    price: 12000,
    capacity: 2,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427'
  },
  {
    id: 2,
    name: 'デラックスルーム',
    description: '広々とした空間で、くつろぎのひとときをお過ごしいただけます。バルコニー付きの客室でリラックス。',
    price: 18000,
    capacity: 2,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a'
  },
  {
    id: 3,
    name: 'スイートルーム',
    description: '最高級の宿泊体験をご提供。広々としたリビングスペースと寝室を備えた贅沢な空間。',
    price: 30000,
    capacity: 4,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39'
  }
];

export default function Reservation() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [guests, setGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reservationNumber, setReservationNumber] = useState('');
  const [error, setError] = useState('');
  
  const [roomData, setRoomData] = useState<{
    id: number;
    name: string;
    price: number;
    capacity: number;
  } | null>(null);
  
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [nights, setNights] = useState(0);
  
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    
    const { roomId, checkIn: checkInParam, checkOut: checkOutParam, nights: nightsParam } = router.query;
    
    // クエリパラメータのバリデーション
    if (!roomId || !checkInParam || !checkOutParam || !nightsParam) {
      router.push('/');
      return;
    }
    
    // 部屋情報の設定
    const roomIdNumber = parseInt(roomId as string, 10);
    const room = DUMMY_ROOMS.find(r => r.id === roomIdNumber);
    
    if (!room) {
      router.push('/rooms');
      return;
    }
    
    setRoomData({
      id: room.id,
      name: room.name,
      price: room.price,
      capacity: room.capacity
    });
    
    setCheckIn(checkInParam as string);
    setCheckOut(checkOutParam as string);
    setNights(parseInt(nightsParam as string, 10));
    
  }, [router.isReady, router.query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 入力バリデーション
    if (!name || !email || !phone) {
      setError('氏名、メール、電話番号は必須項目です');
      return;
    }
    
    if (guests < 1) {
      setError('宿泊人数は1名以上で入力してください');
      return;
    }
    
    // エラーをクリア
    setError('');
    
    // 送信中フラグを設定
    setIsSubmitting(true);
    
    // 予約情報をAPIに送信（この例ではモックデータを使用）
    // 実際の実装ではここでバックエンドAPIを呼び出して予約データを保存します
    setTimeout(() => {
      // 予約番号を生成（実際はサーバーから返される）
      const reservationId = 'RES' + Date.now().toString().slice(-8);
      
      // 決済ページに遷移
      // 必要なデータをクエリパラメータで渡す
      router.push({
        pathname: '/checkout',
        query: {
          reservationId: reservationId,
          amount: roomData ? roomData.price * nights : 0,
          roomName: roomData?.name,
          checkIn: checkIn,
          checkOut: checkOut,
          guestName: name
        }
      });
      
      // 送信完了
      setIsSubmitting(false);
    }, 1000);
  };

  // 日付をフォーマット
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Head>
          <title>予約完了 | 宿泊予約システム</title>
          <meta name="description" content="宿泊予約が完了しました。素敵な滞在をお楽しみください。" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header />

        <main className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="bg-white rounded-xl shadow-elegant p-8 animate-fade-in">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-check-line text-4xl text-primary-600"></i>
                </div>
                <h1 className="text-3xl font-bold mb-2">ご予約ありがとうございます</h1>
                <p className="text-gray-600 mb-1">
                  予約番号: <span className="font-bold text-primary-600">{reservationNumber}</span>
                </p>
                <p className="text-gray-600">
                  予約内容の詳細は、ご登録いただいたメールアドレスに送信されます
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2">予約内容</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm text-gray-500">お名前</dt>
                        <dd className="font-medium text-gray-900">{name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">メールアドレス</dt>
                        <dd className="font-medium text-gray-900">{email}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">電話番号</dt>
                        <dd className="font-medium text-gray-900">{phone}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">宿泊人数</dt>
                        <dd className="font-medium text-gray-900">{guests}名</dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm text-gray-500">部屋タイプ</dt>
                        <dd className="font-medium text-gray-900">{roomData?.name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">チェックイン</dt>
                        <dd className="font-medium text-gray-900">{formatDate(checkIn)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">チェックアウト</dt>
                        <dd className="font-medium text-gray-900">{formatDate(checkOut)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">宿泊数</dt>
                        <dd className="font-medium text-gray-900">{nights}泊</dd>
                      </div>
                    </dl>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">合計金額</span>
                    <span className="text-2xl font-bold text-primary-600">¥{(roomData?.price || 0) * nights}<span className="text-sm font-normal text-gray-500">（税込）</span></span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  href="/" 
                  className="btn-primary"
                >
                  トップページに戻る <i className="ri-home-line ml-1"></i>
                </Link>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>予約情報入力 | 宿泊予約システム</title>
        <meta name="description" content="快適な宿泊のための予約情報を入力してください。" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-3xl font-bold text-center mb-10">予約情報の入力</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 予約内容確認 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-card p-6 animate-fade-in">
                <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-100">予約内容</h2>
                {roomData && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{roomData.name}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <i className="ri-user-line mr-1"></i>
                        <span>最大{roomData.capacity}名</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">チェックイン</span>
                        <span className="font-medium">{formatDate(checkIn)}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">チェックアウト</span>
                        <span className="font-medium">{formatDate(checkOut)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">宿泊数</span>
                        <span className="font-medium">{nights}泊</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">合計</span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary-600">¥{(roomData.price * nights).toLocaleString()}</div>
                          <div className="text-xs text-gray-500">（税込）</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* 予約フォーム */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-card p-6 animate-fade-in">
                <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-100">お客様情報</h2>
                
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
                    <div className="flex">
                      <i className="ri-error-warning-line mr-2 text-lg"></i>
                      <p>{error}</p>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        氏名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        メールアドレス <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        電話番号 <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                        宿泊人数 <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="guests"
                        type="number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value, 10))}
                        min="1"
                        max={roomData?.capacity || 4}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="requests" className="block text-sm font-medium text-gray-700 mb-1">
                      特別リクエスト（任意）
                    </label>
                    <textarea
                      id="requests"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
                    <Link 
                      href="/rooms" 
                      className="btn-outline order-2 sm:order-1"
                    >
                      <i className="ri-arrow-left-line mr-1"></i> 戻る
                    </Link>
                    
                    <button 
                      type="submit" 
                      className="btn-primary order-1 sm:order-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          処理中...
                        </>
                      ) : (
                        <>予約を確定する <i className="ri-check-line ml-1"></i></>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 