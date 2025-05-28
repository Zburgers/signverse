"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // This is a placeholder - no actual form submission happens
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitted(true);
    setIsSubmitting(false);
  };
  
  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8 lg:p-12 bg-slate-50">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-700 mb-4 block">← Back to Home</Link>
          <h1 className="text-3xl md:text-4xl font-bold">Contact Us</h1>
          <p className="text-gray-600 mt-2">Get in touch with the SignVerse team</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Contact information */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1">contact@signverse.org</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Social</h3>
                  <div className="mt-1 space-y-2">
                    <a href="#" className="block text-blue-600 hover:text-blue-800">Twitter</a>
                    <a href="#" className="block text-blue-600 hover:text-blue-800">LinkedIn</a>
                    <a href="#" className="block text-blue-600 hover:text-blue-800">GitHub</a>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  <p className="mt-1">
                    SignVerse Educational Technologies<br />
                    123 Innovation Lane<br />
                    Bangalore, Karnataka 560001<br />
                    India
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact form */}
          <div className="md:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4 text-green-500">✓</div>
                  <h2 className="text-2xl font-semibold mb-2">Thank You!</h2>
                  <p className="text-gray-600 mb-6">
                    Your message has been received. We'll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => {
                      setName('');
                      setEmail('');
                      setSubject('');
                      setMessage('');
                      setSubmitted(false);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-4">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="john@example.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input
                        id="subject"
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="How can we help you?"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={5}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your message here..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* FAQ section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">How can I integrate SignVerse in my school?</h3>
              <p className="text-gray-700">
                SignVerse offers educational institution packages with custom deployment options. 
                Contact us through the form above to discuss your specific needs and we'll provide 
                detailed information about implementation options.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Is SignVerse available for personal use?</h3>
              <p className="text-gray-700">
                Yes! SignVerse offers both personal and institutional licenses. Personal users can 
                access our core features through the web application for learning and practicing 
                Indian Sign Language.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Do you offer training for educators?</h3>
              <p className="text-gray-700">
                Yes, we provide training sessions for educators on how to effectively use SignVerse 
                in their classrooms. These sessions can be conducted virtually or in-person depending 
                on your location and requirements.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">How accurate are the sign language animations?</h3>
              <p className="text-gray-700">
                Our animations are developed in collaboration with native ISL signers and linguistic 
                experts to ensure accuracy. We continuously refine our animations based on feedback 
                from the deaf community to maintain high standards of quality and authenticity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
