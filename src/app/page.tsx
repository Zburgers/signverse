"use client";

import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12 bg-slate-50">
      <div className="w-full max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between py-12 gap-8">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-700">
              SignVerse
            </h1>
            <p className="text-xl text-gray-700 mb-6">
              Breaking communication barriers with Indian Sign Language technology
            </p>
            <p className="text-gray-600 mb-8">
              SignVerse translates text, speech, and video content into Indian Sign Language, 
              making digital content accessible to the deaf community.
            </p>
            
            <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-block transition-colors">
              Go to Dashboard
            </Link>
          </div>
          
          <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
            <div className="aspect-video bg-slate-100 rounded flex items-center justify-center mb-4">
              <span className="text-6xl">🧏</span>
            </div>
            <p className="text-center text-gray-500">
              Avatar-based Indian Sign Language interpretation
            </p>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="py-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              title="Text to ISL" 
              description="Convert written text to Indian Sign Language animations" 
              icon="📝" 
              link="/translate" 
            />
            
            <FeatureCard 
              title="YouTube to ISL" 
              description="Translate YouTube video transcripts into sign language" 
              icon="📺" 
              link="/translate?source=youtube" 
            />
            
            <FeatureCard 
              title="ISL Learning" 
              description="Learn Indian Sign Language interactively" 
              icon="🎓" 
              link="/learn" 
            />
            
            <FeatureCard 
              title="ISL Chat" 
              description="Chat with an AI assistant using sign language" 
              icon="💬" 
              link="/dashboard?tab=chat" 
            />
            
            <FeatureCard 
              title="Video Translation" 
              description="Create sign language videos for your content" 
              icon="🎥" 
              link="/translate?source=video" 
            />
            
            <FeatureCard 
              title="Profile" 
              description="View your translation history and saved content" 
              icon="👤" 
              link="/profile" 
            />
          </div>
        </div>
        
        {/* Auth Section (Placeholder) */}
        <div className="py-12 bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Sign In Options</h2>
          <p className="text-center text-gray-600 mb-8">
            Access your personal dashboard and saved translations
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/auth/signin" className="bg-gray-800 hover:bg-black text-white px-6 py-3 rounded-lg font-medium inline-block transition-colors text-center min-w-[180px]">
              Sign In
            </Link>
            
            <Link href="/auth/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-block transition-colors text-center min-w-[180px]">
              Sign Up
            </Link>
            
            <Link href="/auth/web3" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium inline-block transition-colors text-center min-w-[180px]">
              Connect Web3 Wallet
            </Link>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="py-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">&copy; 2025 SignVerse | A humanitarian project</p>
            </div>
            
            <div className="flex gap-4">
              <Link href="/about" className="text-blue-600 hover:text-blue-800">
                About
              </Link>
              <Link href="/contact" className="text-blue-600 hover:text-blue-800">
                Contact
              </Link>
              <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                Privacy Policy
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

// Feature Card Component
function FeatureCard({ title, description, icon, link }: { title: string; description: string; icon: string; link: string }) {
  return (
    <Link href={link} className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
}
