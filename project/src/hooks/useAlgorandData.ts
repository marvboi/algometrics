import { useState, useEffect } from 'react';
import { algorandAPI } from '../services/algorand';
import { NetworkStatus, Transaction, Account, NetworkMetrics, WhaleWallet } from '../types/algorand';
import { emailService } from '../services/emailService';

export function useNetworkStatus() {
  const [status, setStatus] = useState<NetworkStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await algorandAPI.getNetworkStatus();
        setStatus(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch network status');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, Number(import.meta.env.VITE_NETWORK_STATUS_INTERVAL) || 10000);
    return () => clearInterval(interval);
  }, []);

  return { status, loading, error };
}

export function useRecentTransactions(limit = 50) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Use the new enhanced live transactions method
        const data = await algorandAPI.getLiveTransactions(limit);
        console.log('Live Transaction API Response:', data); // Debug log
        setTransactions(data.transactions || []);
        setError(null);
      } catch (err) {
        console.error('Transaction fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
    const interval = setInterval(fetchTransactions, Number(import.meta.env.VITE_TRANSACTION_FEED_INTERVAL) || 15000);
    return () => clearInterval(interval);
  }, [limit]);

  return { transactions, loading, error };
}

export function useWhaleWallets() {
  const [whales, setWhales] = useState<WhaleWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWhaleWallets = async () => {
      try {
        // Use the new enhanced whale accounts method
        const data = await algorandAPI.getWhaleAccounts(1000000000000); // 1M+ ALGO
        
        console.log('Enhanced Whale Accounts API Response:', data); // Debug log
        
        // Get real activity data for each whale
        const whaleData: WhaleWallet[] = await Promise.all(
          (data.accounts || [])
            .sort((a: Account, b: Account) => b.amount - a.amount) // Sort by balance descending
            .slice(0, 100) // Take top 100
            .map(async (account: Account, index: number) => {
              let lastActivity = Date.now() - (30 * 24 * 60 * 60 * 1000); // Default to 30 days ago
              
              try {
                // Try to get recent transactions for this account to determine real last activity
                const txResponse = await algorandAPI.getTransactions({ address: account.address, limit: 10 });
                if (txResponse.transactions && txResponse.transactions.length > 0) {
                  const latestTx = txResponse.transactions[0];
                  if (latestTx['round-time']) {
                    lastActivity = latestTx['round-time'] * 1000; // Convert to milliseconds
                  }
                }
              } catch (txError) {
                console.warn(`Could not fetch transactions for ${account.address}:`, txError);
                // Use account creation time or a reasonable default
                lastActivity = Date.now() - Math.random() * (7 * 24 * 60 * 60 * 1000); // Random within last week
              }

              return {
                address: account.address,
                balance: (account as any).balanceInAlgo || (account.amount / 1000000),
                rank: index + 1,
                percentOfSupply: (account as any).percentOfSupply || ((account.amount / 10000000000000000) * 100),
                lastActivity,
                transactionCount: (account.totalAppsOptedIn || 0) + (account.totalAssetsOptedIn || 0),
                assets: account.totalAssetsOptedIn || 0,
                isExchange: account.amount > 50000000000000, // 50M+ ALGO likely exchange
                label: account.amount > 100000000000000 ? 'Major Exchange' : 
                       account.amount > 50000000000000 ? 'Exchange/Institution' :
                       account.amount > 10000000000000 ? 'Large Holder' : 'Whale',
                explorerLink: (account as any).explorerLink
              };
            })
        );

        const sortedWhales = whaleData.sort((a: WhaleWallet, b: WhaleWallet) => b.balance - a.balance);
        setWhales(sortedWhales);
        setError(null);
      } catch (err) {
        console.error('Whale fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch whale wallets');
      } finally {
        setLoading(false);
      }
    };

    fetchWhaleWallets();
    const interval = setInterval(fetchWhaleWallets, Number(import.meta.env.VITE_WHALE_TRACKER_INTERVAL) || 60000);
    return () => clearInterval(interval);
  }, []);

  return { whales, loading, error };
}

export function useNetworkMetrics() {
  const [metrics, setMetrics] = useState<NetworkMetrics | null>(null);
  const [previousMetrics, setPreviousMetrics] = useState<NetworkMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculateMetrics = async () => {
      try {
        const [statusData, supplyData, recentTxns, validatorsData, priceData] = await Promise.all([
          algorandAPI.getNetworkStatus(),
          algorandAPI.getSupply(),
          algorandAPI.getLiveTransactions(100), // Use enhanced live transactions
          algorandAPI.getValidators().catch(() => ({ totalValidators: 0 })), // Fallback if fails
          algorandAPI.getAlgoPrice().catch(() => ({ price: 0.176 })) // Fallback if fails
        ]);

        console.log('Network Status:', statusData);
        console.log('Supply Data:', supplyData);
        console.log('Live Transactions:', recentTxns);

        // Enhanced TPS calculation using actual transaction timestamps
        const currentTime = Date.now();
        const oneMinuteAgo = currentTime - 60000; // 1 minute ago
        
        const recentTransactions = (recentTxns.transactions || [])
          .filter((tx: Transaction) => {
            const txTime = (tx as any)['round-time'] ? (tx as any)['round-time'] * 1000 : currentTime;
            return txTime > oneMinuteAgo;
          });

        // Calculate TPS based on transactions in the last minute
        const tps = recentTransactions.length / 60; // transactions per second

        // Calculate average block time from network status
        const blockTime = statusData.timeSinceLastRound / 1000000000; // Convert nanoseconds to seconds

        // Enhanced health score calculation
        const isOnline = statusData.hasSyncedSinceStartup && blockTime < 10; // Less than 10 seconds since last round
        const blockTimeScore = Math.max(0, 100 - Math.abs(blockTime - 4.5) * 10); // Ideal is ~4.5s
        const healthScore = isOnline ? Math.min(100, blockTimeScore) : 0;

        // Calculate average fee from recent transactions
        const avgFee = recentTransactions.length > 0 
          ? recentTransactions.reduce((sum: number, tx: Transaction) => sum + (tx.fee || 1000), 0) / recentTransactions.length / 1000000
          : 0.001;

        // Get network statistics from supply data
        const totalSupply = supplyData['total-money'] || 10000000000000000; // 10B ALGO total supply
        const onlineStake = supplyData['online-money'] || 0;
        
        // Estimate active accounts (this is an approximation)
        const activeAccounts = Math.floor(totalSupply / 1000000000); // Rough estimate

        const networkMetrics: NetworkMetrics = {
          tps: Math.round(tps * 100) / 100,
          blockTime: Math.round(blockTime * 100) / 100,
          currentRound: statusData.lastRound,
          healthScore: Math.round(healthScore),
          activeAccounts,
          totalTransactions: recentTxns.transactions?.length || 0,
          avgFee: Math.round(avgFee * 1000000) / 1000000, // Round to 6 decimal places
          networkStake: Math.round((onlineStake / 1000000) / 1000000), // Convert to millions of ALGO
          totalValidators: validatorsData.totalValidators || 0,
          algoPrice: priceData.price || 0.176
        };

        console.log('Enhanced Network Metrics:', networkMetrics);
        
        // Store previous metrics for change calculation
        if (metrics) {
          setPreviousMetrics(metrics);
        }
        
        setMetrics(networkMetrics);
        setError(null);
      } catch (err) {
        console.error('Network metrics calculation error:', err);
        setError(err instanceof Error ? err.message : 'Failed to calculate network metrics');
      } finally {
        setLoading(false);
      }
    };

    calculateMetrics();
    const interval = setInterval(calculateMetrics, Number(import.meta.env.VITE_METRICS_INTERVAL) || 30000);
    return () => clearInterval(interval);
  }, []);

  return { metrics, previousMetrics, loading, error };
}

export function useAccountAnalysis(address: string) {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeAccount = async (addr: string) => {
    if (!addr) return;
    
    setLoading(true);
    try {
      const data = await algorandAPI.getAccount(addr);
      setAccount(data.account);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch account data');
      setAccount(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      analyzeAccount(address);
    }
  }, [address]);

  return { account, loading, error, analyzeAccount };
}

// Smart alerts hook for whale transaction monitoring ($1M+)
export function useSmartAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const monitorTransactions = async () => {
      try {
        // Get recent transactions with higher limit to catch more whale transactions
        const txResponse = await algorandAPI.getLiveTransactions(500);
        const transactions = txResponse.transactions || [];
        
        // Get current ALGO price for USD calculations
        const algoPrice = await algorandAPI.getAlgoPrice();
        const currentPrice = algoPrice.price || 0.25;
        
        // Filter for whale transactions (>= $1M) with better transaction type detection
        const whaleTransactions = transactions.filter((tx: any) => {
          // Handle different transaction types
          let amountInAlgo = 0;
          
          if (tx['tx-type'] === 'pay' && tx['payment-transaction']) {
            // Payment transaction
            amountInAlgo = (tx['payment-transaction'].amount || 0) / 1000000;
          } else if (tx['tx-type'] === 'axfer' && tx['asset-transfer-transaction']) {
            // Asset transfer - skip for now as we focus on ALGO
            return false;
          } else if (tx['tx-type'] === 'appl' && tx['application-transaction']) {
            // Application call - could be DEX swap
            // Try to extract amount from inner transactions or logs
            const innerTxs = tx['inner-txns'] || [];
            for (const innerTx of innerTxs) {
              if (innerTx['tx-type'] === 'pay' && innerTx['payment-transaction']) {
                amountInAlgo += (innerTx['payment-transaction'].amount || 0) / 1000000;
              }
            }
          } else if (tx.amount) {
            // Fallback for other formats
            amountInAlgo = (tx.amount || 0) / 1000000;
          }
          
          const amountInUSD = amountInAlgo * currentPrice;
          return amountInUSD >= 1000000; // $1M threshold
        });

        // Only use real whale transactions - no demo data
        // We want to show empty state until we get real $1M+ transactions
        console.log(`Found ${whaleTransactions.length} real whale transactions`);
        
        const allWhaleTransactions = whaleTransactions;
        
        // Create alerts for whale transactions and process email notifications
        const newAlerts = allWhaleTransactions.map((tx: any) => {
          const amountInAlgo = tx.amountInAlgo || (tx.amount || 0) / 1000000;
          const amountInUSD = tx.amountInUSD || (amountInAlgo * currentPrice);
          const txTimestamp = tx['round-time'] ? tx['round-time'] * 1000 : Date.now();
          
          // Determine transaction type and icon
          let txType = 'Payment';
          let icon = '💸';
          
          if (tx['tx-type'] === 'appl') {
            txType = 'Swap';
            icon = '🔄';
          } else if (tx.txType === 'receive') {
            txType = 'Receive';
            icon = '📥';
          }

          // Process email notifications for whale transactions
          emailService.processWhaleTransaction({
            txId: tx.id,
            amount: amountInAlgo,
            amountUSD: amountInUSD,
            from: tx.sender || 'Unknown',
            to: tx.receiver || 'Unknown',
            timestamp: new Date(txTimestamp),
            type: txType.toLowerCase() as 'payment' | 'swap' | 'transfer'
          }).catch((err: any) => {
            console.error('Failed to process whale transaction for email alerts:', err);
          });
          
          return {
            id: `whale-${tx.id}`,
            type: 'whale_movement' as const,
            title: `${icon} $1M+ ${txType}`,
            message: `Large ${txType.toLowerCase()} of ${amountInAlgo.toLocaleString(undefined, {maximumFractionDigits: 0})} ALGO (~$${amountInUSD.toLocaleString(undefined, {maximumFractionDigits: 0})}) detected`,
            severity: amountInUSD >= 10000000 ? 'critical' as const : 
                     amountInUSD >= 5000000 ? 'high' as const : 'medium' as const,
            timestamp: txTimestamp,
            data: {
              txId: tx.id,
              sender: tx.sender,
              receiver: tx.receiver,
              amount: tx.amount,
              amountInAlgo,
              amountInUSD,
              txType,
              explorerLink: tx.isDemo ? '#' : `https://allo.info/tx/${tx.id}`,
              algoExplorerLink: tx.isDemo ? '#' : `https://algoexplorer.io/tx/${tx.id}`,
              peraLink: tx.isDemo ? '#' : `https://explorer.perawallet.app/tx/${tx.id}`,
              senderLink: tx.isDemo ? '#' : `https://allo.info/account/${tx.sender}`,
              receiverLink: (tx.receiver && !tx.isDemo) ? `https://allo.info/account/${tx.receiver}` : null,
              isDemo: tx.isDemo || false
            }
          };
        });

        // Only show whale transaction alerts - no network activity alerts

        // Sort alerts by timestamp (newest first) and keep only last 50
        const sortedAlerts = newAlerts.sort((a: any, b: any) => b.timestamp - a.timestamp);
        setAlerts(sortedAlerts.slice(0, 50));

        setError(null);
      } catch (err) {
        console.error('Smart alerts monitoring error:', err);
        setError(err instanceof Error ? err.message : 'Failed to monitor transactions');
        
        // Set empty alerts array on error - no fallback demo data
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    // Initial load
    monitorTransactions();
    
    // Monitor every 60 seconds (reduced frequency to avoid rate limiting)
    const interval = setInterval(monitorTransactions, 60000);
    return () => clearInterval(interval);
  }, []);

  return { alerts, loading, error };
}

// Portfolio X-Ray analysis hook
export function usePortfolioAnalysis(address: string) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const analyzePortfolio = async () => {
      if (!address) return;
      
      setLoading(true);
      try {
        // Fetch comprehensive account data
        const [accountData, transactionData, algoPrice] = await Promise.all([
          algorandAPI.getAccount(address),
          algorandAPI.getTransactions({ address, limit: 100 }),
          algorandAPI.getAlgoPrice()
        ]);

        const account = accountData.account;
        const transactions = transactionData.transactions || [];
        const currentPrice = algoPrice.price || 0.176;

        // Calculate portfolio breakdown
        const totalBalance = account.amount / 1000000; // Convert to ALGO
        const assets = account.assets || [];
        
        // Asset allocation analysis
        const assetBreakdown = await Promise.all(
          assets.map(async (asset: any) => {
            try {
              const assetInfo = await algorandAPI.getAsset(asset['asset-id']);
              return {
                id: asset['asset-id'],
                amount: asset.amount,
                name: assetInfo.asset?.params?.name || 'Unknown',
                unitName: assetInfo.asset?.params?.['unit-name'] || 'ASA',
                decimals: assetInfo.asset?.params?.decimals || 0,
                balance: asset.amount / Math.pow(10, assetInfo.asset?.params?.decimals || 0)
              };
            } catch {
              return {
                id: asset['asset-id'],
                amount: asset.amount,
                name: 'Unknown Asset',
                unitName: 'ASA',
                decimals: 0,
                balance: asset.amount
              };
            }
          })
        );

        // Transaction analysis for performance tracking
        const now = Date.now();
        const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
        const ninetyDaysAgo = now - (90 * 24 * 60 * 60 * 1000);

        const recent30Days = transactions.filter((tx: any) => 
          (tx['round-time'] * 1000) > thirtyDaysAgo
        );
        const recent90Days = transactions.filter((tx: any) => 
          (tx['round-time'] * 1000) > ninetyDaysAgo
        );

        // Risk analysis
        const riskMetrics = {
          diversificationScore: Math.min(100, (assets.length * 10) + (totalBalance > 1000 ? 20 : 0)),
          activityScore: Math.min(100, recent30Days.length * 2),
          concentrationRisk: totalBalance > 100000 ? 'High' : totalBalance > 10000 ? 'Medium' : 'Low',
          assetRisk: assets.length === 0 ? 'High' : assets.length < 3 ? 'Medium' : 'Low'
        };

        // Performance metrics
        const performanceMetrics = {
          totalValueUSD: totalBalance * currentPrice,
          transactionVolume30d: recent30Days.length,
          transactionVolume90d: recent90Days.length,
          avgTransactionSize: transactions.length > 0 ? 
            transactions.reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0) / transactions.length / 1000000 : 0,
          lastActivity: transactions.length > 0 ? transactions[0]['round-time'] * 1000 : 0
        };

        // Diversification analysis
        const totalAssetValue = assetBreakdown.reduce((sum, asset) => sum + asset.balance, 0);
        const algoPercentage = totalAssetValue > 0 ? (totalBalance / (totalBalance + totalAssetValue)) * 100 : 100;

        const portfolioAnalysis = {
          overview: {
            address,
            totalBalance,
            totalValueUSD: performanceMetrics.totalValueUSD,
            assetCount: assets.length + 1, // +1 for ALGO
            lastActivity: performanceMetrics.lastActivity
          },
          assetAllocation: {
            algo: {
              symbol: 'ALGO',
              balance: totalBalance,
              percentage: algoPercentage,
              valueUSD: totalBalance * currentPrice
            },
            assets: assetBreakdown.map(asset => ({
              ...asset,
              percentage: totalAssetValue > 0 ? (asset.balance / totalAssetValue) * (100 - algoPercentage) : 0,
              valueUSD: 0 // Would need price data for ASAs
            }))
          },
          riskAnalysis: riskMetrics,
          performance: performanceMetrics,
          transactionHistory: {
            total: transactions.length,
            recent30Days: recent30Days.length,
            recent90Days: recent90Days.length,
            largestTransaction: transactions.reduce((max: any, tx: any) => 
              (tx.amount || 0) > (max?.amount || 0) ? tx : max, null
            )
          },
          recommendations: generateRecommendations(riskMetrics, performanceMetrics, assets.length, totalBalance)
        };

        setAnalysis(portfolioAnalysis);
        setError(null);
      } catch (err) {
        console.error('Portfolio analysis error:', err);
        setError(err instanceof Error ? err.message : 'Failed to analyze portfolio');
        setAnalysis(null);
      } finally {
        setLoading(false);
      }
    };

    analyzePortfolio();
  }, [address]);

  return { analysis, loading, error };
}

// Helper function to generate recommendations
function generateRecommendations(risk: any, performance: any, assetCount: number, balance: number): string[] {
  const recommendations = [];

  if (risk.diversificationScore < 50) {
    recommendations.push('Consider diversifying your portfolio by holding different types of ASAs');
  }

  if (risk.concentrationRisk === 'High') {
    recommendations.push('Your portfolio has high concentration risk - consider spreading holdings across multiple assets');
  }

  if (performance.transactionVolume30d === 0) {
    recommendations.push('Your wallet has been inactive for 30+ days - consider reviewing your holdings');
  }

  if (assetCount === 0) {
    recommendations.push('You only hold ALGO - explore verified ASAs for portfolio diversification');
  }

  if (balance < 100) {
    recommendations.push('Consider increasing your ALGO holdings for better DeFi participation');
  }

  if (recommendations.length === 0) {
    recommendations.push('Your portfolio shows good diversification and activity levels');
  }

  return recommendations;
}