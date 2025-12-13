import React from 'react';
import { useNavigation } from '../../contexts/NavigationContext';

interface LoadingBarProps {
  className?: string;
}

export const LoadingBar: React.FC<LoadingBarProps> = ({ className = '' }) => {
  const { navigationState } = useNavigation();

  if (!navigationState.isNavigating) {
    return null;
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      <div className="h-1 bg-blue-200">
        <div className="h-full bg-blue-600 animate-pulse transition-all duration-300 ease-in-out w-full">
          <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingBar;