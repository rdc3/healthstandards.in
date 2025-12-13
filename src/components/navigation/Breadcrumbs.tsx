import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  className?: string;
  customBreadcrumbs?: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ 
  className = '', 
  customBreadcrumbs 
}) => {
  const router = useRouter();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = router.asPath.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Home', href: '/' }
    ];

    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Convert URL segments to readable names
      let name = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Handle specific healthcare standards
      switch (segment.toLowerCase()) {
        case 'fhir':
          name = 'HL7 FHIR';
          break;
        case 'hl7':
          name = 'HL7 v2';
          break;
        case 'dicom':
          name = 'DICOM';
          break;
        case 'standards':
          name = 'Standards';
          break;
        case 'resources':
          name = 'Resources';
          break;
        case 'about':
          name = 'About';
          break;
        default:
          // Replace hyphens and underscores with spaces and capitalize
          name = segment
            .replace(/[-_]/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
      }

      breadcrumbs.push({
        name,
        href: currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on homepage
  if (router.pathname === '/' && !customBreadcrumbs) {
    return null;
  }

  return (
    <nav 
      className={`flex ${className}`} 
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={breadcrumb.href} className="flex items-center">
              {index > 0 && (
                <svg
                  className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              
              {isLast ? (
                <span 
                  className="text-gray-900 font-medium"
                  aria-current="page"
                >
                  {breadcrumb.name}
                </span>
              ) : (
                <Link
                  href={breadcrumb.href}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {breadcrumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;