import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* ロゴ */}
          <Link href="/" className={`font-display font-bold text-2xl ${isScrolled ? 'text-secondary-900' : 'text-white'}`}>
            宿泊予約システム
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`${router.pathname === '/' ? 'font-semibold' : ''} ${isScrolled ? 'text-secondary-900 hover:text-primary-600' : 'text-white hover:text-accent-300'} transition-colors`}>
              ホーム
            </Link>
            <Link href="/rooms" className={`${router.pathname === '/rooms' ? 'font-semibold' : ''} ${isScrolled ? 'text-secondary-900 hover:text-primary-600' : 'text-white hover:text-accent-300'} transition-colors`}>
              お部屋
            </Link>
            <Link href="#" className={`${isScrolled ? 'text-secondary-900 hover:text-primary-600' : 'text-white hover:text-accent-300'} transition-colors`}>
              施設案内
            </Link>
            <Link href="#" className={`${isScrolled ? 'text-secondary-900 hover:text-primary-600' : 'text-white hover:text-accent-300'} transition-colors`}>
              アクセス
            </Link>
            <Link href="/admin" className={`${isScrolled ? 'text-secondary-900 hover:text-primary-600' : 'text-white hover:text-accent-300'} transition-colors flex items-center`}>
              <i className="ri-settings-line mr-1"></i> 管理
            </Link>
            <Link href="#" className={`${isScrolled ? 'bg-primary-600 hover:bg-primary-700' : 'bg-accent-500 hover:bg-accent-600'} text-white px-4 py-2 rounded-md transition-colors`}>
              問い合わせ
            </Link>
          </nav>

          {/* モバイルメニューボタン */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className={`${isMobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'} ${isScrolled ? 'text-secondary-900' : 'text-white'}`}></i>
          </button>
        </div>
      </div>

      {/* モバイルメニュー */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg animate-slide-down">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/" className={`${router.pathname === '/' ? 'text-primary-600 font-semibold' : 'text-secondary-900'} py-2 border-b border-secondary-100`} onClick={() => setIsMobileMenuOpen(false)}>
                ホーム
              </Link>
              <Link href="/rooms" className={`${router.pathname === '/rooms' ? 'text-primary-600 font-semibold' : 'text-secondary-900'} py-2 border-b border-secondary-100`} onClick={() => setIsMobileMenuOpen(false)}>
                お部屋
              </Link>
              <Link href="#" className="text-secondary-900 py-2 border-b border-secondary-100" onClick={() => setIsMobileMenuOpen(false)}>
                施設案内
              </Link>
              <Link href="#" className="text-secondary-900 py-2 border-b border-secondary-100" onClick={() => setIsMobileMenuOpen(false)}>
                アクセス
              </Link>
              <Link href="/admin" className="text-secondary-900 py-2 border-b border-secondary-100 flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                <i className="ri-settings-line mr-1"></i> 管理画面
              </Link>
              <Link href="#" className="bg-primary-600 text-white py-2 px-4 rounded-md text-center" onClick={() => setIsMobileMenuOpen(false)}>
                問い合わせ
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 