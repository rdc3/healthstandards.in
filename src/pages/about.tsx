import React from 'react';
import Head from 'next/head';
import { Layout } from '../components/layout';

export default function About() {
  return (
    <>
      <Head>
        <title>About - Health Standards Educational Resource</title>
        <meta name="description" content="Learn about our educational resource for healthcare interoperability standards." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              About Health Standards
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Your educational resource for understanding healthcare interoperability standards
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2>Our Mission</h2>
            <p>
              Health Standards is an educational platform dedicated to providing comprehensive, 
              accessible information about healthcare interoperability standards. We aim to help 
              healthcare professionals, developers, and students understand the critical standards 
              that enable healthcare data exchange and medical imaging.
            </p>

            <h2>What We Cover</h2>
            <p>Our educational resources include detailed information about:</p>
            <ul>
              <li><strong>HL7 FHIR</strong> - Fast Healthcare Interoperability Resources</li>
              <li><strong>HL7 v2</strong> - Health Level Seven messaging standards</li>
              <li><strong>DICOM</strong> - Digital Imaging and Communications in Medicine</li>
              <li>Additional healthcare standards and protocols</li>
            </ul>

            <h2>Educational Purpose</h2>
            <p>
              All content on this website is provided strictly for educational and learning purposes. 
              This information should not be used as the sole basis for implementing healthcare systems 
              or making clinical decisions. For production healthcare applications, always:
            </p>
            <ul>
              <li>Consult official standard documentation</li>
              <li>Work with certified implementation specialists</li>
              <li>Ensure compliance with healthcare regulations</li>
              <li>Follow proper validation and testing procedures</li>
            </ul>

            <h2>Disclaimer</h2>
            <p>
              The information provided on this website is for educational purposes only and should 
              not be used for actual healthcare implementation without proper validation. We are not 
              responsible for any implementation decisions made based on this educational content. 
              Always refer to official standard documentation and work with qualified professionals 
              for production healthcare systems.
            </p>

            <h2>Official Resources</h2>
            <p>For authoritative information, please refer to the official organizations:</p>
            <ul>
              <li><a href="https://www.hl7.org/" target="_blank" rel="noopener noreferrer">HL7 International</a></li>
              <li><a href="https://hl7.org/fhir/" target="_blank" rel="noopener noreferrer">FHIR Specification</a></li>
              <li><a href="https://www.dicomstandard.org/" target="_blank" rel="noopener noreferrer">DICOM Standard</a></li>
            </ul>

            <h2>Contact</h2>
            <p>
              This is an educational resource. For questions about specific implementations, 
              please consult the official documentation and certified specialists in your area.
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
}