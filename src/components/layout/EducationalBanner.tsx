/**
 * Educational Banner Component
 * Displays a thin banner with scrolling text "For Educational Purposes Only"
 */

import React from 'react';

interface EducationalBannerProps {
  className?: string;
}

export const EducationalBanner: React.FC<EducationalBannerProps> = ({ 
  className = '' 
}) => {
  return (
    <div className={`bg-yellow-400 text-yellow-900 py-1 overflow-hidden relative ${className}`}>
      {/* Moving text container */}
      <div className="whitespace-nowrap animate-marquee">
        <span className="text-xs font-medium px-4">
          For Educational Purposes Only • Not for Production Healthcare Systems
        </span>
      </div>
    </div>
  );
};