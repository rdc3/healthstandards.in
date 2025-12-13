import React from 'react';
import Link from 'next/link';
import { MainNavigation } from '../navigation/MainNavigation';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return (
    <header className={`bg-white shadow-sm border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title Area */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HS</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Health Standards
              </h1>
            </Link>
          </div>

          {/* Main Navigation */}
          <MainNavigation />

          {/* Search Bar Placeholder */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden lg:block">
              <input
                type="text"
                placeholder="Search standards..."
                className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                aria-label="Search healthcare standards"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg 
                  className="h-4 w-4 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;