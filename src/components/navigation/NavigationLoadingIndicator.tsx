/**
 * Navigation loading indicator component
 * Shows loading states during navigation transitions
 */

import React from 'react';
import { useNavigation } from '../../contexts/NavigationContext';

interface NavigationLoadingIndicatorProps {
  className?: string;
  showText?: boolean;
  position?: 'top' | 'center' | 'inline';
  size?: 'small' | 'medium' | 'large';
}

export const NavigationLoadingIndicator: React.FC<NavigationLoadingIndicatorProps> = ({
  className = '',
  showText = true,
  position = 'top',
  size = 'medium',
}) => {
  const { navigationState } = useNavigation();

  if (!navigationState.isNavigating) {
    return null;
  }

  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8',
  };

  const positionClasses = {
    top: 'fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white',
    center: 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-25',
    inline: 'inline-flex items-center',
  };

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  };

  if (position === 'top') {
    return (
      <div className={`${positionClasses[position]} ${className}`}>
        <div className="flex items-center justify-center py-2 px-4">
          <svg
            className={`animate-spin ${sizeClasses[size]} mr-2`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {showText && (
            <span className={textSizeClasses[size]}>
              Loading page...
            </span>
          )}
        </div>
        {/* Progress bar animation */}
        <div className="h-1 bg-blue-700">
          <div className="h-full bg-blue-300 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (position === 'center') {
    return (
      <div className={`${positionClasses[position]} ${className}`}>
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-center">
            <svg
              className={`animate-spin ${sizeClasses[size]} text-blue-600 mr-3`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {showText && (
              <span className={`text-gray-700 ${textSizeClasses[size]}`}>
                Loading page...
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Inline position
  return (
    <div className={`${positionClasses[position]} ${className}`}>
      <svg
        className={`animate-spin ${sizeClasses[size]} text-blue-600 mr-2`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      {showText && (
        <span className={`text-gray-600 ${textSizeClasses[size]}`}>
          Loading...
        </span>
      )}
    </div>
  );
};