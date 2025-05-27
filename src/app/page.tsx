"use client";

import { useState } from 'react';
import SignKitPlayer from '@/components/SignKitPlayer';
// Using simple HTML/CSS instead of icon libraries to avoid dependency issues

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

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signFiles, setSignFiles] = useState<string[]>([]);
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
      const files: string[] = [];
      
      // Simple word-by-word matching for the MVP
      for (const word of words) {
        if (phraseMap[word]) {
          files.push(phraseMap[word]);
        }
      }
      
      // If no matches found, try to match phrases
      if (files.length === 0) {
        for (const phrase in phraseMap) {
          if (lowerText.includes(phrase)) {
            files.push(phraseMap[phrase]);
          }
        }
      }
      
      // Set the sign files to be played
      setSignFiles(files.length > 0 ? files : []);
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
      
      // Translate the extracted text
      await translateText(extractedText);
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
    
    // Add user message to chat
    const userMessage = { role: 'user' as const, content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    
    setIsLoading(true);
    
    try {
      // Translate the user message
      await translateText(chatInput);
      
      // Add assistant response
      const assistantMessage = { 
        role: 'assistant' as const, 
        content: "I've translated your message to Indian Sign Language." 
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in chat translation:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center mb-2">
            <span className="text-blue-500 mr-2 text-2xl">🌐</span>
            <h1 className="text-3xl font-bold">SignVerse</h1>
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
              <div className="flex flex-col">
                <label htmlFor="youtube-url" className="mb-1 text-sm font-medium text-gray-700">
                  YouTube Video URL
                </label>
                <input
                  id="youtube-url"
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading || !youtubeUrl}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Extract & Translate'}
              </button>
              
              <p className="text-sm text-gray-500">
                Note: For the MVP, this will use a sample text extraction.
              </p>
            </form>
          </div>
        )}
        
        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="mb-6 flex flex-col h-[300px]">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto mb-4 p-4 border rounded-lg bg-gray-50">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  Start a conversation to see ISL translations
                </div>
              ) : (
                <div className="space-y-4">
                  {chatMessages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[75%] rounded-lg px-4 py-2 ${
                          msg.role === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Chat Input */}
            <form onSubmit={handleChatSubmit} className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
                required
              />
              
              <button
                type="submit"
                disabled={isLoading || !chatInput.trim()}
                className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>➤</span>
              </button>
            </form>
          </div>
        )}
        
        {/* Sign Language Avatar Player */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Sign Language Output</h2>
          
          {signFiles.length > 0 ? (
            <SignKitPlayer 
              signFiles={signFiles} 
              onComplete={() => console.log('Animation sequence completed')}
            />
          ) : (
            <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500">
              Enter text or a YouTube URL to see the sign language translation
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
