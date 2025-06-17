import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Clock, Shield, DollarSign, Users, Zap } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { CounterAnimation } from '../ui/CounterAnimation';
import { SkeletonLoader } from '../ui/SkeletonLoader';
import { useNetworkMetrics } from '../../hooks/useAlgorandData';

const MetricCard = ({ 
  title, 
  value, 
  suffix = '', 
  prefix = '',
  change, 
  icon: Icon, 
  color = 'green',
  loading = false,
  decimals = 0 
}: {
  title: string;
  value: number | undefined;
  suffix?: string;
  prefix?: string;
  change?: number;
  icon: React.ElementType;
  color?: 'green' | 'blue' | 'purple' | 'orange';
  loading?: boolean;
  decimals?: number;
}) => {
  const colorClasses = {
    green: 'text-neon-green',
    blue: 'text-neon-blue', 
    purple: 'text-neon-purple',
    orange: 'text-orange-400'
  };

  const bgClasses = {
    green: 'bg-neon-green/20',
    blue: 'bg-neon-blue/20',
    purple: 'bg-neon-purple/20', 
    orange: 'bg-orange-400/20'
  };

  const displayValue = value ?? 0;

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${bgClasses[color]}`}>
          <Icon className={`w-5 h-5 ${colorClasses[color]}`} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center text-sm ${change >= 0 ? 'text-neon-green' : 'text-red-400'}`}>
            {change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm text-gray-400">{title}</h3>
        <div className="text-2xl font-bold font-mono">
          {loading ? (
            <SkeletonLoader width="w-20" height="h-8" />
          ) : (
            <CounterAnimation 
              value={displayValue} 
              prefix={prefix} 
              suffix={suffix}
              decimals={decimals}
              className={colorClasses[color]}
            />
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export function MetricsGrid() {
  const { metrics, previousMetrics, loading, error } = useNetworkMetrics();
  
  // Calculate real percentage changes
  const calculateChange = (current: number | undefined, previous: number | undefined) => {
    if (!current || !previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <GlassCard className="col-span-full p-6 text-center">
          <p className="text-red-400">Error loading network metrics: {error}</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
    >
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <MetricCard
          title="Network TPS"
          value={metrics?.tps}
          suffix=" tx/s"
          change={previousMetrics ? calculateChange(metrics?.tps, previousMetrics.tps) : undefined}
          icon={Zap}
          color="green"
          loading={loading}
          decimals={2}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <MetricCard
          title="Block Time"
          value={metrics?.blockTime}
          suffix="s"
          change={previousMetrics ? calculateChange(metrics?.blockTime, previousMetrics.blockTime) : undefined}
          icon={Clock}
          color="blue"
          loading={loading}
          decimals={1}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
        <MetricCard
          title="Current Round"
          value={metrics?.currentRound}
          icon={Activity}
          color="purple"
          loading={loading}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
        <MetricCard
          title="Health Score"
          value={metrics?.healthScore}
          suffix="/100"
          change={previousMetrics ? calculateChange(metrics?.healthScore, previousMetrics.healthScore) : undefined}
          icon={Shield}
          color="orange"
          loading={loading}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
        <MetricCard
          title="Avg Fee"
          value={metrics?.avgFee}
          prefix="◎"
          change={previousMetrics ? calculateChange(metrics?.avgFee, previousMetrics.avgFee) : undefined}
          icon={DollarSign}
          color="green"
          loading={loading}
          decimals={6}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
        <MetricCard
          title="Active Accounts"
          value={metrics?.activeAccounts}
          change={previousMetrics ? calculateChange(metrics?.activeAccounts, previousMetrics.activeAccounts) : undefined}
          icon={Users}
          color="blue"
          loading={loading}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
        <MetricCard
          title="Total Validators"
          value={metrics?.totalValidators}
          change={previousMetrics ? calculateChange(metrics?.totalValidators, previousMetrics.totalValidators) : undefined}
          icon={Shield}
          color="purple"
          loading={loading}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
        <MetricCard
          title="ALGO Price"
          value={metrics?.algoPrice}
          prefix="$"
          change={previousMetrics ? calculateChange(metrics?.algoPrice, previousMetrics.algoPrice) : undefined}
          icon={DollarSign}
          color="orange"
          loading={loading}
          decimals={4}
        />
      </motion.div>
    </motion.div>
  );
}