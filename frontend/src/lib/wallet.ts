// Wallet types and utilities for Cardano wallet connections

export type WalletName = 'yoroi' | 'lace' | 'eternl';

export interface WalletInfo {
  name: WalletName;
  displayName: string;
  icon?: string;
}

export const WALLETS: Record<WalletName, WalletInfo> = {
  yoroi: {
    name: 'yoroi',
    displayName: 'Yoroi',
  },
  lace: {
    name: 'lace',
    displayName: 'Lace',
  },
  eternl: {
    name: 'eternl',
    displayName: 'Eternl',
  },
};

// Check if a wallet is installed
export function isWalletInstalled(walletName: WalletName): boolean {
  if (typeof window === 'undefined') return false;
  
  const cardano = (window as any).cardano;
  if (!cardano) return false;
  
  return !!cardano[walletName];
}

// Get all installed wallets
export function getInstalledWallets(): WalletInfo[] {
  return Object.values(WALLETS).filter(wallet => isWalletInstalled(wallet.name));
}

// Helper function to check if an address is in bech32 format
function isBech32Address(address: string): boolean {
  return address.startsWith('addr') || address.startsWith('addr_test') || address.startsWith('stake');
}

// Helper function to check if a string is hex
function isHexString(str: string): boolean {
  return /^[0-9a-fA-F]+$/.test(str);
}

// Connect to a wallet
export async function connectWallet(walletName: WalletName): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('Window object is not available');
  }

  const cardano = (window as any).cardano;
  if (!cardano) {
    throw new Error('No Cardano wallet extension found');
  }

  const wallet = cardano[walletName];
  if (!wallet) {
    throw new Error(`${WALLETS[walletName].displayName} wallet is not installed`);
  }

  try {
    const walletApi = await wallet.enable();

    // Network check: compare wallet network with expected network from env
    const expectedNetworkRaw = process.env.NEXT_PUBLIC_CARDANO_NETWORK || 'preview';
    const expectedNetworkEnv = expectedNetworkRaw.toLowerCase().trim();
    // Simplified check: mainnet vs testnet (hardcoded to preview)
    const isMainnet = expectedNetworkEnv === 'mainnet';
    const expectedNetworkId = isMainnet ? 1 : 0; // mainnet=1, testnet=0

    if (typeof walletApi.getNetworkId === 'function') {
      try {
        const networkId: number = await walletApi.getNetworkId();
        if (networkId !== expectedNetworkId) {
          const actualLabel = networkId === 1 ? 'mainnet' : 'preview testnet';
          const expectedLabel = isMainnet ? 'mainnet' : 'preview testnet';
          throw new Error(`Wallet network mismatch. Your wallet is on "${actualLabel}". Please switch your wallet to "${expectedLabel}" and try again.`);
        }
      } catch (netErr) {
        // If network check fails unexpectedly, surface a helpful message
        if (netErr instanceof Error) {
          throw netErr;
        }
        throw new Error('Failed to verify wallet network. Please check your wallet settings.');
      }
    }
    
    // Helper to normalize address (handle arrays, hex, bech32, etc.)
    const normalizeAddress = async (addr: any): Promise<string> => {
      // If it's already a bech32 string, return it
      if (typeof addr === 'string') {
        if (isBech32Address(addr)) {
          return addr;
        }
        // If it's a hex string, convert it
        if (isHexString(addr)) {
          return await convertHexToBech32(addr);
        }
        return addr;
      }
      
      // If it's an array (bytes), convert to bech32
      if (Array.isArray(addr) || addr instanceof Uint8Array) {
        return await convertBytesToBech32(Array.isArray(addr) ? new Uint8Array(addr) : addr);
      }
      
      // Unknown format
      console.warn('Unknown address format:', addr);
      return String(addr);
    };
    
    // Helper to convert bytes to bech32
    const convertBytesToBech32 = async (bytes: Uint8Array): Promise<string> => {
      try {
        const Cardano = await import('@emurgo/cardano-serialization-lib-browser');
        const addr = Cardano.Address.from_bytes(bytes);
        return addr.to_bech32();
      } catch (error) {
        console.error('Failed to convert bytes to bech32:', error);
        throw new Error('Failed to convert address bytes to bech32 format');
      }
    };
    
    // Helper to convert hex string to bech32
    const convertHexToBech32 = async (hex: string): Promise<string> => {
      const hexString = hex.startsWith('0x') ? hex.slice(2) : hex;
      const bytes = new Uint8Array(hexString.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
      return await convertBytesToBech32(bytes);
    };
    
    // Try to get stake key (reward address) first - this is what we want
    let stakeKey: any = undefined;
    
    // Prioritize getRewardAddresses - returns stake addresses (stake1...)
    if (walletApi.getRewardAddresses) {
      const addresses = await walletApi.getRewardAddresses();
      if (addresses && addresses.length > 0) {
        stakeKey = addresses[0];
      }
    }
    
    if (!stakeKey) {
      throw new Error('No stake key found in wallet');
    }
    
    // Normalize the stake key to bech32 format (should start with "stake")
    return await normalizeAddress(stakeKey);
  } catch (error: any) {
    if (error.code === 1 || error.code === 2) {
      // User rejected the connection
      throw new Error('Connection cancelled by user');
    }
    // Re-throw with the original error message if available
    if (error.message) {
      throw error;
    }
    throw new Error('Failed to connect to wallet');
  }
}

// Get wallet icon (you can add actual icons later)
export function getWalletIcon(walletName: WalletName): string {
  // Return placeholder or actual icon path
  return '';
}

