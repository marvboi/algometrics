import React from 'react';
import { useBridgeMonitor } from '../hooks/useBridgeMonitor';

const BridgeMonitorView: React.FC = () => {
  const { 
    transactions, 
    stats, 
    health, 
    loading, 
    error, 
    refetch, 
    getStatusColor, 
    getHealthStatus,
    getChainName 
  } = useBridgeMonitor();

  const healthStatus = getHealthStatus();

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            🌉 Bridge Monitor
          </h2>
          <p className="text-gray-400">Loading bridge data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-4 bg-white/10 rounded mb-2"></div>
              <div className="h-8 bg-white/10 rounded mb-2"></div>
              <div className="h-3 bg-white/10 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            🌉 Bridge Monitor
          </h2>
          <p className="text-gray-400">Real-time monitoring of Algorand cross-chain transactions</p>
        </div>
        <div className="glass-card p-6 border border-red-400/30">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-400">Error Loading Bridge Data</h3>
              <p className="text-sm text-gray-400 mt-1">{error}</p>
              <button 
                onClick={refetch}
                className="mt-2 text-sm text-neon-blue hover:text-neon-green transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
          🌉 Bridge Monitor
        </h2>
        <p className="text-gray-400">Real-time monitoring of Algorand cross-chain transactions</p>
        <button
          onClick={refetch}
          className="mt-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white px-6 py-2 rounded-lg hover:opacity-80 transition-opacity flex items-center space-x-2 mx-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      {/* Health Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bridge Health */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bridge Health</p>
              <p className={`text-2xl font-bold ${healthStatus.color}`}>
                {healthStatus.status}
              </p>
              <p className="text-sm text-gray-500 mt-1">{healthStatus.description}</p>
            </div>
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                healthStatus.status === 'Excellent' ? 'bg-green-100' :
                healthStatus.status === 'Good' ? 'bg-blue-100' :
                healthStatus.status === 'Fair' ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <svg className={`w-6 h-6 ${healthStatus.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          {health && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Success Rate:</span>
                <span className="font-medium">{health.successRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Guardians Online:</span>
                <span className="font-medium">{health.guardiansOnline}/19</span>
              </div>
            </div>
          )}
        </div>

        {/* Transaction Stats */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">24h Transactions</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats?.transactions24h || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {stats?.transactions7d || 0} this week
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
              </div>
            </div>
          </div>
          {stats && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Volume:</span>
                <span className="font-medium">{stats.volume24h.toFixed(2)} ALGO</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg Time:</span>
                <span className="font-medium">{(stats.avgTransactionTime / 60).toFixed(1)}m</span>
              </div>
            </div>
          )}
        </div>

        {/* Network Status */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Network Status</p>
              <p className={`text-2xl font-bold ${getStatusColor(stats?.bridgeStatus || 'unknown')}`}>
                {stats?.bridgeStatus?.charAt(0).toUpperCase() + stats?.bridgeStatus?.slice(1) || 'Unknown'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Last update: {stats?.lastUpdate ? new Date(stats.lastUpdate).toLocaleTimeString() : 'N/A'}
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                stats?.bridgeStatus === 'operational' ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                <svg className={`w-6 h-6 ${getStatusColor(stats?.bridgeStatus || 'unknown')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
          {health && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Network Latency:</span>
                <span className="font-medium">{health.networkLatency.toFixed(1)}s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Health Score:</span>
                <span className="font-medium">{health.healthScore}/100</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Recent Bridge Transactions</h2>
          <p className="text-sm text-gray-400">Latest cross-chain transfers involving Algorand</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4a1 1 0 00-1-1H9a1 1 0 00-1 1v1" />
                      </svg>
                      <p className="text-lg font-medium text-white">No transactions found at the moment</p>
                      <p className="text-sm">Transactions coming into Algorand will appear here when available</p>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-white">
                            {tx.txHash ? `${tx.txHash.slice(0, 8)}...${tx.txHash.slice(-6)}` : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-400">Seq: {tx.sequence}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-white">{tx.sourceChain || 'Unknown'}</span>
                        <svg className="w-4 h-4 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <span className="text-sm font-medium text-neon-green">Algorand</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                        tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {tx.txHash && !tx.isDemo && (
                        <a
                          href={`https://wormholescan.io/#/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neon-blue hover:text-neon-green transition-colors"
                        >
                          View Details
                        </a>
                      )}
                      {tx.isDemo && (
                        <span className="text-gray-500">Demo Data</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bridge Information */}
      <div className="glass-card p-6 border border-neon-blue/30">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-neon-blue" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-neon-blue">About Wormhole Bridge</h3>
            <div className="mt-2 text-sm text-gray-300">
              <p>
                Wormhole is a secure cross-chain bridge that enables the transfer of tokens and data between 
                Algorand and other blockchain networks. The bridge is secured by a network of 19 Guardian validators 
                who collectively validate cross-chain transactions through cryptographic signatures.
              </p>
              <div className="mt-3 space-y-1">
                <p><strong className="text-white">Security:</strong> Multi-signature validation with 13/19 Guardian consensus</p>
                <p><strong className="text-white">Supported Chains:</strong> 30+ blockchain networks including Ethereum, Solana, Polygon</p>
                <p><strong className="text-white">Algorand Chain ID:</strong> 8 (in Wormhole network)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BridgeMonitorView; 