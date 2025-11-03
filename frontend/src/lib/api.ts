const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface WalletData {
  wallet_id: number;
  stake_key: string;
  active: boolean;
  balance: string;
  rewards: string;
}

export async function getWalletData(walletId: number): Promise<WalletData> {
  const response = await fetch(`${API_BASE_URL}/wallets/${walletId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch wallet data');
  }

  return response.json();
}

export async function getWalletDataByStakeKey(stakeKey: string): Promise<WalletData> {
  // Encode the stake key for the URL
  const encodedStakeKey = encodeURIComponent(stakeKey);
  const response = await fetch(`${API_BASE_URL}/wallets/stake/${encodedStakeKey}`);

  if (!response.ok) {
    if (response.status === 404) {
      // Wallet doesn't exist, create it
      await createWalletIfNotExists(stakeKey);
      // Try fetching again
      const retryResponse = await fetch(`${API_BASE_URL}/wallets/stake/${encodedStakeKey}`);
      if (!retryResponse.ok) {
        throw new Error('Failed to fetch wallet data after creation');
      }
      return retryResponse.json();
    }
    throw new Error('Failed to fetch wallet data');
  }

  return response.json();
}

async function createWalletIfNotExists(stakeKey: string): Promise<void> {
  // First create a user
  const userResponse = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });

  if (!userResponse.ok) {
    throw new Error('Failed to create user');
  }

  const user = await userResponse.json();

  // Then create the wallet
  const walletResponse = await fetch(`${API_BASE_URL}/wallets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: user.id,
      stake_key: stakeKey,
      wallet_type: 'browser',
    }),
  });

  if (!walletResponse.ok) {
    throw new Error('Failed to create wallet');
  }
}

// Helper function to convert Lovelace to ADA
export function lovelaceToAda(lovelace: string): string {
  const lovelaceNum = BigInt(lovelace);
  const adaNum = Number(lovelaceNum) / 1_000_000;
  return adaNum.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
}
