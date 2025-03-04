import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

interface Reservation {
  id: number;
  guestName: string;
  checkIn: string;
  checkOut: string;
  roomName: string;
  totalPrice: number;
  status: 'confirmed' | 'canceled' | 'completed';
}

const AdminReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // 実際のアプリケーションでは、APIからデータを取得します
    // この例では、ダミーデータを使用します
    const dummyReservations: Reservation[] = [
      {
        id: 1,
        guestName: '山田 太郎',
        checkIn: '2023/04/01',
        checkOut: '2023/04/03',
        roomName: 'デラックスツイン',
        totalPrice: 42000,
        status: 'confirmed'
      },
      {
        id: 2,
        guestName: '佐藤 花子',
        checkIn: '2023/04/05',
        checkOut: '2023/04/07',
        roomName: 'プレミアムダブル',
        totalPrice: 56000,
        status: 'confirmed'
      },
      {
        id: 3,
        guestName: '鈴木 一郎',
        checkIn: '2023/04/10',
        checkOut: '2023/04/12',
        roomName: 'スタンダードシングル',
        totalPrice: 28000,
        status: 'canceled'
      },
      {
        id: 4,
        guestName: '高橋 誠',
        checkIn: '2023/03/15',
        checkOut: '2023/03/18',
        roomName: 'デラックスツイン',
        totalPrice: 63000,
        status: 'completed'
      },
      {
        id: 5,
        guestName: '田中 美咲',
        checkIn: '2023/04/20',
        checkOut: '2023/04/22',
        roomName: 'プレミアムダブル',
        totalPrice: 48000,
        status: 'confirmed'
      },
    ];

    setReservations(dummyReservations);
    setIsLoading(false);
  }, []);

  // 予約をフィルタリングする関数
  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         reservation.roomName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || reservation.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // 予約ステータスに応じたバッジスタイルを返す関数
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // ステータスを日本語に変換する関数
  const translateStatus = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '確定';
      case 'canceled':
        return 'キャンセル';
      case 'completed':
        return '宿泊完了';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>予約管理 - 宿泊予約システム管理画面</title>
        <meta name="description" content="宿泊予約の管理" />
      </Head>

      <div className="flex">
        {/* サイドバー */}
        <div className="w-64 h-screen bg-gray-800 text-white fixed">
          <div className="p-4">
            <h1 className="text-xl font-semibold mb-8">宿泊予約システム<br />管理パネル</h1>
            <nav className="space-y-2">
              <Link href="/admin" className="block p-3 rounded hover:bg-gray-700 transition-colors">
                ダッシュボード
              </Link>
              <Link href="/admin/reservations" className="block p-3 rounded bg-blue-700 hover:bg-blue-600 transition-colors">
                予約管理
              </Link>
              <Link href="/admin/rooms" className="block p-3 rounded hover:bg-gray-700 transition-colors">
                客室管理
              </Link>
              <Link href="/" className="block p-3 rounded hover:bg-gray-700 transition-colors">
                サイトを表示
              </Link>
            </nav>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="ml-64 p-8 w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">予約管理</h2>
            <Link href="/admin/reservations/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              新規予約を追加
            </Link>
          </div>

          {/* 検索とフィルター */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">検索</label>
                <input
                  type="text"
                  id="search"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="宿泊者名または客室名で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
                <select
                  id="status"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">すべて</option>
                  <option value="confirmed">確定</option>
                  <option value="canceled">キャンセル</option>
                  <option value="completed">宿泊完了</option>
                </select>
              </div>
            </div>
          </div>

          {/* 予約一覧 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {isLoading ? (
              <div className="p-4 text-center">読み込み中...</div>
            ) : filteredReservations.length === 0 ? (
              <div className="p-4 text-center">予約が見つかりません</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left">ID</th>
                      <th className="p-3 text-left">宿泊者名</th>
                      <th className="p-3 text-left">チェックイン</th>
                      <th className="p-3 text-left">チェックアウト</th>
                      <th className="p-3 text-left">客室</th>
                      <th className="p-3 text-left">金額</th>
                      <th className="p-3 text-left">ステータス</th>
                      <th className="p-3 text-left">アクション</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReservations.map((reservation) => (
                      <tr key={reservation.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{reservation.id}</td>
                        <td className="p-3">{reservation.guestName}</td>
                        <td className="p-3">{reservation.checkIn}</td>
                        <td className="p-3">{reservation.checkOut}</td>
                        <td className="p-3">{reservation.roomName}</td>
                        <td className="p-3">¥{reservation.totalPrice.toLocaleString()}</td>
                        <td className="p-3">
                          <span className={`inline-block py-1 px-2 rounded-full text-sm ${getStatusBadgeStyle(reservation.status)}`}>
                            {translateStatus(reservation.status)}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <Link href={`/admin/reservations/${reservation.id}`} className="text-blue-600 hover:text-blue-800">
                              詳細
                            </Link>
                            <Link href={`/admin/reservations/${reservation.id}/edit`} className="text-green-600 hover:text-green-800">
                              編集
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReservations; 