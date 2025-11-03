'use client';

import React from 'react';
import { WalletName, WALLETS, getInstalledWallets } from '../lib/wallet';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (walletName: WalletName) => void;
  error?: string;
  isLoading?: boolean;
}

// Wallet Logo Component
function WalletLogo({ walletName }: { walletName: WalletName }) {
  const baseClasses = "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl";
  
  switch (walletName) {
    case 'yoroi':
      return (
        <div className={`${baseClasses} bg-gradient-to-br from-blue-500 to-blue-700`}>
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
      );
    case 'lace':
      return (
        <div className={`${baseClasses} bg-gradient-to-br from-indigo-500 to-purple-600`}>
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
          </svg>
        </div>
      );
    case 'eternl':
      return (
        <div className={`${baseClasses} bg-gradient-to-br from-purple-500 to-pink-600`}>
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.18l6 3.75v7.14l-6 3.75-6-3.75V7.18l6-3.75z" />
          </svg>
        </div>
      );
    default:
      return (
        <div className={`${baseClasses} bg-gradient-to-br from-gray-500 to-gray-700`}>
          ₳
        </div>
      );
  }
}

export default function WalletModal({ 
  isOpen, 
  onClose, 
  onSelectWallet, 
  error,
  isLoading 
}: WalletModalProps) {
  if (!isOpen) return null;

  const installedWallets = getInstalledWallets();

  const handleWalletSelect = (walletName: WalletName) => {
    if (!isLoading) {
      onSelectWallet(walletName);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Select Wallet</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {installedWallets.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Wallets Detected
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Please install one of the following Cardano wallets:
              </p>
              <div className="space-y-3">
                {Object.values(WALLETS).map((wallet) => (
                  <div 
                    key={wallet.name}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <WalletLogo walletName={wallet.name} />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {wallet.displayName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Choose a wallet to connect:
              </p>
              {installedWallets.map((wallet) => (
                <button
                  key={wallet.name}
                  onClick={() => handleWalletSelect(wallet.name)}
                  disabled={isLoading}
                  className="group w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-transparent flex items-center gap-4"
                >
                  <WalletLogo walletName={wallet.name} />
                  <div className="flex-1 text-left">
                    <span className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {wallet.displayName}
                    </span>
                  </div>
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

