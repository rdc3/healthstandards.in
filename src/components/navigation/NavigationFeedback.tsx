/**
 * Comprehensive navigation feedback component
 * Combines loading states, error recovery, and user feedback
 */

import React from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { NavigationLoadingIndicator } from './NavigationLoadingIndicator';
import { NavigationErrorRecovery } from './NavigationErrorRecovery';

interface NavigationFeedbackProps {
  className?: string;
  showLoadingIndicator?: boolean;
  showErrorRecovery?: boolean;
  loadingPosition?: 'top' | 'center' | 'inline';
  loadingSize?: 'small' | 'medium' | 'large';
  customLoadingText?: string;
}

export const NavigationFeedback: React.FC<NavigationFeedbackProps> = ({
  className = '',
  showLoadingIndicator = true,
  showErrorRecovery = true,
  loadingPosition = 'top',
  loadingSize = 'medium',
  customLoadingText,
}) => {
  const { navigationState } = useNavigation();

  // Don't render anything if there's no navigation activity or errors
  if (!navigationState.isNavigating && !navigationState.navigationError) {
    return null;
  }

  return (
    <div className={className}>
      {/* Loading indicator */}
      {showLoadingIndicator && navigationState.isNavigating && (
        <NavigationLoadingIndicator
          position={loadingPosition}
          size={loadingSize}
          showText={true}
        />
      )}

      {/* Error recovery */}
      {showErrorRecovery && navigationState.navigationError && (
        <NavigationErrorRecovery
          className="mt-4"
          showRetry={true}
          showGoBack={true}
          showGoHome={true}
        />
      )}

      {/* Navigation status for screen readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {navigationState.isNavigating && 'Page is loading'}
        {navigationState.navigationError && `Navigation error: ${navigationState.navigationError}`}
      </div>
    </div>
  );
};