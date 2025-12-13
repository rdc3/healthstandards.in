import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Layout } from '../components/layout';

export default function Home() {
  return (
    <>
      <Head>
        <title>Health Standards - Educational Resource</title>
        <meta name="description" content="Educational resource for healthcare interoperability standards including HL7, FHIR, DICOM and more." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Layout showBreadcrumbs={false} autoHideHeader={false}>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Healthcare Standards
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Learn about healthcare interoperability standards including HL7, FHIR, DICOM, and more.
          </p>
          
          
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* HL7 FHIR Card */}
              <Link href="/standards/fhir" className="group">
                <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          HL7 FHIR
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                          Fast Healthcare Interoperability Resources
                        </p>
                        <div className="mt-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            messaging
                          </span>
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            intermediate
                          </span>
                        </div>
                      </div>
                      <svg 
                        className="ml-3 w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" 
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
                    </div>
                  </div>
                </div>
              </Link>
              
              {/* DICOM Card */}
              <Link href="/standards/dicom" className="group">
                <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          DICOM
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                          Digital Imaging and Communications in Medicine
                        </p>
                        <div className="mt-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            imaging
                          </span>
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            intermediate
                          </span>
                        </div>
                      </div>
                      <svg 
                        className="ml-3 w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" 
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
                    </div>
                  </div>
                </div>
              </Link>
              
              {/* HL7 v2 Card */}
              <Link href="/standards/hl7" className="group">
                <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          HL7 v2
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                          Health Level Seven Version 2
                        </p>
                        <div className="mt-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            messaging
                          </span>
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            beginner
                          </span>
                        </div>
                      </div>
                      <svg 
                        className="ml-3 w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" 
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
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            
            {/* Call to Action */}
            <div className="mt-12">
              <Link 
                href="/standards"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                View All Standards
                <svg 
                  className="ml-2 w-5 h-5" 
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
      </Layout>
    </>
  );
}