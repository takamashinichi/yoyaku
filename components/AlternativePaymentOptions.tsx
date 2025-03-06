import React from 'react';
import { useRouter } from 'next/router';

interface AlternativePaymentOptionsProps {
  reservationId: string;
  onBack: () => void;
}

const AlternativePaymentOptions: React.FC<AlternativePaymentOptionsProps> = ({
  reservationId,
  onBack
}) => {
  const router = useRouter();

  const handleOfflineReservation = () => {
    // 仮の予約完了処理
    router.push({
      pathname: '/reservation/complete',
      query: { 
        offline_payment: 'true',
        reservation_id: reservationId || 'unknown'
      }
    });
  };

  return (
    <div className="mt-6 bg-white p-5 rounded-lg border border-gray-200">
      <h3 className="font-bold text-gray-800 mb-3">他のお支払い方法</h3>
      <p className="text-gray-600 mb-4">
        オンライン決済に問題が発生しました。以下のいずれかの方法でお支払いいただけます：
      </p>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <svg className="h-5 w-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="font-medium text-gray-800">チェックイン時のお支払い</p>
            <p className="text-sm text-gray-600">ご到着時にフロントでクレジットカード、現金、またはQRコード決済でお支払いいただけます。</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <svg className="h-5 w-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="font-medium text-gray-800">銀行振込</p>
            <p className="text-sm text-gray-600">予約IDを記載の上、指定の銀行口座にお振込みください。詳細はメールでお送りします。</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
        >
          戻る
        </button>
        
        <button
          onClick={handleOfflineReservation}
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition"
        >
          他の支払方法で予約する
        </button>
      </div>
    </div>
  );
};

export default AlternativePaymentOptions; 