import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { EducationalBanner } from './EducationalBanner';
import { Breadcrumbs } from '../navigation/Breadcrumbs';
import { LoadingBar } from '../navigation/LoadingBar';
import { useScrollShadow } from '../../hooks/useScrollShadow';
import { useScrollDirection } from '../../hooks/useScrollDirection';

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  customBreadcrumbs?: BreadcrumbItem[];
  showBreadcrumbs?: boolean;
  autoHideHeader?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className = '', 
  customBreadcrumbs,
  showBreadcrumbs = true,
  autoHideHeader = true
}) => {
  const hasScrolled = useScrollShadow(20);
  const { scrollDirection, isScrolled } = useScrollDirection({ threshold: 10 });
  
  // Determine if header should be hidden
  const shouldHideHeader = autoHideHeader && isScrolled && scrollDirection === 'down';
  
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {/* Loading Bar */}
      <LoadingBar />
      
      {/* Sticky Header Container */}
      <div className={`sticky top-0 z-40 bg-white transition-all duration-300 ease-in-out ${
        hasScrolled ? 'shadow-lg' : 'shadow-sm'
      } ${
        shouldHideHeader ? '-translate-y-full' : 'translate-y-0'
      }`}>
        {/* Educational Banner */}
        <EducationalBanner />
        
        {/* Header */}
        <Header />
      </div>
      
      {/* Sticky Breadcrumbs Bar - Always visible when enabled */}
      {showBreadcrumbs && (
        <div className="sticky top-0 z-30 border-t border-gray-200 bg-gray-50/80 backdrop-blur-sm shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Breadcrumbs 
              className="" 
              customBreadcrumbs={customBreadcrumbs}
            />
          </div>
        </div>
      )}
      
      {/* Main Content Area with Responsive Grid */}
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main content area - responsive grid with smooth transitions */}
            <div className="lg:col-span-12 transition-opacity duration-300 ease-in-out">
              {children}
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer with Educational Disclaimer - Always Visible and Non-dismissible */}
      <Footer />
    </div>
  );
};

export default Layout;