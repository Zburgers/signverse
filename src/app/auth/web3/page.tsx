"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function Web3Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  
  const handleConnect = async () => {
    setIsLoading(true);
    
    // This is a placeholder - no actual wallet connection happens
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate a successful connection with a fake wallet address
    const mockAddress = '0x' + Array(40).fill(0).map(() => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    setWalletAddress(mockAddress);
    setConnected(true);
    setIsLoading(false);
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-12 bg-slate-50">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-6">
            <Link href="/" className="inline-block">
              <h1 className="text-2xl font-bold text-blue-700">SignVerse</h1>
            </Link>
            <h2 className="text-xl font-semibold mt-4">Web3 Authentication</h2>
            <p className="text-gray-600 mt-1">Connect your Web3 wallet to SignVerse</p>
          </div>
          
          <div className="space-y-6">
            {connected ? (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-green-700 font-medium mb-2">Wallet Connected!</p>
                <div className="bg-white p-3 rounded-md border border-gray-200 break-all">
                  <p className="text-gray-700 text-sm">{walletAddress}</p>
                </div>
                <div className="mt-4">
                  <Link 
                    href="/dashboard" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    Continue to Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-purple-800">
                    Using Web3 authentication allows you to access SignVerse with your crypto wallet.
                    No passwords required!
                  </p>
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={handleConnect}
                    disabled={isLoading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? 'Connecting...' : 'Connect MetaMask'}
                  </button>
                  
                  <button
                    onClick={handleConnect}
                    disabled={isLoading}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? 'Connecting...' : 'Connect Wallet Connect'}
                  </button>
                  
                  <button
                    onClick={handleConnect}
                    disabled={isLoading}
                    className="w-full bg-gray-800 hover:bg-black text-white p-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? 'Connecting...' : 'Connect Coinbase Wallet'}
                  </button>
                </div>
              </div>
            )}
            
            <div className="pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600">
                Prefer traditional authentication?{' '}
                <Link href="/auth/signin" className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign in with email
                </Link>
              </p>
            </div>
            
            <p className="mt-8 text-center text-xs text-gray-500">
              This is a placeholder Web3 authentication page with no actual wallet connection functionality.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
