import React from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import { Layout } from '../../components/layout';
import { getContentByPath } from '../../utils/contentParser';

interface DicomPageProps {
  content: string;
  frontmatter: {
    title: string;
    description: string;
    standard: string;
    version: string;
    category: string;
    difficulty: string;
    lastUpdated: string;
    tags: string[];
    officialSpec: string;
  };
}

export default function DicomPage({ content, frontmatter }: DicomPageProps) {
  return (
    <>
      <Head>
        <title>{frontmatter.title} - Health Standards</title>
        <meta name="description" content={frontmatter.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <Layout>
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                {frontmatter.category}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                {frontmatter.difficulty}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                Version {frontmatter.version}
              </span>
            </div>
            
            <p className="text-lg text-gray-600 mb-4">
              {frontmatter.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span>Last updated: {new Date(frontmatter.lastUpdated).toLocaleDateString()}</span>
              <a 
                href={frontmatter.officialSpec}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Official Specification →
              </a>
            </div>
          </div>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none prose-blue prose-headings:text-gray-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-50 prose-pre:border"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Tags */}
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {frontmatter.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Official Resources Reminder */}
          <div className="mt-12 bg-amber-50 border border-amber-200 rounded-lg p-6">
            <div className="flex items-start">
              <svg 
                className="flex-shrink-0 w-6 h-6 text-amber-600 mt-0.5" 
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
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-amber-900">
                  Implementation Reminder
                </h3>
                <p className="mt-2 text-amber-800">
                  This content is for educational purposes only. For production medical imaging systems, 
                  always refer to the official DICOM standard at{' '}
                  <a 
                    href={frontmatter.officialSpec}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline hover:no-underline"
                  >
                    {frontmatter.officialSpec}
                  </a>
                  {' '}and work with certified DICOM specialists to ensure compliance 
                  with medical device regulations and healthcare standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const { content, metadata } = await getContentByPath('content/standards/dicom/index.md');
    
    return {
      props: {
        content,
        frontmatter: metadata,
      },
    };
  } catch (error) {
    console.error('Error loading DICOM content:', error);
    return {
      notFound: true,
    };
  }
};