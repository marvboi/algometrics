import { motion } from 'framer-motion';
import { Wallet, TrendingUp, ExternalLink, Eye, Star } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { SkeletonLoader } from '../ui/SkeletonLoader';
import { useWhaleWallets } from '../../hooks/useAlgorandData';
import { useStore } from '../../store/useStore';

// Better time formatting function
const formatTimeAgo = (timestamp: number) => {
  const now = Date.now();
  const diffInMs = now - timestamp;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
  const diffInMonths = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30));

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  } else {
    return `${diffInMonths}mo ago`;
  }
};

const WhaleCard = ({ whale, index }: { whale: any; index: number }) => {
  const { addToWatchlist, removeFromWatchlist, watchlist } = useStore();
  const isWatched = watchlist.includes(whale.address);

  const handleToggleWatch = () => {
    if (isWatched) {
      removeFromWatchlist(whale.address);
    } else {
      addToWatchlist(whale.address);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: number) => {
    if (balance >= 1000000) {
      return `${(balance / 1000000).toFixed(1)}M`;
    }
    if (balance >= 1000) {
      return `${(balance / 1000).toFixed(1)}K`;
    }
    return balance.toFixed(0);
  };

  const getLabelColor = (label?: string) => {
    switch (label) {
      case 'Major Exchange': return 'text-red-400 bg-red-400/20';
      case 'Exchange/Institution': return 'text-orange-400 bg-orange-400/20';
      case 'Large Holder': return 'text-blue-400 bg-blue-400/20';
      default: return 'text-neon-green bg-neon-green/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center justify-between p-4 hover:bg-white/5 rounded-lg transition-colors group"
    >
      <div className="flex items-center space-x-4 flex-1">
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-400 w-6">#{whale.rank}</span>
          <div className="w-8 h-8 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
            <Wallet className="w-4 h-4 text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <a 
              href={whale.explorerLink || `https://explorer.perawallet.app/address/${whale.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-white hover:text-neon-blue transition-colors"
              title="View on Pera Explorer"
            >
              {formatAddress(whale.address)}
            </a>
            {whale.label && (
              <span className={`text-xs px-2 py-1 rounded-full ${getLabelColor(whale.label)}`}>
                {whale.label}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <span>Activity: {formatTimeAgo(whale.lastActivity)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="flex items-center space-x-2 font-mono text-lg font-bold text-neon-green">
            <img 
              src="https://assets.coingecko.com/coins/images/4380/small/download.png" 
              alt="ALGO" 
              className="w-6 h-6 rounded-full"
              onError={(e) => {
                // Fallback to official Algorand logo if CoinGecko fails
                const target = e.target as HTMLImageElement;
                target.src = "https://cryptologos.cc/logos/algorand-algo-logo.png";
              }}
            />
            <span>{formatBalance(whale.balance)}</span>
          </div>
          <div className="text-xs text-gray-400">
            {whale.percentOfSupply.toFixed(3)}% supply
          </div>
        </div>
        
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleToggleWatch}
            className={`p-2 rounded-lg transition-colors ${
              isWatched 
                ? 'text-yellow-400 hover:text-yellow-300' 
                : 'text-gray-400 hover:text-yellow-400'
            }`}
            title={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            {isWatched ? <Star className="w-4 h-4 fill-current" /> : <Star className="w-4 h-4" />}
          </button>
          
          <button className="p-2 rounded-lg text-gray-400 hover:text-neon-blue transition-colors" title="View details">
            <Eye className="w-4 h-4" />
          </button>
          
          <a 
            href={whale.explorerLink || `https://explorer.perawallet.app/address/${whale.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-gray-400 hover:text-neon-green transition-colors" 
            title="View on Pera Explorer"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export function WhaleTracker() {
  const { whales, loading, error } = useWhaleWallets();

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-neon-blue/20 rounded-lg">
            <Wallet className="w-5 h-5 text-neon-blue" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Whale Tracker</h2>
            <p className="text-sm text-gray-400">Top ALGO holders and their activity</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <TrendingUp className="w-4 h-4" />
          <span>Live updates</span>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar scroll-gradient">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-4 space-y-2">
              <div className="flex items-center space-x-4">
                <SkeletonLoader width="w-6" height="h-4" />
                <SkeletonLoader width="w-8" height="h-8" className="rounded-full" />
                <SkeletonLoader width="w-32" height="h-4" />
                <div className="flex-1" />
                <SkeletonLoader width="w-20" height="h-6" />
              </div>
            </div>
          ))
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-400">Error loading whale data: {error}</p>
          </div>
        ) : (
          whales.slice(0, 100).map((whale, index) => (
            <WhaleCard key={whale.address} whale={whale} index={index} />
          ))
        )}
      </div>
    </GlassCard>
  );
}