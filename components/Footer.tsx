import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-secondary-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">宿泊予約システム</h3>
            <p className="text-secondary-300 mb-6">
              最高の宿泊体験をご提供します。
              快適な客室と心のこもったサービスで、
              忘れられない思い出をお手伝いします。
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">お問い合わせ</h3>
            <div className="space-y-2 text-secondary-300">
              <p className="flex items-center">
                <i className="ri-map-pin-line mr-2"></i> 東京都港区虎ノ門1-1-1
              </p>
              <p className="flex items-center">
                <i className="ri-phone-line mr-2"></i> 03-1234-5678
              </p>
              <p className="flex items-center">
                <i className="ri-mail-line mr-2"></i> info@example.com
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">リンク</h3>
            <ul className="space-y-2 text-secondary-300">
              <li>
                <Link href="/" className="hover:text-primary-400 transition-colors">
                  <i className="ri-arrow-right-s-line mr-2"></i>ホーム
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="hover:text-primary-400 transition-colors">
                  <i className="ri-arrow-right-s-line mr-2"></i>お部屋
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-400 transition-colors">
                  <i className="ri-arrow-right-s-line mr-2"></i>宿泊プラン
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-400 transition-colors">
                  <i className="ri-arrow-right-s-line mr-2"></i>アクセス
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-secondary-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-400 mb-4 md:mb-0">© 2024 宿泊予約システム All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <i className="ri-twitter-fill text-xl"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <i className="ri-instagram-line text-xl"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 