"use client";

import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8 lg:p-12 bg-slate-50">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-700 mb-4 block">← Back to Home</Link>
          <h1 className="text-3xl md:text-4xl font-bold">About SignVerse</h1>
          <p className="text-gray-600 mt-2">Making education accessible through Indian Sign Language</p>
        </div>
        
        {/* Main content */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              SignVerse aims to break down communication barriers by making Indian Sign Language (ISL) 
              accessible to all. We believe that education should be inclusive and available to every 
              individual regardless of hearing ability.
            </p>
            <p className="text-gray-700">
              Through innovative technology and 3D animation, we're creating tools that help educators, 
              students, and families communicate effectively using sign language in educational environments.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Our Technology</h2>
            <p className="text-gray-700 mb-4">
              SignVerse uses cutting-edge animation technology to create realistic and accurate sign language 
              representations. Our platform integrates the Sign-Kit toolkit, which allows for:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>High-quality 3D avatars with realistic movements</li>
              <li>Accurate bone-based animations for precise sign language expression</li>
              <li>Real-time translation of text to Indian Sign Language</li>
              <li>Interactive learning tools for sign language education</li>
              <li>Customizable avatar appearance and animation speed</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Why Indian Sign Language?</h2>
            <p className="text-gray-700 mb-4">
              India has one of the largest deaf populations in the world, with approximately 18 million people 
              who are deaf or hard of hearing. Despite this, awareness and accessibility of Indian Sign Language 
              remains limited, especially in educational settings.
            </p>
            <p className="text-gray-700">
              By focusing on Indian Sign Language, we're addressing a significant need for accessible 
              communication tools specifically designed for the Indian context, supporting both educators 
              and learners in creating more inclusive educational environments.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <p className="text-gray-700 mb-4">
              SignVerse was created by a passionate team of developers, educators, and accessibility advocates 
              who believe in the power of technology to create positive social impact.
            </p>
            <p className="text-gray-700">
              We work closely with the deaf community and sign language experts to ensure our animations 
              are accurate, culturally appropriate, and effectively communicate the intended meaning.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Get Involved</h2>
            <p className="text-gray-700 mb-4">
              We welcome collaboration with educators, sign language experts, and technology enthusiasts who 
              share our vision for accessible education.
            </p>
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-blue-800 mb-4">
                Interested in contributing to SignVerse or implementing it in your educational institution?
              </p>
              <Link 
                href="/contact" 
                className="inline-block px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
