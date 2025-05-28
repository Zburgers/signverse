"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function ProfilePage() {
  // Mock user data
  const [user] = useState({
    name: 'Demo User',
    email: 'demo@example.com',
    avatar: '👤',
    joined: 'May 2025',
  });
  
  // Mock saved translations
  const [savedTranslations] = useState([
    { id: 1, title: 'Classroom Introduction', date: '2025-05-25', items: 7 },
    { id: 2, title: 'Welcome Speech', date: '2025-05-20', items: 12 },
    { id: 3, title: 'Math Lesson', date: '2025-05-15', items: 24 },
  ]);
  
  // Mock history
  const [history] = useState([
    { id: 1, text: 'Hello, how are you today?', date: '2025-05-27 14:30' },
    { id: 2, text: 'Welcome to the classroom', date: '2025-05-27 10:15' },
    { id: 3, text: 'Thank you for your attention', date: '2025-05-26 16:45' },
    { id: 4, text: 'Please open your textbooks', date: '2025-05-26 09:20' },
    { id: 5, text: 'Great job everyone!', date: '2025-05-25 15:10' },
  ]);
  
  // Active tab state
  const [activeTab, setActiveTab] = useState<'saved' | 'history' | 'settings'>('saved');
  
  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8 lg:p-12 bg-slate-50">
      <div className="max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/" className="text-blue-700 mb-4 block">← Back to Home</Link>
            <h1 className="text-3xl md:text-4xl font-bold">User Profile</h1>
          </div>
        </div>
        
        {/* User info and tabs */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* User info sidebar */}
          <div className="md:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex flex-col items-center mb-6">
                <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center text-4xl mb-4">
                  {user.avatar}
                </div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500 mt-1">Member since {user.joined}</p>
              </div>
              
              {/* Tab navigation */}
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`w-full text-left p-3 rounded-lg ${
                    activeTab === 'saved' 
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  Saved Translations
                </button>
                
                <button
                  onClick={() => setActiveTab('history')}
                  className={`w-full text-left p-3 rounded-lg ${
                    activeTab === 'history' 
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  Translation History
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left p-3 rounded-lg ${
                    activeTab === 'settings' 
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  Account Settings
                </button>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Link 
                  href="/auth/signin" 
                  className="block w-full text-center p-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  Sign Out
                </Link>
              </div>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="md:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Saved translations tab */}
              {activeTab === 'saved' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Saved Translations</h2>
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                      New Collection
                    </button>
                  </div>
                  
                  {savedTranslations.length > 0 ? (
                    <div className="space-y-4">
                      {savedTranslations.map((translation) => (
                        <div 
                          key={translation.id} 
                          className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                        >
                          <div className="flex justify-between">
                            <h3 className="font-medium">{translation.title}</h3>
                            <span className="text-sm text-gray-500">{translation.date}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{translation.items} sign sequences</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <p>No saved translations yet</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* History tab */}
              {activeTab === 'history' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Translation History</h2>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      Clear History
                    </button>
                  </div>
                  
                  {history.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {history.map((item) => (
                        <div key={item.id} className="py-4">
                          <div className="flex justify-between mb-1">
                            <p className="font-medium line-clamp-1">{item.text}</p>
                            <span className="text-xs text-gray-500 ml-4 whitespace-nowrap">{item.date}</span>
                          </div>
                          <div className="flex gap-2">
                            <button className="text-xs text-blue-600 hover:text-blue-800">
                              View Translation
                            </button>
                            <span className="text-gray-300">|</span>
                            <button className="text-xs text-blue-600 hover:text-blue-800">
                              Save
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <p>No translation history</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Settings tab */}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
                  
                  <form className="space-y-6">
                    <div>
                      <label htmlFor="display-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Display Name
                      </label>
                      <input
                        id="display-name"
                        type="text"
                        defaultValue={user.name}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        defaultValue={user.email}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Avatar</h3>
                      <div className="flex gap-4">
                        {['👤', '🧑', '👨', '👩', '🧓', '👱'].map((avatar) => (
                          <button
                            key={avatar}
                            className={`h-10 w-10 flex items-center justify-center rounded-full ${
                              user.avatar === avatar 
                                ? 'bg-blue-100 border-2 border-blue-500' 
                                : 'bg-gray-100'
                            }`}
                          >
                            {avatar}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                  
                  <div className="mt-12 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Danger Zone</h3>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      Delete Account
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
