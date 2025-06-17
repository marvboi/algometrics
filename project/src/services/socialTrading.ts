import { AlgorandService } from './algorand';

interface WhaleWallet {
  address: string;
  balance: number;
  nickname?: string;
  isTracked: boolean;
  recentTransactions: any[];
  performance: {
    totalValue: number;
    change24h: number;
    winRate: number;
  };
}

interface TradingSignal {
  walletAddress: string;
  action: 'buy' | 'sell' | 'swap';
  assetId: number;
  amount: number;
  timestamp: number;
  confidence: number;
}

export class SocialTradingService {
  private algorandService: AlgorandService;
  private whaleWallets: Map<string, WhaleWallet> = new Map();
  
  // Known whale wallets (you can expand this list)
  private knownWhales = [
    'ALGORAND_FOUNDATION_ADDRESS',
    'MAJOR_EXCHANGE_ADDRESSES',
    // Add more known whale addresses
  ];

  constructor() {
    this.algorandService = new AlgorandService();
  }

  // Track whale wallets by monitoring large transactions
  async discoverWhaleWallets(minBalance: number = 1000000): Promise<WhaleWallet[]> {
    try {
      // Get recent large transactions
      const recentTransactions = await this.algorandService.getRecentTransactions(100);
      
      const potentialWhales = new Set<string>();
      
      // Find addresses with large transactions
      recentTransactions.forEach((tx: any) => {
        if (tx.amount && tx.amount > minBalance) {
          potentialWhales.add(tx.sender);
          if (tx.receiver) potentialWhales.add(tx.receiver);
        }
      });

      // Verify whale status by checking current balance
      const whales: WhaleWallet[] = [];
      for (const address of potentialWhales) {
        try {
          const accountInfo = await this.algorandService.getAccountInfo(address);
          if (accountInfo.amount >= minBalance) {
            const whale: WhaleWallet = {
              address,
              balance: accountInfo.amount,
              isTracked: false,
              recentTransactions: [],
              performance: {
                totalValue: accountInfo.amount,
                change24h: 0,
                winRate: 0
              }
            };
            whales.push(whale);
            this.whaleWallets.set(address, whale);
          }
        } catch (error) {
          console.warn(`Failed to check whale status for ${address}:`, error);
        }
      }

      return whales;
    } catch (error) {
      console.error('Error discovering whale wallets:', error);
      return [];
    }
  }

  // Generate trading signals based on whale activity
  async generateTradingSignals(): Promise<TradingSignal[]> {
    const signals: TradingSignal[] = [];
    
    for (const [address, whale] of this.whaleWallets) {
      if (!whale.isTracked) continue;
      
      try {
        // Get recent transactions for this whale
        const recentTxs = await this.algorandService.getAccountTransactions(address, 10);
        
        recentTxs.forEach((tx: any) => {
          // Analyze transaction patterns
          if (this.isSignificantTransaction(tx)) {
            const signal: TradingSignal = {
              walletAddress: address,
              action: this.determineAction(tx),
              assetId: tx.assetId || 0,
              amount: tx.amount,
              timestamp: tx.timestamp,
              confidence: this.calculateConfidence(whale, tx)
            };
            signals.push(signal);
          }
        });
      } catch (error) {
        console.warn(`Failed to analyze whale ${address}:`, error);
      }
    }

    return signals.sort((a, b) => b.confidence - a.confidence);
  }

  // Track a specific whale wallet
  async trackWhale(address: string): Promise<boolean> {
    try {
      const accountInfo = await this.algorandService.getAccountInfo(address);
      const whale: WhaleWallet = {
        address,
        balance: accountInfo.amount,
        isTracked: true,
        recentTransactions: [],
        performance: {
          totalValue: accountInfo.amount,
          change24h: 0,
          winRate: 0
        }
      };
      
      this.whaleWallets.set(address, whale);
      return true;
    } catch (error) {
      console.error('Error tracking whale:', error);
      return false;
    }
  }

  // Get copy trading recommendations
  async getCopyTradingRecommendations(): Promise<any[]> {
    const signals = await this.generateTradingSignals();
    
    return signals
      .filter(signal => signal.confidence > 0.7) // High confidence only
      .map(signal => ({
        ...signal,
        recommendation: this.generateRecommendation(signal),
        riskLevel: this.assessRisk(signal)
      }));
  }

  private isSignificantTransaction(tx: any): boolean {
    // Define what makes a transaction significant
    const minAmount = 100000; // 100k microALGOs
    return tx.amount > minAmount || (tx.assetTransfer && tx.assetTransfer.amount > 1000);
  }

  private determineAction(tx: any): 'buy' | 'sell' | 'swap' {
    // Simple logic - can be enhanced
    if (tx.type === 'axfer') return 'swap';
    if (tx.amount > 0) return 'buy';
    return 'sell';
  }

  private calculateConfidence(whale: WhaleWallet, tx: any): number {
    // Calculate confidence based on whale's track record and transaction size
    let confidence = 0.5; // Base confidence
    
    // Higher confidence for larger whales
    if (whale.balance > 10000000) confidence += 0.2;
    
    // Higher confidence for larger transactions
    if (tx.amount > whale.balance * 0.1) confidence += 0.2;
    
    // Factor in historical performance
    confidence += whale.performance.winRate * 0.3;
    
    return Math.min(confidence, 1.0);
  }

  private generateRecommendation(signal: TradingSignal): string {
    return `Whale ${signal.walletAddress.slice(0, 8)}... performed ${signal.action} of ${signal.amount} units. Confidence: ${(signal.confidence * 100).toFixed(1)}%`;
  }

  private assessRisk(signal: TradingSignal): 'low' | 'medium' | 'high' {
    if (signal.confidence > 0.8) return 'low';
    if (signal.confidence > 0.6) return 'medium';
    return 'high';
  }

  // Get tracked whales
  getTrackedWhales(): WhaleWallet[] {
    return Array.from(this.whaleWallets.values()).filter(whale => whale.isTracked);
  }

  // Stop tracking a whale
  stopTracking(address: string): boolean {
    const whale = this.whaleWallets.get(address);
    if (whale) {
      whale.isTracked = false;
      return true;
    }
    return false;
  }
} 