import { motion } from 'framer-motion';
import { Activity, ArrowRight, ExternalLink, Clock } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { SkeletonLoader } from '../ui/SkeletonLoader';
import { useRecentTransactions } from '../../hooks/useAlgorandData';
import { formatDistance } from 'date-fns';

const TransactionItem = ({ tx, index }: { tx: any; index: number }) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatAmount = (amount?: number) => {
    if (!amount) return '';
    const algo = amount / 1000000;
    if (algo >= 1000000) return `${(algo / 1000000).toFixed(1)}M ◎`;
    if (algo >= 1000) return `${(algo / 1000).toFixed(1)}K ◎`;
    return `${algo.toFixed(2)} ◎`;
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'pay': return 'text-neon-green bg-neon-green/20';
      case 'axfer': return 'text-neon-blue bg-neon-blue/20';
      case 'acfg': return 'text-neon-purple bg-neon-purple/20';
      case 'appl': return 'text-orange-400 bg-orange-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getTransactionTypeLabel = (type?: string) => {
    if (!type) return 'Unknown';
    
    switch (type) {
      case 'pay': return 'Payment';
      case 'axfer': return 'Asset Transfer';
      case 'acfg': return 'Asset Config';
      case 'appl': return 'Application';
      default: return type.toUpperCase();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center justify-between p-4 hover:bg-white/5 rounded-lg transition-colors group"
    >
      <div className="flex items-center space-x-4 flex-1">
        <div className="w-8 h-8 bg-gradient-to-br from-neon-green to-neon-blue rounded-full flex items-center justify-center">
          <Activity className="w-4 h-4 text-white" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className={`text-xs px-2 py-1 rounded-full ${getTransactionTypeColor(tx.txType || 'unknown')}`}>
              {getTransactionTypeLabel(tx.txType)}
            </span>
            {tx.amount && (
              <span className="font-mono text-sm font-bold text-white">
                {formatAmount(tx.amount)}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <a 
              href={tx.senderLink || `https://explorer.perawallet.app/address/${tx.sender}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono hover:text-neon-blue transition-colors"
              title="View sender on Pera Explorer"
            >
              {formatAddress(tx.sender)}
            </a>
            {tx.receiver && (
              <>
                <ArrowRight className="w-3 h-3" />
                <a 
                  href={tx.receiverLink || `https://explorer.perawallet.app/address/${tx.receiver}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono hover:text-neon-green transition-colors"
                  title="View receiver on Pera Explorer"
                >
                  {formatAddress(tx.receiver)}
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="text-xs text-gray-400 flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>
              {tx.roundTime 
                ? formatDistance(new Date(tx.roundTime * 1000), new Date(), { addSuffix: true })
                : 'Pending'
              }
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Fee: {(tx.fee / 1000000).toFixed(6)} ◎
          </div>
        </div>
        
        <a 
          href={tx.explorerLink || `https://explorer.perawallet.app/tx/${tx.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg text-gray-400 hover:text-neon-green transition-colors opacity-0 group-hover:opacity-100" 
          title="View on Pera Explorer"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
};

export function TransactionFeed() {
  const { transactions, loading, error } = useRecentTransactions(30);

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-neon-green/20 rounded-lg">
            <Activity className="w-5 h-5 text-neon-green" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Live Transaction Feed</h2>
            <p className="text-sm text-gray-400">Real-time network activity</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
          <span className="text-sm text-gray-400">Live</span>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar scroll-gradient">
        {loading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="p-4 space-y-2">
              <div className="flex items-center space-x-4">
                <SkeletonLoader width="w-8" height="h-8" className="rounded-full" />
                <div className="flex-1 space-y-2">
                  <SkeletonLoader width="w-32" height="h-4" />
                  <SkeletonLoader width="w-48" height="h-3" />
                </div>
                <SkeletonLoader width="w-16" height="h-4" />
              </div>
            </div>
          ))
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-400">Error loading transactions: {error}</p>
          </div>
        ) : (
          transactions.map((tx, index) => (
            <TransactionItem key={tx.id} tx={tx} index={index} />
          ))
        )}
      </div>
    </GlassCard>
  );
}