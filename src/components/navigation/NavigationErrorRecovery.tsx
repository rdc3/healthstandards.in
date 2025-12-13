/**
 * Navigation error recovery component
 * Displays error messages and provides recovery options
 */

import React from 'react';
import { useNavigation } from '../../contexts/NavigationContext';

interface NavigationErrorRecoveryProps {
  className?: string;
  showRetry?: boolean;
  showGoBack?: boolean;
  showGoHome?: boolean;
  customActions?: React.ReactNode;
}

export const NavigationErrorRecovery: React.FC<NavigationErrorRecoveryProps> = ({
  className = '',
  showRetry = true,
  showGoBack = true,
  showGoHome = true,
  customActions,
}) => {
  const { navigationState, retryNavigation, clearNavigationError } = useNavigation();

  if (!navigationState.navigationError) {
    return null;
  }

  const handleRetry = async () => {
    const success = await retryNavigation();
    if (!success && navigationState.retryCount >= 3) {
      // If all retries failed, suggest going home
      console.warn('All navigation retries failed');
    }
  };

  const handleGoBack = () => {
    clearNavigationError();
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  const handleGoHome = () => {
    clearNavigationError();
    window.location.href = '/';
  };

  const handleDismiss = () => {
    clearNavigationError();
  };

  const canRetry = navigationState.retryCount < 3 && navigationState.lastFailedUrl;

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Navigation Error
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{navigationState.navigationError}</p>
            {navigationState.retryCount > 0 && (
              <p className="mt-1 text-xs text-red-600">
                Retry attempt {navigationState.retryCount} of 3
              </p>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {showRetry && canRetry && (
              <button
                onClick={handleRetry}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Try Again
              </button>
            )}
            {showGoBack && (
              <button
                onClick={handleGoBack}
                className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Go Back
              </button>
            )}
            {showGoHome && (
              <button
                onClick={handleGoHome}
                className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Go Home
              </button>
            )}
            <button
              onClick={handleDismiss}
              className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Dismiss
            </button>
            {customActions}
          </div>
        </div>
      </div>
    </div>
  );
};