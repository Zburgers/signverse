"use client";

import { useState, useRef, useEffect } from 'react';
import EnhancedSignKitPlayer from './EnhancedSignKitPlayer';
import { getAvailableAlphabets, getAvailableWords } from '@/lib/signKitBridge';

export default function SignLanguageDemo() {
  const [inputText, setInputText] = useState('');
  const [textToAnimate, setTextToAnimate] = useState('');
  const [avatarModel, setAvatarModel] = useState('/models/ybot.glb');
  const [speed, setSpeed] = useState(0.1);
  const [pauseDuration, setPauseDuration] = useState(800);
  const [showAlphabets, setShowAlphabets] = useState(true);
  const [showWords, setShowWords] = useState(false);

  const alphabets = getAvailableAlphabets();
  const words = getAvailableWords();

  // Handler for text animation
  const handleTextAnimation = () => {
    console.log('[SignDemo] Animate pressed, inputText=', inputText);
    setTextToAnimate(inputText.trim());
  };
  
  // Toggle between showing alphabets or words
  const toggleDisplay = (type: 'alphabets' | 'words') => {
    if (type === 'alphabets') {
      setShowAlphabets(true);
      setShowWords(false);
    } else {
      setShowAlphabets(false);
      setShowWords(true);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Indian Sign Language Demonstration</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Controls Panel */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text to Animate
            </label>
            <div className="flex">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-l px-3 py-2"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to animate..."
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
                onClick={handleTextAnimation}
                onTouchStart={handleTextAnimation}
                type="button"
              >
                Animate
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avatar Model
            </label>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-2 rounded ${avatarModel === '/models/xbot.glb' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setAvatarModel('/models/xbot.glb')}
              >
                XBot
              </button>
              <button
                className={`px-3 py-2 rounded ${avatarModel === '/models/ybot.glb' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setAvatarModel('/models/ybot.glb')}
              >
                YBot
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Animation Speed: {speed.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.01"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pause Duration: {pauseDuration}ms
            </label>
            <input
              type="range"
              min="0"
              max="2000"
              step="100"
              value={pauseDuration}
              onChange={(e) => setPauseDuration(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <div className="flex space-x-2 mb-2">
              <button
                className={`px-3 py-2 rounded ${showAlphabets ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => toggleDisplay('alphabets')}
              >
                Alphabets
              </button>
              <button
                className={`px-3 py-2 rounded ${showWords ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => toggleDisplay('words')}
              >
                Words
              </button>
            </div>
            
            {showAlphabets && (
              <div className="grid grid-cols-4 gap-2">
                {alphabets.map((letter) => (
                  <button
                    key={letter}
                    className="bg-gray-200 hover:bg-gray-300 py-2 rounded"
                    onClick={() => setInputText(letter)}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            )}
            
            {showWords && (
              <div className="grid grid-cols-3 gap-2">
                {words.map((word) => (
                  <button
                    key={word}
                    className="bg-gray-200 hover:bg-gray-300 py-2 rounded text-xs"
                    onClick={() => setInputText(word)}
                  >
                    {word}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Animation Display */}
        <div className="lg:col-span-2 bg-gray-100 rounded-lg min-h-[500px] flex items-center justify-center">
          <EnhancedSignKitPlayer
            text={textToAnimate}
            avatarModel={avatarModel}
            speed={speed}
            pauseDuration={pauseDuration}
            autoPlay={true}
            showControls={true}
          />
        </div>
      </div>
    </div>
  );
}
