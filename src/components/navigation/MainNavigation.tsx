import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useNavigation } from '../../contexts/NavigationContext';

interface NavigationItem {
  name: string;
  href: string;
  children?: NavigationItem[];
}

interface MainNavigationProps {
  className?: string;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'Standards',
    href: '/standards',
    children: [
      {
        name: 'HL7 FHIR',
        href: '/standards/fhir',
      },
      {
        name: 'HL7 v2',
        href: '/standards/hl7',
      },
      {
        name: 'DICOM',
        href: '/standards/dicom',
      },
    ],
  },
  {
    name: 'Search',
    href: '/search',
  },
  {
    name: 'Resources',
    href: '/resources',
  },
  {
    name: 'About',
    href: '/about',
  },
];

export const MainNavigation: React.FC<MainNavigationProps> = ({ className = '' }) => {
  const router = useRouter();
  const { navigationState } = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const isActiveLink = (href: string): boolean => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(href);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleDropdown = (itemName: string) => {
    setOpenDropdown(openDropdown === itemName ? null : itemName);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setOpenDropdown(null);
      setMobileMenuOpen(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  return (
    <nav ref={navRef} className={`relative ${className}`}>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        {navigationItems.map((item) => (
          <div key={item.name} className="relative">
            {item.children ? (
              <div className="relative">
                <button
                  onClick={() => toggleDropdown(item.name)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActiveLink(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  aria-expanded={openDropdown === item.name}
                  aria-haspopup="true"
                >
                  <span>{item.name}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      openDropdown === item.name ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {openDropdown === item.name && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={`block px-4 py-2 text-sm transition-colors ${
                            isActiveLink(child.href)
                              ? 'text-blue-600 bg-blue-50'
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                          onClick={() => setOpenDropdown(null)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActiveLink(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={toggleMobileMenu}
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle main menu"
        >
          <svg
            className={`h-6 w-6 ${mobileMenuOpen ? 'hidden' : 'block'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            className={`h-6 w-6 ${mobileMenuOpen ? 'block' : 'hidden'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 md:hidden">
          <div className="py-2">
            {navigationItems.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium transition-colors ${
                        isActiveLink(item.href)
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                      aria-expanded={openDropdown === item.name}
                    >
                      <span>{item.name}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          openDropdown === item.name ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {openDropdown === item.name && (
                      <div className="bg-gray-50">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={`block pl-8 pr-4 py-2 text-sm transition-colors ${
                              isActiveLink(child.href)
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                            onClick={closeMobileMenu}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`block px-4 py-2 text-sm font-medium transition-colors ${
                      isActiveLink(item.href)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default MainNavigation;