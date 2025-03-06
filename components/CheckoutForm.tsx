import React, { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

interface CheckoutFormProps {
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // URLからPaymentIntentのクライアントシークレットを取得
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      return;
    }

    // 支払い状態を確認
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case 'succeeded':
          setMessage('お支払いが完了しました！');
          onSuccess && onSuccess();
          break;
        case 'processing':
          setMessage('お支払いを処理中です');
          break;
        case 'requires_payment_method':
          setMessage('お支払い方法を選択してください');
          break;
        default:
          setMessage('エラーが発生しました');
          onError && onError('決済ステータスが不明です');
          break;
      }
    });
  }, [stripe, onSuccess, onError]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js が読み込まれていない場合
      return;
    }

    setIsLoading(true);

    // フォームを送信して支払いを処理
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/reservation/complete`,
      },
    });

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message || 'エラーが発生しました');
      onError && onError(error.message || 'エラーが発生しました');
    } else {
      setMessage('予期せぬエラーが発生しました');
      onError && onError('予期せぬエラーが発生しました');
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: 'tabs' as const,
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">お支払い情報</h2>
          <p className="text-gray-600">金額: {amount.toLocaleString()}円（税込）</p>
        </div>

        <PaymentElement id="payment-element" options={paymentElementOptions} />
        
        <button
          disabled={isLoading || !stripe || !elements}
          id="submit"
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span id="button-text">
            {isLoading ? (
              <div className="spinner" id="spinner">
                処理中...
              </div>
            ) : (
              "今すぐ支払う"
            )}
          </span>
        </button>
        
        {/* エラーメッセージ表示 */}
        {message && (
          <div id="payment-message" className={`mt-4 text-center ${message.includes('エラー') ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm; 