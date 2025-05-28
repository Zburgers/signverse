"use client";

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8 lg:p-12 bg-slate-50">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-700 mb-4 block">← Back to Home</Link>
          <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
          <p className="text-gray-600 mt-2">Last updated: May 28, 2025</p>
        </div>
        
        {/* Main content */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="text-gray-700 mb-4">
              SignVerse ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our 
              sign language translation and learning application ("Application").
            </p>
            <p className="text-gray-700">
              Please read this Privacy Policy carefully. If you disagree with the terms of this Privacy Policy, 
              please do not access the Application.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              We collect several types of information from and about users of our Application:
            </p>
            
            <h3 className="text-lg font-medium mb-2">Personal Information</h3>
            <p className="text-gray-700 mb-4">
              When you register for an account, we may collect:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
              <li>Name</li>
              <li>Email address</li>
              <li>Password (stored in encrypted form)</li>
              <li>Profile information (optional)</li>
            </ul>
            
            <h3 className="text-lg font-medium mb-2">Usage Information</h3>
            <p className="text-gray-700 mb-4">
              We collect information about your interactions with the Application:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
              <li>Texts submitted for translation</li>
              <li>Learning materials accessed</li>
              <li>Features and tools used</li>
              <li>Time spent on various sections</li>
            </ul>
            
            <h3 className="text-lg font-medium mb-2">Device Information</h3>
            <p className="text-gray-700 mb-4">
              We collect information about the device you use to access the Application:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Device type and model</li>
              <li>Operating system</li>
              <li>Browser type</li>
              <li>IP address</li>
              <li>Mobile device identifiers</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use the information we collect for various purposes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>To provide and maintain our Application</li>
              <li>To personalize your experience</li>
              <li>To improve our Application and develop new features</li>
              <li>To communicate with you about updates or changes</li>
              <li>To provide customer support</li>
              <li>To monitor and analyze usage patterns</li>
              <li>To detect, prevent, and address technical issues</li>
              <li>To fulfill any other purpose for which you provide it</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="text-gray-700 mb-4">
              We have implemented appropriate technical and organizational security measures designed to 
              protect the security of any personal information we process. However, please note that no 
              electronic transmission over the internet or information storage technology can be guaranteed 
              to be 100% secure.
            </p>
            <p className="text-gray-700">
              While we strive to use commercially acceptable means to protect your personal information, 
              we cannot guarantee its absolute security. We regularly review and update our security 
              measures in light of current technologies.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Your Data Rights</h2>
            <p className="text-gray-700 mb-4">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Right to access your personal information</li>
              <li>Right to rectify inaccurate information</li>
              <li>Right to erasure of your information</li>
              <li>Right to restrict processing of your information</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
            </ul>
            <p className="text-gray-700 mt-4">
              To exercise any of these rights, please contact us using the information provided at the 
              end of this Policy.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
            <p className="text-gray-700">
              Our Application is not intended for children under 13 years of age. We do not knowingly 
              collect personal information from children under 13. If you are a parent or guardian and 
              believe that your child has provided us with personal information, please contact us so 
              that we can take necessary actions.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-700">
              We may update our Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page and updating the "Last Updated" date. You are 
              advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="mb-2"><strong>Email:</strong> privacy@signverse.org</p>
              <p><strong>Address:</strong> SignVerse Educational Technologies, 123 Innovation Lane, Bangalore, Karnataka 560001, India</p>
              <div className="mt-4">
                <Link 
                  href="/contact" 
                  className="inline-block px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
