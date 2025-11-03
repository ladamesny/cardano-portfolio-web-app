'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useRouter } from 'next/navigation';
import WalletModal from '../components/WalletModal';
import { WalletName } from '../lib/wallet';

export default function Home() {
  const { isConnected, connect } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Redirect to portfolio if already connected
  useEffect(() => {
    if (isConnected) {
      router.push('/portfolio');
    }
  }, [isConnected, router]);

  const handleConnectClick = () => {
    setError('');
    setIsModalOpen(true);
  };

  const handleWalletSelect = async (walletName: WalletName) => {
    setLoading(true);
    setError('');

    try {
      await connect(walletName);
      setIsModalOpen(false);
      router.push('/portfolio');
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to connect wallet';
      setError(errorMessage);
      console.error('Wallet connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    if (!loading) {
      setIsModalOpen(false);
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Cardano Portfolio
            </h1>
          </div>
        </div>
      </header>

      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full">
          {/* Hero Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
            {/* Logo/Icon Section */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <div className="text-white text-6xl font-bold">₳</div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Title and Description */}
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to Cardano Portfolio
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Connect your Cardano wallet to view your portfolio, track your balance, and manage your assets.
              </p>
            </div>

            {/* Connect Button */}
            <div className="flex justify-center">
              <button
                onClick={handleConnectClick}
                className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3"
                disabled={loading || isConnected}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Connect Wallet</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>

            {/* Features */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Secure</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Safe wallet connection</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Track Assets</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Monitor your portfolio</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Rewards</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">View your staking rewards</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <WalletModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelectWallet={handleWalletSelect}
        error={error}
        isLoading={loading}
      />
    </div>
  );
}