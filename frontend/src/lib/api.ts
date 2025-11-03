const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface WalletData {
  id: number;
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
