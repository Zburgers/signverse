"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import EnhancedSignKitPlayer from '@/components/EnhancedSignKitPlayer';

export default function TranslatePage() {
  const [inputText, setInputText] = useState('');
  const [translating, setTranslating] = useState(false);
  const [translationComplete, setTranslationComplete] = useState(false);
  const [animationOptions, setAnimationOptions] = useState<any[]>([]);
  const [speed, setSpeed] = useState(0.1);
  const [avatarModel, setAvatarModel] = useState('/models/ybot.glb');
  
  // Quick phrases for easy translation
  const quickPhrases = [
    "Hello, how are you?",
    "Thank you very much",
    "Good morning",
    "What's your name?",
    "Nice to meet you",
    "I don't understand",
    "Please speak slowly"
  ];
  
  // Sample phrase mapping for MVP - in a real app this would come from the backend
  const phraseMap: Record<string, string> = {
    'hello': '/glb/hello.glb',
    'how are you': '/glb/how_are_you.glb',
    'i am fine': '/glb/i_am_fine.glb',
    'thank you': '/glb/thank_you.glb',
    'welcome': '/glb/welcome.glb',
    'good morning': '/glb/good_morning.glb',
    'good night': '/glb/good_night.glb',
    'yes': '/glb/yes.glb',
    'no': '/glb/no.glb',
  };
  
  // Handle translation request
  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setTranslating(true);
    setTranslationComplete(false);
    
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real implementation, we would call an API to get the animation data
    // For now, we'll use the phraseMap for GLB animations as a placeholder
    const text = inputText.toLowerCase();
    const animationPath = phraseMap[text];
    
    if (animationPath) {
      setAnimationOptions([{
        type: 'glb',
        content: animationPath,
        speed
      }]);
    } else {
      // If we don't have an exact match, we'll just show a placeholder message
      // In a real implementation, we would process the text and generate animations
      setAnimationOptions([{
        type: 'placeholder',
        content: inputText,
        speed
      }]);
    }
    
    setTranslating(false);
    setTranslationComplete(true);
  };
  
  // Handle quick phrase selection
  const handleQuickPhrase = (phrase: string) => {
    setInputText(phrase);
    handleTranslate();
  };
  
  // Clear the translation
  const handleClear = () => {
    setInputText('');
    setTranslationComplete(false);
    setAnimationOptions([]);
  };
  
  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8 lg:p-12 bg-slate-50">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/" className="text-blue-700 mb-4 block">← Back to Home</Link>
            <h1 className="text-3xl md:text-4xl font-bold">Text to Sign Language</h1>
            <p className="text-gray-600 mt-2">Translate text into Indian Sign Language animations</p>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex flex-col-reverse md:flex-row gap-8">
          {/* Options and History Sidebar */}
          <div className="md:w-1/3 lg:w-1/4">
            {/* Translation settings */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
              <h3 className="text-lg font-medium mb-4">Translation Settings</h3>
              
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
            
            {/* Quick phrases */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
              <h3 className="text-lg font-medium mb-4">Quick Phrases</h3>
              <div className="space-y-2">
                {quickPhrases.map((phrase, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-2 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"
                    onClick={() => handleQuickPhrase(phrase)}
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Recent translations */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-4">Recently Translated</h3>
              <div className="text-gray-500 text-center py-8">
                <p>Your translation history will appear here</p>
              </div>
            </div>
          </div>
          
          {/* Main translation area */}
          <div className="md:w-2/3 lg:w-3/4">
            {/* Input area */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
              <h2 className="text-xl font-semibold mb-4">Enter Text to Translate</h2>
              
              <div className="mb-4">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type text to translate into sign language..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleTranslate}
                  disabled={translating || !inputText.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {translating ? 'Translating...' : 'Translate'}
                </button>
                
                <button
                  onClick={handleClear}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
            
            {/* Output area */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Sign Language Translation</h2>
              
              <div className="aspect-video relative bg-gray-50 rounded-lg overflow-hidden mb-4">
                {translationComplete && animationOptions.length > 0 ? (
                  <div className="w-full h-full">
                    {/* In a real implementation we would use the EnhancedSignKitPlayer component */}
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🧏</div>
                        <p className="text-gray-700">
                          Animation for "{inputText}" would play here
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Using {avatarModel.includes('xbot') ? 'XBot' : 'YBot'} model at {speed.toFixed(2)} speed
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    {translating ? (
                      <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                        <p className="text-gray-600">Translating your text...</p>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <div className="text-4xl mb-4">✍️</div>
                        <p>Enter some text above and click Translate</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {translationComplete && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Controls</h3>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors">
                      Replay
                    </button>
                    
                    <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors">
                      Slower
                    </button>
                    
                    <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors">
                      Faster
                    </button>
                    
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors ml-auto">
                      Save Translation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
