import React from 'react';
import Link from 'next/link';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`bg-gray-900 text-white ${className}`}>
      {/* Educational Disclaimer Banner */}
      <div className="bg-yellow-50 border-t-4 border-yellow-400 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg 
                className="h-6 w-6 text-yellow-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Educational Purpose Only
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p className="mb-2">
                  <strong>Important Disclaimer:</strong> This website is designed for educational purposes only. 
                  The information provided about healthcare standards should not be used for actual healthcare 
                  implementation without proper validation and consultation with official documentation.
                </p>
                <p className="mb-2">
                  Healthcare interoperability implementations require careful consideration of regulatory 
                  requirements, security protocols, and compliance standards. Always consult the official 
                  standard documentation and qualified healthcare IT professionals before implementing 
                  any healthcare data exchange solutions.
                </p>
                <p>
                  The authors and maintainers of this website disclaim any responsibility for implementation 
                  decisions made based on the educational content provided here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Health Standards Educational Resource</h3>
            <p className="text-gray-300 mb-4">
              A comprehensive educational platform for learning about healthcare interoperability 
              standards including HL7, FHIR, DICOM, and related protocols. This resource is 
              designed to help healthcare professionals, developers, and students understand 
              these critical standards.
            </p>
            <p className="text-sm text-gray-400">
              Remember: This content is for educational purposes only and should not replace 
              official documentation or professional consultation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-md font-semibold mb-4">Standards</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/standards/hl7-fhir" className="hover:text-white transition-colors">
                  HL7 FHIR
                </Link>
              </li>
              <li>
                <Link href="/standards/dicom" className="hover:text-white transition-colors">
                  DICOM
                </Link>
              </li>
              <li>
                <Link href="/standards/hl7-v2" className="hover:text-white transition-colors">
                  HL7 v2
                </Link>
              </li>
              <li>
                <Link href="/standards/hl7-v3" className="hover:text-white transition-colors">
                  HL7 v3
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Resources */}
          <div>
            <h4 className="text-md font-semibold mb-4">Official Documentation</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a 
                  href="https://hl7.org/fhir/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center"
                >
                  HL7 FHIR Official
                  <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                  </svg>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.dicomstandard.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center"
                >
                  DICOM Standard
                  <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                  </svg>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.hl7.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center"
                >
                  HL7 International
                  <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                  </svg>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.ihe.net/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center"
                >
                  IHE International
                  <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              <p>© 2024 Health Standards Educational Resource. Educational content only.</p>
              <p className="mt-1">
                Not for production use. Consult official documentation for implementation.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-xs text-gray-500">
                Last updated: December 2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;