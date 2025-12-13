import React from 'react';
import Head from 'next/head';
import { Layout } from '../components/layout';

interface ResourceLink {
  title: string;
  description: string;
  url: string;
  category: string;
}

const resources: ResourceLink[] = [
  {
    title: 'HL7 International',
    description: 'Official HL7 organization website with standards, news, and resources',
    url: 'https://www.hl7.org/',
    category: 'Official Organizations'
  },
  {
    title: 'FHIR Specification',
    description: 'Complete FHIR specification with implementation guides and examples',
    url: 'https://hl7.org/fhir/',
    category: 'Official Organizations'
  },
  {
    title: 'DICOM Standard',
    description: 'Official DICOM standard documentation and resources',
    url: 'https://www.dicomstandard.org/',
    category: 'Official Organizations'
  },
  {
    title: 'FHIR Registry',
    description: 'Registry of FHIR implementation guides and profiles',
    url: 'https://registry.fhir.org/',
    category: 'Implementation Resources'
  },
  {
    title: 'FHIR Chat',
    description: 'Community chat platform for FHIR discussions',
    url: 'https://chat.fhir.org/',
    category: 'Community'
  },
  {
    title: 'IHE International',
    description: 'Integrating the Healthcare Enterprise profiles and testing',
    url: 'https://www.ihe.net/',
    category: 'Implementation Resources'
  },
  {
    title: 'SMART on FHIR',
    description: 'Platform for healthcare apps using FHIR APIs',
    url: 'https://smarthealthit.org/',
    category: 'Implementation Resources'
  },
  {
    title: 'FHIR Connectathons',
    description: 'Testing events for FHIR implementations',
    url: 'https://www.hl7.org/events/fhir-connectathon/',
    category: 'Community'
  }
];

const groupedResources = resources.reduce((acc, resource) => {
  if (!acc[resource.category]) {
    acc[resource.category] = [];
  }
  acc[resource.category].push(resource);
  return acc;
}, {} as Record<string, ResourceLink[]>);

export default function Resources() {
  return (
    <>
      <Head>
        <title>Resources - Health Standards Educational Resource</title>
        <meta name="description" content="Comprehensive collection of official resources and documentation for healthcare interoperability standards." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Resources
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Official documentation, implementation guides, and community resources 
              for healthcare interoperability standards
            </p>
          </div>

          <div className="space-y-12">
            {Object.entries(groupedResources).map(([category, categoryResources]) => (
              <div key={category}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {category}
                </h2>
                
                <div className="grid gap-6 md:grid-cols-2">
                  {categoryResources.map((resource) => (
                    <div key={resource.url} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          <a 
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 transition-colors"
                          >
                            {resource.title}
                          </a>
                        </h3>
                        
                        <p className="text-gray-600 mb-4">
                          {resource.description}
                        </p>
                        
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          Visit Resource
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
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Important Notice
            </h3>
            <p className="text-blue-800">
              These external resources are provided for reference and educational purposes. 
              Always verify information with official sources and consult with certified 
              implementation specialists for production healthcare systems. We are not 
              responsible for the content or availability of external websites.
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
}