"use client";

import { useState } from 'react';
import Link from 'next/link';
// Import animations using require since they're CommonJS modules
const alphabets = require('@/animations/alphabets');
const words = require('@/animations/words');

// Create alphabet mapping
const ALPHABET_ANIMATIONS: Record<string, any> = {
  'A': alphabets.A, 'B': alphabets.B, 'C': alphabets.C, 'D': alphabets.D, 
  'E': alphabets.E, 'F': alphabets.F, 'G': alphabets.G, 'H': alphabets.H, 
  'I': alphabets.I, 'J': alphabets.J, 'K': alphabets.K, 'L': alphabets.L, 
  'M': alphabets.M, 'N': alphabets.N, 'O': alphabets.O, 'P': alphabets.P, 
  'Q': alphabets.Q, 'R': alphabets.R, 'S': alphabets.S, 'T': alphabets.T, 
  'U': alphabets.U, 'V': alphabets.V, 'W': alphabets.W, 'X': alphabets.X, 
  'Y': alphabets.Y, 'Z': alphabets.Z
};

// Create word mapping
const WORD_ANIMATIONS: Record<string, any> = {
  'TIME': words.TIME,
  'HOME': words.HOME,
  'PERSON': words.PERSON,
  'YOU': words.YOU
};

// Available alphabets and words
const AVAILABLE_ALPHABETS = Object.keys(ALPHABET_ANIMATIONS);
const AVAILABLE_WORDS = Object.keys(WORD_ANIMATIONS);
import EnhancedSignKitPlayer from '@/components/EnhancedSignKitPlayer';

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState<'alphabets' | 'words' | 'phrases'>('alphabets');
  const [selectedAnimation, setSelectedAnimation] = useState<string | null>(null);
  const [animationOptions, setAnimationOptions] = useState<any[]>([]);
  const [speed, setSpeed] = useState(0.1);
  const [avatarModel, setAvatarModel] = useState('/models/ybot.glb');

  // Handle animation selection
  const handleSelectAnimation = (type: 'alphabet' | 'word', key: string) => {
    setSelectedAnimation(key);

    if (type === 'alphabet' && ALPHABET_ANIMATIONS[key as keyof typeof ALPHABET_ANIMATIONS]) {
      setAnimationOptions([{
        type: 'bone',
        content: ALPHABET_ANIMATIONS[key as keyof typeof ALPHABET_ANIMATIONS],
        speed
      } as const]);
    } else if (type === 'word' && WORD_ANIMATIONS[key as keyof typeof WORD_ANIMATIONS]) {
      setAnimationOptions([{
        type: 'bone',
        content: WORD_ANIMATIONS[key as keyof typeof WORD_ANIMATIONS],
        speed
      } as const]);
    }
  };

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8 lg:p-12 bg-slate-50">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/" className="text-blue-700 mb-4 block">← Back to Home</Link>
            <h1 className="text-3xl md:text-4xl font-bold">Learn Indian Sign Language</h1>
            <p className="text-gray-600 mt-2">Interactive tools to learn and practice ISL signs</p>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/3 lg:w-1/4">
            {/* Tab navigation */}
            <div className="flex border-b mb-6">
              <button
                className={`px-4 py-2 ${
                  activeTab === 'alphabets' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('alphabets')}
              >
                Alphabets
              </button>
              
              <button
                className={`px-4 py-2 ${
                  activeTab === 'words' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('words')}
              >
                Words
              </button>
              
              <button
                className={`px-4 py-2 ${
                  activeTab === 'phrases' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('phrases')}
              >
                Phrases
              </button>
            </div>

            {/* Content based on active tab */}
            <div className="mb-8">
              {activeTab === 'alphabets' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Alphabet Signs</h2>
                  <div className="grid grid-cols-4 gap-2">
                    {AVAILABLE_ALPHABETS.map((letter: string) => (
                      <button
                        key={letter}
                        className={`h-12 w-12 flex items-center justify-center rounded-lg border ${
                          selectedAnimation === letter
                            ? 'bg-blue-100 border-blue-500'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => handleSelectAnimation('alphabet', letter)}
                      >
                        <span className="text-lg font-medium">{letter}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'words' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Common Words</h2>
                  <div className="grid grid-cols-1 gap-2">
                    {AVAILABLE_WORDS.map((word: string) => (
                      <button
                        key={word}
                        className={`py-2 px-3 text-left rounded-lg border ${
                          selectedAnimation === word
                            ? 'bg-blue-100 border-blue-500'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => handleSelectAnimation('word', word)}
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'phrases' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Common Phrases</h2>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-600 text-center py-8">
                      Phrase animations will be available soon.
                    </p>
                  </div>
                </div>
              )}

              {/* Settings */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 mt-6">
                <h3 className="text-lg font-medium mb-4">Settings</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Animation Speed: {speed.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0.05"
                    max="0.25"
                    step="0.01"
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar
                  </label>
                  <div className="flex gap-2">
                    <button
                      className={`p-2 rounded-lg border ${
                        avatarModel === '/models/xbot.glb'
                          ? 'bg-blue-100 border-blue-500'
                          : 'bg-white border-gray-200'
                      }`}
                      onClick={() => setAvatarModel('/models/xbot.glb')}
                    >
                      XBot
                    </button>
                    <button
                      className={`p-2 rounded-lg border ${
                        avatarModel === '/models/ybot.glb'
                          ? 'bg-blue-100 border-blue-500'
                          : 'bg-white border-gray-200'
                      }`}
                      onClick={() => setAvatarModel('/models/ybot.glb')}
                    >
                      YBot
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main display area */}
          <div className="md:w-2/3 lg:w-3/4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold mb-4">
                {selectedAnimation ? `Showing: ${selectedAnimation}` : 'Select a sign to learn'}
              </h2>
              
              <div className="aspect-video relative bg-gray-50 rounded-lg overflow-hidden mb-4">
                {selectedAnimation && animationOptions.length > 0 ? (
                  <div className="w-full h-full">
                    {/* This is a placeholder - in real implementation we would use the EnhancedSignKitPlayer component */}
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🧏</div>
                        <p className="text-gray-700">
                          Animation for "{selectedAnimation}" would play here
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Using {avatarModel.includes('xbot') ? 'XBot' : 'YBot'} model at {speed.toFixed(2)} speed
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <div className="text-4xl mb-4">👆</div>
                      <p>Select an alphabet or word from the left to see it in sign language</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">How to Practice</h3>
                <ol className="list-decimal ml-5 space-y-2">
                  <li>Watch the animation carefully</li>
                  <li>Try to mimic the hand movements</li>
                  <li>Practice in front of a mirror</li>
                  <li>Slow down the animation speed if needed</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
