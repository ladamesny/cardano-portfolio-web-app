'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { WalletName, connectWallet, getInstalledWallets, WalletInfo } from '../lib/wallet';

interface WalletContextType {
  connectedWallet: WalletName | null;
  stakeKey: string | null;
  installedWallets: WalletInfo[];
  connect: (walletName: WalletName) => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [connectedWallet, setConnectedWallet] = useState<WalletName | null>(null);
  const [stakeKey, setStakeKey] = useState<string | null>(null);
  const [installedWallets, setInstalledWallets] = useState<WalletInfo[]>([]);

  useEffect(() => {
    // Check for installed wallets on mount
    if (typeof window !== 'undefined') {
      setInstalledWallets(getInstalledWallets());
      
      // Check if wallet is already connected (from previous session)
      const savedWallet = localStorage.getItem('connectedWallet');
      const savedStakeKey = localStorage.getItem('stakeKey');
      if (savedWallet && savedStakeKey) {
        setConnectedWallet(savedWallet as WalletName);
        setStakeKey(savedStakeKey);
      }
    }
  }, []);

  const connect = async (walletName: WalletName) => {
    try {
      const stakeKeyValue = await connectWallet(walletName);
      setConnectedWallet(walletName);
      setStakeKey(stakeKeyValue);
      localStorage.setItem('connectedWallet', walletName);
      localStorage.setItem('stakeKey', stakeKeyValue);
    } catch (error) {
      throw error;
    }
  };

  const disconnect = () => {
    setConnectedWallet(null);
    setStakeKey(null);
    localStorage.removeItem('connectedWallet');
    localStorage.removeItem('stakeKey');
  };

  return (
    <WalletContext.Provider
      value={{
        connectedWallet,
        stakeKey,
        installedWallets,
        connect,
        disconnect,
        isConnected: !!connectedWallet && !!stakeKey,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

