import React, { useState, useEffect } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';

interface LoadingBarProps {
  className?: string;
  showProgress?: boolean;
  duration?: number;
}

export const LoadingBar: React.FC<LoadingBarProps> = ({ 
  className = '',
  showProgress = true,
  duration = 2000
}) => {
  const { navigationState } = useNavigation();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (navigationState.isNavigating) {
      setProgress(0);
      
      if (showProgress) {
        // Simulate progress animation
        const interval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) {
              return prev; // Stop at 90% until navigation completes
            }
            return prev + Math.random() * 15;
          });
        }, 100);

        return () => clearInterval(interval);
      }
    } else {
      // Complete the progress bar when navigation finishes
      setProgress(100);
      
      // Hide after a short delay
      const timeout = setTimeout(() => {
        setProgress(0);
      }, 300);
      
      return () => clearTimeout(timeout);
    }
  }, [navigationState.isNavigating, showProgress]);

  if (!navigationState.isNavigating && progress === 0) {
    return null;
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      <div className="h-1 bg-blue-100">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-200 ease-out"
          style={{ 
            width: showProgress ? `${Math.min(progress, 100)}%` : '100%',
            opacity: navigationState.isNavigating || progress > 0 ? 1 : 0
          }}
        >
          {navigationState.isNavigating && (
            <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
          )}
        </div>
      </div>
      
      {/* Optional text indicator */}
      {navigationState.isNavigating && (
        <div className="absolute top-1 right-4 text-xs text-blue-600 font-medium">
          Loading...
        </div>
      )}
    </div>
  );
};

export default LoadingBar;