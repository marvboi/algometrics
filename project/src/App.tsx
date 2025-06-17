import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CommandPalette } from './components/CommandPalette';
import { MetricsGrid } from './components/dashboard/MetricsGrid';
import { WhaleTracker } from './components/dashboard/WhaleTracker';
import { TransactionFeed } from './components/dashboard/TransactionFeed';
import { NetworkChart } from './components/dashboard/NetworkChart';
import BridgeMonitorView from './components/BridgeMonitorView';
import EcosystemMapView from './components/EcosystemMapView';
import NFTAnalyticsView from './components/NFTAnalyticsView';
// Temporarily commented out due to module resolution issue
// // Temporarily commented out due to module resolution issue
// import DeFiAnalyticsView from './components/DeFiAnalyticsView';
import { useSmartAlerts, usePortfolioAnalysis } from './hooks/useAlgorandData';
import { useStore } from './store/useStore';

// Temporary DeFi Analytics placeholder component
function DeFiAnalyticsView() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
          📊 DeFi Analytics
        </h2>
        <p className="text-gray-400">Comprehensive DeFi protocol analysis for Algorand</p>
      </div>
      <div className="glass-card p-8 text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h3 className="text-xl font-semibold mb-2">DeFi Analytics Loading...</h3>
        <p className="text-gray-400">Advanced DeFi metrics and protocol analysis coming online...</p>
      </div>
          </div>
  );
}

// Simple view components for different sections
function DashboardView() {
  return (
    <>
          {/* Metrics Grid */}
          <MetricsGrid />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Transaction Feed - Left Column */}
            <div className="xl:col-span-1">
              <TransactionFeed />
            </div>

            {/* Network Chart - Middle Column */}
            <div className="xl:col-span-1">
              <NetworkChart />
            </div>

            {/* Whale Tracker - Right Column */}
            <div className="xl:col-span-1">
              <WhaleTracker />
            </div>
          </div>

          {/* Additional Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* DeFi Analytics */}
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-neon-purple/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-neon-purple text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">DeFi Analytics</h3>
          <p className="text-gray-400 text-sm">Powered by Vestige API</p>
            </div>

        {/* Social Trading */}
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-neon-blue/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span className="text-neon-blue text-2xl">👥</span>
              </div>
          <h3 className="text-lg font-semibold mb-2">Social Trading</h3>
          <p className="text-gray-400 text-sm">Whale Tracking Active</p>
            </div>

        {/* Real-time Data */}
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-neon-green/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span className="text-neon-green text-2xl">⚡</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Real-time Data</h3>
          <p className="text-gray-400 text-sm">Nodely API Connected</p>
        </div>
      </div>
    </>
  );
}

function WhaleTrackerView() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
          🐋 Whale Tracker
        </h2>
        <p className="text-gray-400">Monitor large ALGO holders and their activities</p>
      </div>
      <div className="max-w-6xl mx-auto">
        <WhaleTracker />
      </div>
    </div>
  );
}

// DeFi Analytics component is now imported from separate file

function SmartAlertsView() {
  const { alerts, loading, error } = useSmartAlerts();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-400/20 border-red-400/30';
      case 'high': return 'text-orange-400 bg-orange-400/20 border-orange-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'low': return 'text-neon-blue bg-neon-blue/20 border-neon-blue/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '📢';
      case 'low': return 'ℹ️';
      default: return '🔔';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
          🔔 Smart Alerts
        </h2>
        <p className="text-gray-400">Real-time whale transaction monitoring with $1M+ threshold</p>
        {error && (
          <p className="text-red-400 text-sm mt-2">⚠️ {error}</p>
        )}
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 text-center">
          <div className="text-2xl font-bold text-neon-green">{alerts.length}</div>
          <div className="text-sm text-gray-400">Total Alerts</div>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="text-2xl font-bold text-red-400">
            {alerts.filter(a => a.severity === 'critical').length}
          </div>
          <div className="text-sm text-gray-400">Critical</div>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="text-2xl font-bold text-orange-400">
            {alerts.filter(a => a.severity === 'high').length}
          </div>
          <div className="text-sm text-gray-400">High Priority</div>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="text-2xl font-bold text-neon-blue">
            {alerts.filter(a => a.type === 'whale_movement').length}
          </div>
          <div className="text-sm text-gray-400">Whale Alerts</div>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Alerts</h3>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-white/5 rounded-lg p-4">
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-white text-lg font-medium mb-2">No $1M+ Transactions Detected</p>
            <p className="text-gray-400">Monitoring for whale transactions worth $1M+ USD...</p>
            <p className="text-gray-500 text-sm mt-2">Real alerts will appear here when criteria is met</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getSeverityIcon(alert.severity)}</span>
                    <h4 className="font-semibold">{alert.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                <p className="text-sm mb-3">{alert.message}</p>
                
                {alert.data && (
                  <div className="bg-black/20 rounded-lg p-3 text-xs space-y-2">
                    {alert.type === 'whale_movement' && (
                      <>
                        {alert.data.txId && (
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Transaction:</span>
                              <span className="text-neon-blue font-mono">
                                {alert.data.txId.slice(0, 8)}...{alert.data.txId.slice(-4)}
                              </span>
                            </div>
                            <div className="flex space-x-2 text-xs">
                              <a 
                                href={alert.data.explorerLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-neon-blue hover:text-neon-green underline"
                              >
                                Allo.info
                              </a>
                              <span className="text-gray-500">•</span>
                              <a 
                                href={alert.data.algoExplorerLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-neon-blue hover:text-neon-green underline"
                              >
                                AlgoExplorer
                              </a>
                              <span className="text-gray-500">•</span>
                              <a 
                                href={alert.data.peraLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-neon-blue hover:text-neon-green underline"
                              >
                                Pera
                              </a>
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type:</span>
                          <span className="text-neon-purple font-semibold">
                            {alert.data.txType || 'Payment'}
                          </span>
                        </div>
                        {alert.data.sender && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">From:</span>
                            <a 
                              href={alert.data.senderLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-neon-blue hover:text-neon-green font-mono"
                            >
                              {alert.data.sender.slice(0, 8)}...{alert.data.sender.slice(-4)}
                            </a>
                          </div>
                        )}
                        {alert.data.receiver && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">To:</span>
                            <a 
                              href={alert.data.receiverLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-neon-blue hover:text-neon-green font-mono"
                            >
                              {alert.data.receiver.slice(0, 8)}...{alert.data.receiver.slice(-4)}
                            </a>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-400">Amount:</span>
                          <span className="text-neon-green font-bold">
                            {alert.data.amountInAlgo?.toLocaleString()} ALGO
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">USD Value:</span>
                          <span className="text-neon-green font-bold">
                            ~${alert.data.amountInUSD?.toLocaleString()}
                          </span>
                        </div>
                        {alert.data.isDemo && (
                          <div className="text-center pt-1">
                            <span className="text-xs text-yellow-400 bg-yellow-400/20 px-2 py-1 rounded">
                              Demo Data
                            </span>
                          </div>
                        )}
                      </>
                    )}
                    {alert.type === 'network_congestion' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Current TPS:</span>
                          <span className="text-neon-green">{alert.data.tps}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Round:</span>
                          <span className="text-neon-blue">{alert.data.currentRound}</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PortfolioXRayView() {
  const [address, setAddress] = useState('');
  const [analyzedAddress, setAnalyzedAddress] = useState('');
  const { analysis, loading, error } = usePortfolioAnalysis(analyzedAddress);

  const handleAnalyze = () => {
    if (address.trim()) {
      setAnalyzedAddress(address.trim());
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-neon-green';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
          🔍 Portfolio X-Ray
        </h2>
        <p className="text-gray-400">Deep analysis of Algorand wallet portfolios</p>
      </div>

      {/* Address Input */}
      <div className="glass-card p-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter Algorand wallet address to analyze..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="flex-1 bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-neon-blue focus:outline-none"
          />
          <button
            onClick={handleAnalyze}
            disabled={!address.trim() || loading}
            className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>

      {error && (
        <div className="glass-card p-6 text-center">
          <p className="text-red-400">⚠️ {error}</p>
        </div>
      )}

      {loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-8 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis && (
        <div className="space-y-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-card p-6 text-center">
              <div className="text-2xl font-bold text-neon-green">
                {analysis.overview.totalBalance.toLocaleString()} ALGO
              </div>
              <div className="text-sm text-gray-400">Total Balance</div>
              <div className="text-xs text-neon-blue">
                ~${analysis.overview.totalValueUSD.toLocaleString()}
              </div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-2xl font-bold text-neon-blue">
                {analysis.overview.assetCount}
              </div>
              <div className="text-sm text-gray-400">Total Assets</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-2xl font-bold text-neon-purple">
                {analysis.riskAnalysis.diversificationScore}
              </div>
              <div className="text-sm text-gray-400">Diversification Score</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-2xl font-bold text-orange-400">
                {analysis.performance.transactionVolume30d}
              </div>
              <div className="text-sm text-gray-400">Transactions (30d)</div>
            </div>
          </div>

          {/* Asset Allocation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4">Asset Allocation</h3>
              <div className="space-y-4">
                {/* ALGO */}
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="100" cy="100" r="100" fill="white"/>
                        <path d="M100 40L140 80H120V120H80V80H60L100 40Z" fill="black"/>
                        <path d="M60 120L100 160L140 120H120V80H80V120H60Z" fill="black"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold">ALGO</div>
                      <div className="text-sm text-gray-400">
                        {analysis.assetAllocation.algo.balance.toLocaleString()} ALGO
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-neon-green">
                      {analysis.assetAllocation.algo.percentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-400">
                      ${analysis.assetAllocation.algo.valueUSD.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Other Assets */}
                {analysis.assetAllocation.assets.map((asset: any) => (
                  <div key={asset.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold">{asset.unitName.slice(0, 2)}</span>
                      </div>
                      <div>
                        <div className="font-semibold">{asset.name}</div>
                        <div className="text-sm text-gray-400">
                          {asset.balance.toLocaleString()} {asset.unitName}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-neon-blue">
                        {asset.percentage.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-400">ASA #{asset.id}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Analysis */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4">Risk Analysis</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Diversification Score</span>
                  <span className="font-semibold">{analysis.riskAnalysis.diversificationScore}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Activity Score</span>
                  <span className="font-semibold">{analysis.riskAnalysis.activityScore}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Concentration Risk</span>
                  <span className={`font-semibold ${getRiskColor(analysis.riskAnalysis.concentrationRisk)}`}>
                    {analysis.riskAnalysis.concentrationRisk}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Asset Risk</span>
                  <span className={`font-semibold ${getRiskColor(analysis.riskAnalysis.assetRisk)}`}>
                    {analysis.riskAnalysis.assetRisk}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History & Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4">Transaction Activity</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Transactions</span>
                  <span className="font-semibold">{analysis.transactionHistory.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Last 30 Days</span>
                  <span className="font-semibold text-neon-green">{analysis.transactionHistory.recent30Days}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Last 90 Days</span>
                  <span className="font-semibold text-neon-blue">{analysis.transactionHistory.recent90Days}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Avg Transaction Size</span>
                  <span className="font-semibold">{analysis.performance.avgTransactionSize.toFixed(2)} ALGO</span>
                </div>
                {analysis.overview.lastActivity > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Last Activity</span>
                    <span className="font-semibold text-orange-400">
                      {new Date(analysis.overview.lastActivity).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
              <div className="space-y-3">
                {analysis.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                    <span className="text-neon-blue mt-1">💡</span>
                    <p className="text-sm text-gray-300">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Wallet Address Info */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold mb-4">Wallet Information</h3>
            <div className="bg-black/20 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Address:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{analyzedAddress}</span>
                  <a
                    href={`https://explorer.perawallet.app/address/${analyzedAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neon-blue hover:text-neon-green transition-colors"
                    title="View on Pera Explorer"
                  >
                    🔗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const { sidebarCollapsed, currentView, theme, setTheme } = useStore();

  // Initialize theme on app startup
  useEffect(() => {
    const savedTheme = localStorage.getItem('algometrics-theme') as 'dark' | 'light' | 'cyber';
    if (savedTheme && savedTheme !== 'light') {
      setTheme(savedTheme as 'dark' | 'cyber');
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Set default theme to cyber
      document.documentElement.setAttribute('data-theme', 'cyber');
      setTheme('cyber');
    }
  }, [setTheme]);

  // Apply theme changes to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('algometrics-theme', theme);
  }, [theme]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'whales':
        return <WhaleTrackerView />;
      case 'defi':
        return <DeFiAnalyticsView />;
      case 'alerts':
        return <SmartAlertsView />;
      case 'ecosystem':
        return <EcosystemMapView />;
      case 'portfolio':
        return <PortfolioXRayView />;

      case 'bridge':
        return <BridgeMonitorView />;
      case 'nft':
        return <NFTAnalyticsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-space-900 text-white">
      <Header />
      <Sidebar />
      <CommandPalette />
      
      <main 
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        } pt-6 px-6 pb-12`}
      >
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Hero Section - Only show on dashboard */}
          {currentView === 'dashboard' && (
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
                Algorand Analytics Command Center
              </h1>
              <p className="text-gray-400 text-lg">
                Real-time blockchain intelligence for the Algorand ecosystem
              </p>
              {/* Environment Status */}
              <div className="mt-4 flex justify-center space-x-4 text-sm">
                <span className={import.meta.env.VITE_ALGORAND_API_TOKEN ? 'text-neon-green' : 'text-red-400'}>
                  API
                </span>
                <span className={import.meta.env.VITE_TINYMAN_ENABLED ? 'text-neon-green' : 'text-gray-400'}>
                  Tinyman
                </span>
                <span className="text-neon-blue">
                  Vestige
                </span>
              </div>
            </div>
          )}

          {/* Render Current View */}
          {renderCurrentView()}
        </div>
      </main>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(26, 26, 27, 0.9)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
          },
          success: {
            iconTheme: {
              primary: '#00ff88',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: 'white',
            },
          },
        }}
      />
    </div>
  );
}

export default App;