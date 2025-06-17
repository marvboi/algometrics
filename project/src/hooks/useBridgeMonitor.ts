import { useState, useEffect } from 'react';
import { algorandAPI } from '../services/algorand';

interface BridgeTransaction {
  id: string;
  timestamp: string;
  sourceChain: string;
  targetChain: string;
  amount: string;
  token: string;
  status: string;
  txHash: string;
  emitterAddress: string;
  sequence: number;
}

interface BridgeStats {
  totalTransactions: number;
  transactions24h: number;
  transactions7d: number;
  volume24h: number;
  avgTransactionTime: number;
  bridgeStatus: string;
  lastUpdate: string;
}

interface BridgeHealth {
  bridgeStatus: string;
  successRate: number;
  guardiansOnline: number;
  lastTransaction: string | null;
  networkLatency: number;
  healthScore: number;
  lastHealthCheck: string;
}

export const useBridgeMonitor = () => {
  const [transactions, setTransactions] = useState<BridgeTransaction[]>([]);
  const [stats, setStats] = useState<BridgeStats | null>(null);
  const [health, setHealth] = useState<BridgeHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBridgeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all bridge data in parallel
      const [rawTransactions, bridgeStats, bridgeHealth] = await Promise.all([
        algorandAPI.getWormholeBridgeTransactions(50),
        algorandAPI.getWormholeBridgeStats(),
        algorandAPI.getWormholeBridgeHealth()
      ]);

      // Transform raw transactions to our interface
      const formattedTransactions: BridgeTransaction[] = rawTransactions.map((tx: any, index: number) => ({
        id: tx.id || `tx-${index}`,
        timestamp: tx.timestamp || new Date().toISOString(),
        sourceChain: getChainName(tx.emitterChain || 8),
        targetChain: getChainName(tx.targetChain || 2), // Default to Ethereum
        amount: tx.payload?.amount || '0',
        token: tx.payload?.tokenSymbol || 'ALGO',
        status: tx.status || 'completed',
        txHash: tx.txHash || tx.id || '',
        emitterAddress: tx.emitterAddress || '',
        sequence: tx.sequence || 0
      }));

      setTransactions(formattedTransactions);
      setStats(bridgeStats);
      setHealth(bridgeHealth);
    } catch (err) {
      console.error('Error fetching bridge data:', err);
      setError('Failed to fetch bridge monitoring data');
    } finally {
      setLoading(false);
    }
  };

  const getChainName = (chainId: number): string => {
    const chainNames: { [key: number]: string } = {
      1: 'Solana',
      2: 'Ethereum',
      3: 'Terra',
      4: 'BSC',
      5: 'Polygon',
      6: 'Avalanche',
      7: 'Oasis',
      8: 'Algorand',
      9: 'Aurora',
      10: 'Fantom',
      11: 'Karura',
      12: 'Acala',
      13: 'Klaytn',
      14: 'Celo',
      15: 'Near',
      16: 'Moonbeam',
      17: 'Neon',
      18: 'Terra2',
      19: 'Injective',
      20: 'Osmosis',
      21: 'Sui',
      22: 'Aptos',
      23: 'Arbitrum',
      24: 'Optimism',
      25: 'Gnosis',
      26: 'Pythnet',
      27: 'XPLA',
      28: 'BTC',
      29: 'Base',
      30: 'Sei'
    };
    return chainNames[chainId] || `Chain ${chainId}`;
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'healthy':
      case 'operational':
        return 'text-green-600';
      case 'pending':
      case 'degraded':
        return 'text-yellow-600';
      case 'failed':
      case 'unhealthy':
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getHealthStatus = (): { status: string; color: string; description: string } => {
    if (!health) return { status: 'Unknown', color: 'text-gray-600', description: 'Loading...' };

    const score = health.healthScore;
    if (score >= 90) {
      return { 
        status: 'Excellent', 
        color: 'text-green-600', 
        description: 'Bridge operating optimally' 
      };
    } else if (score >= 75) {
      return { 
        status: 'Good', 
        color: 'text-blue-600', 
        description: 'Bridge operating normally' 
      };
    } else if (score >= 50) {
      return { 
        status: 'Fair', 
        color: 'text-yellow-600', 
        description: 'Bridge experiencing minor issues' 
      };
    } else {
      return { 
        status: 'Poor', 
        color: 'text-red-600', 
        description: 'Bridge experiencing significant issues' 
      };
    }
  };

  // Auto-refresh every 30 seconds for real-time updates
  useEffect(() => {
    fetchBridgeData();
    const interval = setInterval(fetchBridgeData, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    transactions,
    stats,
    health,
    loading,
    error,
    refetch: fetchBridgeData,
    getStatusColor,
    getHealthStatus,
    getChainName
  };
}; 