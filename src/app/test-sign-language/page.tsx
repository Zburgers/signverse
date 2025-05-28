"use client";

import EnhancedSignKitPlayer from '@/components/EnhancedSignKitPlayer';
import { useState } from 'react';

export default function TestSignLanguagePage() {
  const [inputText, setInputText] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [speed, setSpeed] = useState(0.1);
  const [avatarModel, setAvatarModel] = useState('/models/ybot.glb');

  const handleSubmit = () => setDisplayText(inputText.trim());

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign Language Demo</h1>
          <p className="text-lg text-gray-600">
            Test the Indian Sign Language animation system
          </p>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Type text to animate..."
            className="w-full p-2 border rounded"
            rows={3}
          />
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >Animate</button>
            <label className="flex items-center space-x-2">
              <span className="text-sm">Speed:</span>
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={speed}
                onChange={e => setSpeed(parseFloat(e.target.value))}
              />
            </label>
            <label className="flex items-center space-x-2">
              <span className="text-sm">Model:</span>
              <select
                value={avatarModel}
                onChange={e => setAvatarModel(e.target.value)}
                className="border rounded p-1"
              >
                <option value="/models/ybot.glb">YBot</option>
                <option value="/models/xbot.glb">XBot</option>
              </select>
            </label>
          </div>
          <EnhancedSignKitPlayer
            text={displayText}
            speed={speed}
            avatarModel={avatarModel}
          />
        </div>
        
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">How to Use This Demo</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Type text in the input field to see it signed in Indian Sign Language</li>
            <li>Use the speed slider to adjust animation speed</li>
            <li>Toggle between different avatar models</li>
            <li>View available alphabets and words in the dropdown</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
