import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

interface Room {
  id: number;
  name: string;
  capacity: number;
  price: number;
  imageUrl: string;
  status: 'available' | 'maintenance' | 'booked';
  description: string;
}

const AdminRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // 実際のアプリケーションでは、APIからデータを取得します
    // この例では、ダミーデータを使用します
    const dummyRooms: Room[] = [
      {
        id: 1,
        name: 'スタンダードシングル',
        capacity: 1,
        price: 12000,
        imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        status: 'available',
        description: '一人旅に最適なコンパクトな客室です。必要な設備が揃った機能的な空間。'
      },
      {
        id: 2,
        name: 'デラックスツイン',
        capacity: 2,
        price: 18000,
        imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        status: 'available',
        description: 'ゆったりとしたスペースで快適なツインルーム。ビジネスや観光に最適。'
      },
      {
        id: 3,
        name: 'プレミアムダブル',
        capacity: 2,
        price: 22000,
        imageUrl: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        status: 'booked',
        description: 'カップルや夫婦に人気のダブルベッドルーム。上質なインテリアと設備。'
      },
      {
        id: 4,
        name: 'ファミリースイート',
        capacity: 4,
        price: 35000,
        imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        status: 'maintenance',
        description: '家族連れに最適な広々としたスイートルーム。キッチンとリビングスペース付き。'
      },
    ];

    setRooms(dummyRooms);
    setIsLoading(false);
  }, []);

  // 客室をフィルタリングする関数
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          room.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // 客室ステータスに応じたバッジスタイルを返す関数
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'booked':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // ステータスを日本語に変換する関数
  const translateStatus = (status: string) => {
    switch (status) {
      case 'available':
        return '利用可能';
      case 'maintenance':
        return 'メンテナンス中';
      case 'booked':
        return '予約済み';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>客室管理 - 宿泊予約システム管理画面</title>
        <meta name="description" content="宿泊施設の客室管理" />
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
              <Link href="/admin/reservations" className="block p-3 rounded hover:bg-gray-700 transition-colors">
                予約管理
              </Link>
              <Link href="/admin/rooms" className="block p-3 rounded bg-blue-700 hover:bg-blue-600 transition-colors">
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
            <h2 className="text-2xl font-bold">客室管理</h2>
            <Link href="/admin/rooms/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              新規客室を追加
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
                  placeholder="客室名または説明で検索..."
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
                  <option value="available">利用可能</option>
                  <option value="maintenance">メンテナンス中</option>
                  <option value="booked">予約済み</option>
                </select>
              </div>
            </div>
          </div>

          {/* 客室一覧 */}
          {isLoading ? (
            <div className="p-4 text-center bg-white rounded-lg shadow-md">読み込み中...</div>
          ) : filteredRooms.length === 0 ? (
            <div className="p-4 text-center bg-white rounded-lg shadow-md">客室が見つかりません</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={room.imageUrl}
                      alt={room.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`inline-block py-1 px-2 rounded-full text-sm ${getStatusBadgeStyle(room.status)}`}>
                        {translateStatus(room.status)}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">定員: {room.capacity}名</span>
                      <span className="text-lg font-bold text-blue-600">¥{room.price.toLocaleString()}/泊</span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{room.description}</p>
                    <div className="flex justify-between">
                      <Link href={`/admin/rooms/${room.id}`} className="text-blue-600 hover:text-blue-800">
                        詳細
                      </Link>
                      <Link href={`/admin/rooms/${room.id}/edit`} className="text-green-600 hover:text-green-800">
                        編集
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRooms; 