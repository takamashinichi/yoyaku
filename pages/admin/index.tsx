import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalReservations: 0,
    totalRooms: 0,
    revenue: 0
  });

  useEffect(() => {
    // 実際のアプリケーションでは、APIからデータを取得します
    // この例では、ダミーデータを使用します
    setStats({
      totalReservations: 24,
      totalRooms: 8,
      revenue: 458000
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>宿泊予約システム - 管理画面</title>
        <meta name="description" content="宿泊予約システムの管理画面" />
      </Head>

      <div className="flex">
        {/* サイドバー */}
        <div className="w-64 h-screen bg-gray-800 text-white fixed">
          <div className="p-4">
            <h1 className="text-xl font-semibold mb-8">宿泊予約システム<br />管理パネル</h1>
            <nav className="space-y-2">
              <Link href="/admin" className="block p-3 rounded bg-blue-700 hover:bg-blue-600 transition-colors">
                ダッシュボード
              </Link>
              <Link href="/admin/reservations" className="block p-3 rounded hover:bg-gray-700 transition-colors">
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
          <h2 className="text-2xl font-bold mb-6">ダッシュボード</h2>

          {/* 統計情報 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">総予約数</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalReservations}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">客室数</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalRooms}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">総売上</h3>
              <p className="text-3xl font-bold text-blue-600">¥{stats.revenue.toLocaleString()}</p>
            </div>
          </div>

          {/* 最近の予約 */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold mb-4">最近の予約</h3>
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
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">1</td>
                    <td className="p-3">山田 太郎</td>
                    <td className="p-3">2023/04/01</td>
                    <td className="p-3">2023/04/03</td>
                    <td className="p-3">デラックスツイン</td>
                    <td className="p-3">¥42,000</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">2</td>
                    <td className="p-3">佐藤 花子</td>
                    <td className="p-3">2023/04/05</td>
                    <td className="p-3">2023/04/07</td>
                    <td className="p-3">プレミアムダブル</td>
                    <td className="p-3">¥56,000</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">3</td>
                    <td className="p-3">鈴木 一郎</td>
                    <td className="p-3">2023/04/10</td>
                    <td className="p-3">2023/04/12</td>
                    <td className="p-3">スタンダードシングル</td>
                    <td className="p-3">¥28,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <Link href="/admin/reservations" className="text-blue-600 hover:underline">
                すべての予約を表示 →
              </Link>
            </div>
          </div>

          {/* クイックアクション */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">クイックアクション</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/admin/reservations/new" className="p-4 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center">
                <i className="ri-add-circle-line text-xl mr-2"></i>
                新規予約を追加
              </Link>
              <Link href="/admin/rooms/new" className="p-4 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors flex items-center">
                <i className="ri-hotel-bed-line text-xl mr-2"></i>
                新規客室を追加
              </Link>
              <Link href="/admin/reports" className="p-4 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors flex items-center">
                <i className="ri-file-chart-line text-xl mr-2"></i>
                レポートを生成
              </Link>
              <Link href="/admin/settings" className="p-4 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center">
                <i className="ri-settings-3-line text-xl mr-2"></i>
                システム設定
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome; 