import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Layout } from '../../components/layout';

interface StandardCard {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  href: string;
}

const standards: StandardCard[] = [
  {
    id: 'fhir',
    name: 'HL7 FHIR',
    description: 'Fast Healthcare Interoperability Resources - Modern healthcare interoperability standard using RESTful APIs and web technologies',
    category: 'messaging',
    difficulty: 'intermediate',
    href: '/standards/fhir'
  },
  {
    id: 'hl7',
    name: 'HL7 v2',
    description: 'Health Level Seven Version 2 - Comprehensive overview of HL7 healthcare messaging standards for interoperability',
    category: 'messaging',
    difficulty: 'beginner',
    href: '/standards/hl7'
  },
  {
    id: 'dicom',
    name: 'DICOM',
    description: 'Digital Imaging and Communications in Medicine - International standard for medical imaging and related information exchange',
    category: 'imaging',
    difficulty: 'intermediate',
    href: '/standards/dicom'
  }
];

const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'messaging':
      return 'bg-blue-100 text-blue-800';
    case 'imaging':
      return 'bg-purple-100 text-purple-800';
    case 'terminology':
      return 'bg-indigo-100 text-indigo-800';
    case 'security':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function StandardsIndex() {
  return (
    <>
      <Head>
        <title>Healthcare Standards - Educational Resource</title>
        <meta name="description" content="Comprehensive collection of healthcare interoperability standards including HL7, FHIR, DICOM and more." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Healthcare Standards
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Explore comprehensive educational resources about healthcare interoperability standards. 
              Learn about the protocols and formats that enable healthcare data exchange.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1">
            {standards.map((standard) => (
              <div key={standard.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h2 className="text-2xl font-semibold text-gray-900">
                          <Link 
                            href={standard.href}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {standard.name}
                          </Link>
                        </h2>
                        <div className="flex space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(standard.category)}`}>
                            {standard.category}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(standard.difficulty)}`}>
                            {standard.difficulty}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {standard.description}
                      </p>
                      
                      <Link
                        href={standard.href}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        Learn more about {standard.name}
                        <svg 
                          className="ml-2 w-4 h-4" 
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
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Educational Purpose Notice
            </h3>
            <p className="text-blue-800">
              All content on this site is provided for educational and learning purposes only. 
              For actual healthcare system implementation, always consult official standard documentation 
              and work with certified implementation specialists to ensure compliance with healthcare 
              regulations and standards.
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
}