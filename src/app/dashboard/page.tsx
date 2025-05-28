"use client";

import { useState } from 'react';
import EnhancedSignKitPlayer from '@/components/EnhancedSignKitPlayer';
// Import animations using require since they're CommonJS modules
const alphabets = require('@/animations/alphabets');
const words = require('@/animations/words');
// Using simple HTML/CSS instead of icon libraries to avoid dependency issues

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

export default function Dashboard() {
  const [inputText, setInputText] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [animationOptions, setAnimationOptions] = useState<any[]>([]);
  const [speed, setSpeed] = useState<number>(0.1);
  const [avatarModel, setAvatarModel] = useState<string>('/models/ybot.glb');
  const [activeTab, setActiveTab] = useState('text'); // 'text', 'youtube', or 'chat'
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  
  // Function to translate text to sign language animations
  const translateText = async (text: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would call the backend API
      // For MVP, we'll use a simple text matching approach
      const lowerText = text.toLowerCase();
      const words = lowerText.split(/\s+/);
      const options: any[] = [];
      
      // First try exact matches with words animations
      for (const word of words) {
        const normalizedWord = word.replace(/[^a-z0-9]/g, '');
        
        // Check for bone animations first
        if (WORD_ANIMATIONS[normalizedWord.toUpperCase()]) {
          options.push({
            type: 'bone',
            content: WORD_ANIMATIONS[normalizedWord.toUpperCase()],
            speed
          });
        } 
        // Then check for GLB files
        else if (phraseMap[normalizedWord]) {
          options.push({
            type: 'glb',
            content: phraseMap[normalizedWord],
            speed
          });
        }
        // For single letters, use alphabet animations
        else if (normalizedWord.length === 1 && ALPHABET_ANIMATIONS[normalizedWord.toUpperCase()]) {
          options.push({
            type: 'bone',
            content: ALPHABET_ANIMATIONS[normalizedWord.toUpperCase()],
            speed
          });
        }
      }
      
      // If no matches found, try to match phrases
      if (options.length === 0) {
        for (const phrase in phraseMap) {
          if (lowerText.includes(phrase)) {
            options.push({
              type: 'glb',
              content: phraseMap[phrase],
              speed
            });
          }
        }
      }
      
      // Set the animations to be played
      setAnimationOptions(options);
    } catch (error) {
      console.error('Error translating text:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to handle YouTube URL submission
  const handleYoutubeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!youtubeUrl) return;
    
    setIsLoading(true);
    
    try {
      // In a real app, this would call the backend API to extract text from YouTube video
      // For MVP, we'll simulate with a delay and use a sample text
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sample extracted text from a video
      const extractedText = "Hello, how are you? Thank you for watching this video.";
      
      // Update UI with a message about the extracted text
      console.log(`Extracted text from video: ${extractedText}`);
      
      // Create an array for bone animations - for demo we'll use a predefined sequence
      const options = [];
      
      // Add "Hello" word animation
      if (WORD_ANIMATIONS['HELLO']) {
        options.push({
          type: 'bone',
          content: WORD_ANIMATIONS['HELLO'],
          speed
        });
      }
      
      // Add a pause between animations
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Add "THANK" animation if available
      if (WORD_ANIMATIONS['THANK'] && WORD_ANIMATIONS['YOU']) {
        options.push({
          type: 'bone',
          content: WORD_ANIMATIONS['THANK'],
          speed
        });
        
        options.push({
          type: 'bone',
          content: WORD_ANIMATIONS['YOU'],
          speed
        });
      } else {
        // Fallback to GLB if available
        if (phraseMap['thank you']) {
          options.push({
            type: 'glb',
            content: phraseMap['thank you'],
            speed
          });
        }
      }
      
      // Set animations to be played
      setAnimationOptions(options);
    } catch (error) {
      console.error('Error processing YouTube URL:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to handle chat message submission
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!chatInput.trim()) return;
    
    // Store current message for processing
    const currentMessage = chatInput.trim();
    
    // Add user message to chat
    const userMessage = { role: 'user' as const, content: currentMessage };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    
    setIsLoading(true);
    
    try {
      // Process message to create animation options
      const options: any[] = [];
      const lowerText = currentMessage.toLowerCase();
      const words = lowerText.split(/\s+/);
      
      // Process each word in the message
      for (const word of words) {
        const normalizedWord = word.replace(/[^a-z0-9]/g, '');
        
        // First try bone animations
        if (normalizedWord.length > 1 && WORD_ANIMATIONS[normalizedWord.toUpperCase()]) {
          options.push({
            type: 'bone',
            content: WORD_ANIMATIONS[normalizedWord.toUpperCase()],
            speed
          });
        } 
        // For single letters, use alphabet animations
        else if (normalizedWord.length === 1 && ALPHABET_ANIMATIONS[normalizedWord.toUpperCase()]) {
          options.push({
            type: 'bone',
            content: ALPHABET_ANIMATIONS[normalizedWord.toUpperCase()],
            speed
          });
        }
        // Finally, fallback to GLB files if available
        else if (phraseMap[normalizedWord]) {
          options.push({
            type: 'glb',
            content: phraseMap[normalizedWord],
            speed
          });
        }
      }
      
      // If no matches found for individual words, try matching phrases
      if (options.length === 0) {
        for (const phrase in phraseMap) {
          if (lowerText.includes(phrase)) {
            options.push({
              type: 'glb',
              content: phraseMap[phrase],
              speed
            });
          }
        }
      }
      
      // Set animations to be played
      setAnimationOptions(options);
      
      // Add assistant response
      const assistantMessage = { 
        role: 'assistant' as const, 
        content: options.length > 0 
          ? "I've translated your message to Indian Sign Language." 
          : "I couldn't find sign language translations for your message. Try more common words or phrases."
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in chat translation:', error);
      
      // Add error response
      const errorMessage = {
        role: 'assistant' as const,
        content: "Sorry, I encountered an error translating your message."
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12">
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center mb-2">
            <span className="text-blue-500 mr-2 text-2xl">🌐</span>
            <h1 className="text-3xl font-bold">SignVerse Dashboard</h1>
          </div>
          <p className="text-gray-600 text-center">
            Convert text, YouTube videos, or chat to Indian Sign Language
          </p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 ${
              activeTab === 'text' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('text')}
          >
            <span className="inline-block mr-1">📄</span>
            Text Input
          </button>
          
          <button
            className={`px-4 py-2 ${
              activeTab === 'youtube' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('youtube')}
          >
            <span className="inline-block mr-1">📺</span>
            YouTube
          </button>
          
          <button
            className={`px-4 py-2 ${
              activeTab === 'chat' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('chat')}
          >
            <span className="inline-block mr-1">💬</span>
            Chat
          </button>
        </div>
        
        {/* Text Input Tab */}
        {activeTab === 'text' && (
          <div className="mb-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                translateText(inputText);
              }}
              className="flex flex-col space-y-4"
            >
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to translate to ISL..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                required
              />
              
              <button
                type="submit"
                disabled={isLoading || !inputText}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Translating...' : 'Translate to Sign Language'}
              </button>
            </form>
          </div>
        )}
        
        {/* YouTube Tab */}
        {activeTab === 'youtube' && (
          <div className="mb-6">
            <form onSubmit={handleYoutubeSubmit} className="flex flex-col space-y-4">
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="Enter YouTube URL..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              
              <button
                type="submit"
                disabled={isLoading || !youtubeUrl}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Extract and Translate'}
              </button>
              
              <p className="text-xs text-gray-500">
                Note: YouTube video transcript will be extracted and translated to sign language
              </p>
            </form>
          </div>
        )}
        
        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="mb-6">
            <div className="bg-gray-50 border rounded-lg p-3 mb-4 min-h-[200px] max-h-[400px] overflow-y-auto">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  Start a conversation to translate to sign language
                </div>
              ) : (
                chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-2 p-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-100 ml-auto mr-0 text-right max-w-[80%]'
                        : 'bg-gray-200 mr-auto ml-0 max-w-[80%]'
                    }`}
                  >
                    {message.content}
                  </div>
                ))
              )}
            </div>
            
            <form onSubmit={handleChatSubmit} className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              
              <button
                type="submit"
                disabled={isLoading || !chatInput.trim()}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '...' : 'Send'}
              </button>
            </form>
          </div>
        )}
        
        {/* Sign Language Avatar Player */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Sign Language Output</h2>
            
            <div className="flex items-center space-x-4">
              {/* Avatar selection */}
              <div className="flex items-center">
                <label className="text-sm text-gray-600 mr-2">Avatar:</label>
                <select
                  value={avatarModel}
                  onChange={(e) => setAvatarModel(e.target.value)}
                  className="p-1 border rounded-md"
                >
                  <option value="/models/xbot.glb">XBot</option>
                  <option value="/models/ybot.glb">YBot</option>
                </select>
              </div>
              
              {/* Speed control */}
              <div className="flex items-center">
                <label className="text-sm text-gray-600 mr-2">Speed:</label>
                <input
                  type="range"
                  min="0.05"
                  max="0.25"
                  step="0.01"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm text-gray-600 ml-2">{speed.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {animationOptions.length > 0 ? (
            <div className="h-[400px] bg-gray-50 rounded-lg overflow-hidden">
              <EnhancedSignKitPlayer
                animations={animationOptions}
                avatarModel={avatarModel}
                autoPlay={true}
                onComplete={() => console.log('Animation sequence completed')}
              />
            </div>
          ) : (
            <div className="h-[400px] bg-gray-100 rounded-lg p-8 flex items-center justify-center">
              <div className="text-center text-gray-500">
                {isLoading ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                    <p>Processing your request...</p>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-4">👆</div>
                    <p>Enter text, a YouTube URL, or send a chat message to see the sign language translation</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
