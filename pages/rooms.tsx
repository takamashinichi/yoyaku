import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';

// 仮の部屋データ
const DUMMY_ROOMS = [
  {
    id: 1,
    name: 'スタンダードルーム',
    description: '快適な空間で、ビジネスや観光の拠点に最適。高速Wi-Fiと作業スペースを完備。',
    price: 12000,
    capacity: 2,
    size: 22,
    features: ['無料Wi-Fi', 'デスクワークスペース', '液晶テレビ', 'バスアメニティ', '冷蔵庫'],
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
  },
  {
    id: 2,
    name: 'デラックスルーム',
    description: '広々とした空間で、くつろぎのひとときをお過ごしいただけます。バルコニー付きの客室でリラックス。',
    price: 18000,
    capacity: 2,
    size: 30,
    features: ['無料Wi-Fi', 'バルコニー', '50インチ液晶テレビ', '高級バスアメニティ', 'ミニバー', 'コーヒーメーカー'],
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
  },
  {
    id: 3,
    name: 'スイートルーム',
    description: '最高級の宿泊体験をご提供。広々としたリビングスペースと寝室を備えた贅沢な空間。',
    price: 30000,
    capacity: 4,
    size: 55,
    features: ['無料Wi-Fi', 'セパレートリビング', '65インチ有機ELテレビ', 'バスタブ付き広々浴室', '高級バスアメニティ', 'ミニバー', 'エスプレッソマシン'],
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  }
];

export default function Rooms() {
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [nights, setNights] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // URLクエリパラメータから日付を取得
    const { checkIn: checkInParam, checkOut: checkOutParam } = router.query;
    
    if (typeof checkInParam === 'string' && typeof checkOutParam === 'string') {
      setCheckIn(checkInParam);
      setCheckOut(checkOutParam);
      
      // 宿泊日数を計算
      const checkInDate = new Date(checkInParam);
      const checkOutDate = new Date(checkOutParam);
      const diffTime = checkOutDate.getTime() - checkInDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays);
      
      // 読み込み状態を終了（実際のアプリではAPIリクエスト後に設定）
      setTimeout(() => setLoading(false), 800);
    } else if (router.isReady) {
      // 日付情報がない場合はトップページにリダイレクト
      router.push('/');
    }
  }, [router.isReady, router.query]);

  const handleReservation = (roomId: number) => {
    // 予約ページへ遷移
    router.push({
      pathname: '/reservation',
      query: {
        roomId,
        checkIn,
        checkOut,
        nights
      }
    });
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-6"></div>
            <h2 className="text-xl font-semibold mb-2">検索中...</h2>
            <p className="text-gray-600">お部屋の空室状況を確認しています</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>お部屋選択 | 宿泊予約システム</title>
        <meta name="description" content="様々なタイプのお部屋から、ご希望に合ったお部屋をお選びください。" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow">
        {/* 検索情報バナー */}
        <div className="bg-secondary-900 text-white py-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="mb-2 sm:mb-0">
                <h2 className="text-lg font-semibold">空室検索結果</h2>
                <p className="text-secondary-200">
                  <span className="font-medium">{formatDate(checkIn)} 〜 {formatDate(checkOut)}</span>
                  <span className="ml-2">（{nights}泊）</span>
                </p>
              </div>
              <Link 
                href="/"
                className="btn-outline text-white border-white hover:bg-white hover:text-secondary-900 text-sm"
              >
                <i className="ri-search-line mr-1"></i> 検索条件を変更
              </Link>
            </div>
          </div>
        </div>

        {/* 部屋リスト */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-8 text-center">お好みのお部屋をお選びください</h1>
            
            <div className="space-y-8">
              {DUMMY_ROOMS.map((room) => (
                <div 
                  key={room.id}
                  className="bg-white rounded-xl shadow-card hover:shadow-elegant transition-all duration-300 overflow-hidden animate-fade-in"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="md:col-span-1 relative h-64 md:h-full">
                      <Image 
                        src={room.image} 
                        alt={room.name} 
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="md:col-span-2 p-6">
                      <div className="flex flex-col h-full">
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h2 className="text-2xl font-bold">{room.name}</h2>
                            <div className="flex items-center">
                              <i className="ri-user-line text-gray-400 mr-1"></i>
                              <span className="text-gray-600">最大{room.capacity}名</span>
                              <span className="mx-2 text-gray-300">|</span>
                              <i className="ri-ruler-line text-gray-400 mr-1"></i>
                              <span className="text-gray-600">{room.size}㎡</span>
                            </div>
                          </div>
                          <p className="text-gray-600">{room.description}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                          {room.features.map((feature, index) => (
                            <span key={index} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                              {feature}
                            </span>
                          ))}
                        </div>
                        
                        <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between">
                          <div className="mb-4 sm:mb-0">
                            <div className="text-sm text-gray-500">料金 ({nights}泊)</div>
                            <div className="text-3xl font-bold text-primary-600">¥{(room.price * nights).toLocaleString()}<span className="text-sm font-normal text-gray-500">（税込）</span></div>
                          </div>
                          <button 
                            className="btn-primary"
                            onClick={() => handleReservation(room.id)}
                          >
                            このお部屋を予約する <i className="ri-arrow-right-line ml-1"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 