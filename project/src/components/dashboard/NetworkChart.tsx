import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';
import { useStore } from '../../store/useStore';

// Mock data for demonstration
const generateMockData = (timeframe: string) => {
  const hours = timeframe === '1H' ? 1 : timeframe === '24H' ? 24 : timeframe === '7D' ? 168 : 720;
  const interval = timeframe === '1H' ? 1 : timeframe === '24H' ? 1 : timeframe === '7D' ? 6 : 24;
  
  const data = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i -= interval) {
    const time = new Date(now.getTime() - i * 3600000);
    data.push({
      time: time.toISOString(),
      tps: Math.random() * 50 + 20,
      blockTime: Math.random() * 2 + 4,
      transactions: Math.floor(Math.random() * 1000) + 500,
      health: Math.random() * 20 + 80,
    });
  }
  
  return data;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border border-white/20">
        <p className="text-sm text-gray-400 mb-2">
          {new Date(label).toLocaleString()}
        </p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toFixed(2)}
            {entry.name === 'TPS' && ' tx/s'}
            {entry.name === 'Block Time' && 's'}
            {entry.name === 'Health Score' && '/100'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function NetworkChart() {
  const { activeTimeframe, setActiveTimeframe } = useStore();
  const [chartType, setChartType] = React.useState<'line' | 'area'>('area');
  
  const data = React.useMemo(() => generateMockData(activeTimeframe), [activeTimeframe]);
  
  const timeframes = ['1H', '24H', '7D', '30D'] as const;

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-neon-purple/20 rounded-lg">
            <BarChart3 className="w-5 h-5 text-neon-purple" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Network Activity</h2>
            <p className="text-sm text-gray-400">Historical performance metrics</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 p-1 bg-space-800 rounded-lg">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setActiveTimeframe(timeframe)}
                className={`px-3 py-1 text-sm rounded-md transition-all ${
                  activeTimeframe === timeframe
                    ? 'bg-neon-green text-space-900 font-medium'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setChartType(chartType === 'line' ? 'area' : 'line')}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="Toggle chart type"
          >
            <TrendingUp className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="h-80 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="tpsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="tps" 
                stroke="#00ff88" 
                strokeWidth={2}
                fill="url(#tpsGradient)"
                name="TPS"
              />
              <Area 
                type="monotone" 
                dataKey="health" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                fill="url(#healthGradient)"
                name="Health Score"
              />
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="tps" 
                stroke="#00ff88" 
                strokeWidth={2}
                dot={false}
                name="TPS"
              />
              <Line 
                type="monotone" 
                dataKey="blockTime" 
                stroke="#00d4ff" 
                strokeWidth={2}
                dot={false}
                name="Block Time"
              />
              <Line 
                type="monotone" 
                dataKey="health" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={false}
                name="Health Score"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-neon-green rounded-full" />
            <span>TPS</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-neon-blue rounded-full" />
            <span>Block Time</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-neon-purple rounded-full" />
            <span>Health Score</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </GlassCard>
  );
}