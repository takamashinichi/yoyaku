import React from 'react';
import { useRouter } from 'next/router';

interface ErrorMessageProps {
  title?: string;
  message: string;
  code?: string;
  showRetry?: boolean;
  showBack?: boolean;
  onRetry?: () => void;
  severity?: 'error' | 'warning' | 'info';
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'エラーが発生しました',
  message,
  code,
  showRetry = true,
  showBack = true,
  onRetry,
  severity = 'error'
}) => {
  const router = useRouter();

  // 重要度に基づいた色の設定
  const colorMap = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: 'text-red-500',
      button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: 'text-yellow-500',
      button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: 'text-blue-500',
      button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
    }
  };

  const colors = colorMap[severity];

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-lg p-4 my-4`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {severity === 'error' ? (
            <svg className={`h-5 w-5 ${colors.icon}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          ) : severity === 'warning' ? (
            <svg className={`h-5 w-5 ${colors.icon}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className={`h-5 w-5 ${colors.icon}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${colors.text}`}>{title}</h3>
          <div className={`mt-2 text-sm ${colors.text}`}>
            <p>{message}</p>
            {code && (
              <p className="mt-1 font-mono text-xs opacity-70">
                エラーコード: {code}
              </p>
            )}
          </div>
          <div className="mt-4 flex gap-3">
            {showRetry && (
              <button
                type="button"
                onClick={onRetry || (() => window.location.reload())}
                className={`inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm ${colors.button} focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                再試行
              </button>
            )}
            {showBack && (
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                戻る
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage; 