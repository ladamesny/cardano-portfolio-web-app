'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '../../contexts/WalletContext';
import { getWalletDataByStakeKey, lovelaceToAda, WalletData } from '../../lib/api';
import { WALLETS } from '../../lib/wallet';

export default function Portfolio() {
  const { connectedWallet, stakeKey, disconnect } = useWallet();
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if not connected
    if (!connectedWallet || !stakeKey) {
      router.push('/');
    }
  }, [connectedWallet, stakeKey, router]);

  useEffect(() => {
    // Fetch wallet data when stake key is available
    const fetchWalletData = async () => {
      if (!stakeKey) return;

      setLoading(true);
      setError('');

      try {
        const data = await getWalletDataByStakeKey(stakeKey);
        setWalletData(data);
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to load wallet data';
        setError(errorMessage);
        console.error('Error fetching wallet data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [stakeKey]);

  const handleDisconnect = () => {
    disconnect();
    router.push('/');
  };

  const formatStakeKey = (stakeKey: string) => {
    if (!stakeKey) return '';
    return `${stakeKey.slice(0, 20)}...${stakeKey.slice(-20)}`;
  };

  const getWalletDisplayName = (walletName: string | null) => {
    if (!walletName) return 'Unknown';
    return WALLETS[walletName as keyof typeof WALLETS]?.displayName || walletName;
  };

  if (!connectedWallet || !stakeKey) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Cardano Portfolio
            </h1>
            <button
              onClick={handleDisconnect}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Disconnect
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Wallet Connection Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Connected Wallet
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {getWalletDisplayName(connectedWallet)}
                </p>
              </div>
            </div>
            <div className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold">
              Connected
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">
                Stake Key
              </label>
              <p className="text-gray-900 dark:text-white font-mono text-sm break-all">
                {stakeKey}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">
                Short Stake Key
              </label>
              <p className="text-gray-900 dark:text-white font-mono text-sm">
                {formatStakeKey(stakeKey)}
              </p>
            </div>
          </div>
        </div>

        {/* Portfolio Data Section */}
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Loading Portfolio Data
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Fetching wallet information from the blockchain...
            </p>
          </div>
        ) : walletData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Balance Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Balance</h3>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {lovelaceToAda(walletData.balance)} ADA
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {walletData.balance} Lovelace
              </p>
            </div>

            {/* Rewards Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Rewards</h3>
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {lovelaceToAda(walletData.rewards)} ADA
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {walletData.rewards} Lovelace
              </p>
            </div>

            {/* Wallet Details Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 md:col-span-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Wallet Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
                    Wallet ID
                  </label>
                  <p className="text-gray-900 dark:text-white font-semibold">
                    {walletData.wallet_id}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
                    Status
                  </label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    walletData.active 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {walletData.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg md:col-span-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
                    Stake Key
                  </label>
                  <p className="text-gray-900 dark:text-white font-mono text-sm break-all">
                    {walletData.stake_key}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Portfolio Data
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {error || 'Wallet data could not be loaded. Please try again later.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}