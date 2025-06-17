import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, Bell, Settings, Activity, X, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNetworkStatus } from '../hooks/useAlgorandData';
import { GlassCard } from './ui/GlassCard';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { SettingsModal } from './SettingsModal';

export function Header() {
  const { toggleSidebar, toggleCommandPalette, alerts, removeAlert } = useStore();
  const { status, loading } = useNetworkStatus();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const getNetworkStatusColor = () => {
    if (!status) return 'text-gray-400';
    if (status.hasSyncedSinceStartup && status.timeSinceLastRound < 10000000000) {
      return 'text-neon-green';
    }
    return 'text-yellow-400';
  };

  const getNetworkStatusText = () => {
    if (loading) return 'Connecting...';
    if (!status) return 'Disconnected';
    if (status.hasSyncedSinceStartup) return 'Online';
    return 'Syncing...';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'high': return <AlertCircle className="w-4 h-4 text-orange-400" />;
      case 'medium': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      default: return <CheckCircle className="w-4 h-4 text-blue-400" />;
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <motion.header
      className="sticky top-0 z-50 glass-card border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-neon-green to-neon-blue rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-space-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold neon-text">AlgoMetrics</h1>
              <p className="text-xs text-gray-400">Algorand Analytics Command Center</p>
            </div>
          </div>
        </div>

        {/* Center Section - Network Status */}
        <GlassCard className="px-4 py-2" hover={false}>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <div className={`w-2 h-2 rounded-full ${getNetworkStatusColor()} animate-pulse`} />
              )}
              <span className="text-sm font-medium">
                Algorand Network: <span className={getNetworkStatusColor()}>{getNetworkStatusText()}</span>
              </span>
            </div>
            {status && status.lastRound !== undefined && (
              <div className="text-xs text-gray-400">
                Round: {status.lastRound?.toLocaleString() || 'N/A'}
              </div>
            )}
          </div>
        </GlassCard>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleCommandPalette}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors group"
            title="Search & Command Palette (⌘K)"
          >
            <Search className="w-5 h-5 group-hover:text-neon-blue transition-colors" />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-white/10 transition-colors group"
              title="Notifications"
            >
            <Bell className="w-5 h-5 group-hover:text-neon-green transition-colors" />
            {alerts.length > 0 && (
              <motion.div
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                {alerts.length > 9 ? '9+' : alerts.length}
              </motion.div>
            )}
          </button>
          
            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowNotifications(false)}
                  />
                  
                  {/* Centered Modal */}
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl z-50"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <div className="p-4 border-b border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">Notifications</h3>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {alerts.length === 0 ? (
                        <div className="p-6 text-center text-gray-400">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No notifications yet</p>
                          <p className="text-sm">Whale movements and alerts will appear here</p>
                        </div>
                      ) : (
                        alerts.slice(0, 10).map((alert) => (
                          <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-4 border-b border-gray-700/50 hover:bg-white/5 transition-colors"
                          >
                            <div className="flex items-start space-x-3">
                              {getSeverityIcon(alert.severity)}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-medium text-white truncate">
                                    {alert.title}
                                  </h4>
                                  <button
                                    onClick={() => removeAlert(alert.id)}
                                    className="p-1 rounded hover:bg-white/10 transition-colors"
                                  >
                                    <X className="w-3 h-3 text-gray-400" />
                                  </button>
                                </div>
                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                  {alert.message}
                                </p>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Clock className="w-3 h-3 text-gray-500" />
                                  <span className="text-xs text-gray-500">
                                    {formatTimeAgo(alert.timestamp)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                    
                    {alerts.length > 10 && (
                      <div className="p-3 border-t border-gray-700 text-center">
                        <span className="text-xs text-gray-400">
                          Showing 10 of {alerts.length} notifications
                        </span>
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors group" 
            title="Settings"
          >
            <Settings className="w-5 h-5 group-hover:text-neon-purple transition-colors" />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </motion.header>
  );
}