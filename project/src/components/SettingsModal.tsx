import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Mail, Bell, Shield, Palette, Save, Trash2, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { emailService, EmailSubscription } from '../services/emailService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { alertThresholds, updateAlertThresholds, theme, setTheme } = useStore();
  const [activeTab, setActiveTab] = useState('notifications');
  const [emailNotifications, setEmailNotifications] = useState({
    enabled: false,
    email: '',
    whaleThreshold: 1000000, // 1M ALGO
    frequency: 'instant' as 'instant' | 'hourly' | 'daily'
  });

  const [tempThresholds, setTempThresholds] = useState(alertThresholds);

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'email', label: 'Email Alerts', icon: Mail },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  // Load existing subscription on mount
  useEffect(() => {
    const stored = localStorage.getItem('emailNotifications');
    if (stored) {
      const data = JSON.parse(stored);
      setEmailNotifications(data);
      
      // Check if subscription exists in email service
      const subscription = emailService.getSubscription(data.email);
      if (subscription) {
        setEmailNotifications(prev => ({ ...prev, enabled: subscription.enabled }));
      }
    }
  }, []);

  const handleSaveSettings = () => {
    updateAlertThresholds(tempThresholds);
    localStorage.setItem('emailNotifications', JSON.stringify(emailNotifications));
    onClose();
  };

  const handleEmailSubscribe = async () => {
    if (!emailNotifications.email) {
      alert('Please enter a valid email address');
      return;
    }
    
    try {
      const notificationPermission = await emailService.requestNotificationPermission();
      if (!notificationPermission) {
        const allowNotifications = confirm('Would you like to enable browser notifications for whale alerts?');
        if (allowNotifications) {
          await emailService.requestNotificationPermission();
        }
      }
      
      // Call with correct parameters: email, threshold, frequency
      const success = await emailService.subscribe(
        emailNotifications.email,
        emailNotifications.whaleThreshold,
        emailNotifications.frequency
      );
      
      if (success) {
        setEmailNotifications(prev => ({ ...prev, enabled: true }));
        alert('✅ Successfully subscribed to whale alerts! Check your email for confirmation.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert(`❌ Failed to subscribe: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEmailUnsubscribe = async () => {
    const success = await emailService.unsubscribe(emailNotifications.email);
    
    if (success) {
      setEmailNotifications(prev => ({ ...prev, enabled: false }));
      alert('Successfully unsubscribed from whale alerts.');
    } else {
      alert('Failed to unsubscribe. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-gray-900/90 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl z-50"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.9) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20 bg-gradient-to-r from-white/5 to-white/10">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-neon-blue/20 rounded-lg backdrop-blur-sm border border-neon-blue/30">
                  <Settings className="w-5 h-5 text-neon-blue" />
                </div>
                <h2 className="text-lg font-semibold text-white">Settings</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/10"
              >
                <X className="w-4 h-4 text-gray-300 hover:text-white" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-white/20 bg-gradient-to-r from-black/20 to-black/10">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 px-3 py-3 text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'text-neon-green bg-gradient-to-b from-neon-green/20 to-neon-green/10 border-b-2 border-neon-green shadow-lg backdrop-blur-sm'
                        : 'text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="p-4 max-h-96 overflow-y-auto custom-scrollbar bg-gradient-to-b from-black/10 to-black/20">
              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-medium text-white mb-3">Alert Thresholds</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">
                          Whale Movement Threshold (ALGO)
                        </label>
                        <input
                          type="number"
                          value={tempThresholds.whaleMovement}
                          onChange={(e) => setTempThresholds(prev => ({
                            ...prev,
                            whaleMovement: Number(e.target.value)
                          }))}
                          className="w-full px-3 py-2 bg-black/40 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:border-neon-blue focus:outline-none focus:ring-2 focus:ring-neon-blue/20 placeholder-gray-300 transition-all duration-200"
                          placeholder="1000000"
                        />
                        <p className="text-xs text-gray-300 mt-1">
                          Minimum ALGO amount to trigger whale movement alerts
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">
                          Network Congestion Threshold (TPS)
                        </label>
                        <input
                          type="number"
                          value={tempThresholds.networkCongestion}
                          onChange={(e) => setTempThresholds(prev => ({
                            ...prev,
                            networkCongestion: Number(e.target.value)
                          }))}
                          className="w-full px-3 py-2 bg-black/40 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:border-neon-blue focus:outline-none focus:ring-2 focus:ring-neon-blue/20 placeholder-gray-300 transition-all duration-200"
                          placeholder="80"
                        />
                        <p className="text-xs text-gray-300 mt-1">
                          TPS threshold to trigger network congestion alerts
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">
                          Unusual Activity Threshold (Transactions)
                        </label>
                        <input
                          type="number"
                          value={tempThresholds.unusualActivity}
                          onChange={(e) => setTempThresholds(prev => ({
                            ...prev,
                            unusualActivity: Number(e.target.value)
                          }))}
                          className="w-full px-3 py-2 bg-black/40 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:border-neon-blue focus:outline-none focus:ring-2 focus:ring-neon-blue/20 placeholder-gray-300 transition-all duration-200"
                          placeholder="500"
                        />
                        <p className="text-xs text-gray-300 mt-1">
                          Transaction count threshold for unusual activity alerts
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'email' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-medium text-white mb-3">🐋 Whale Email Alerts</h4>
                    <p className="text-gray-300 text-sm mb-4">
                      Get notified via email when large whale transactions occur on the Algorand network.
                    </p>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={emailNotifications.email}
                          onChange={(e) => setEmailNotifications(prev => ({
                            ...prev,
                            email: e.target.value
                          }))}
                          className="w-full px-3 py-2 bg-black/40 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:border-neon-blue focus:outline-none focus:ring-2 focus:ring-neon-blue/20 placeholder-gray-300 transition-all duration-200"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">
                          Whale Transaction Threshold (ALGO)
                        </label>
                        <input
                          type="number"
                          value={emailNotifications.whaleThreshold}
                          onChange={(e) => setEmailNotifications(prev => ({
                            ...prev,
                            whaleThreshold: Number(e.target.value)
                          }))}
                          className="w-full px-3 py-2 bg-black/40 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:border-neon-blue focus:outline-none focus:ring-2 focus:ring-neon-blue/20 placeholder-gray-300 transition-all duration-200"
                          placeholder="1000000"
                        />
                        <p className="text-xs text-gray-300 mt-1">
                          Minimum ALGO amount to trigger email notifications (1M ALGO ≈ $250K USD)
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">
                          Notification Frequency
                        </label>
                        <select
                          value={emailNotifications.frequency}
                          onChange={(e) => setEmailNotifications(prev => ({
                            ...prev,
                            frequency: e.target.value as 'instant' | 'hourly' | 'daily'
                          }))}
                          className="w-full px-3 py-2 bg-black/40 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:border-neon-blue focus:outline-none focus:ring-2 focus:ring-neon-blue/20 transition-all duration-200"
                        >
                          <option value="instant">Instant (Real-time)</option>
                          <option value="hourly">Hourly Digest</option>
                          <option value="daily">Daily Digest</option>
                        </select>
                      </div>

                      <div className="flex space-x-3 pt-3">
                        {!emailNotifications.enabled ? (
                          <button
                            onClick={handleEmailSubscribe}
                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-neon-green to-neon-green/80 hover:from-neon-green/90 hover:to-neon-green/70 text-black font-medium rounded-lg transition-all duration-200 shadow-lg backdrop-blur-sm border border-neon-green/30"
                          >
                            <Mail className="w-4 h-4" />
                            <span>Subscribe</span>
                          </button>
                        ) : (
                          <div className="flex space-x-3">
                            <div className="flex items-center space-x-2 px-3 py-2 bg-green-500/30 text-green-300 rounded-lg backdrop-blur-sm border border-green-500/40">
                              <Check className="w-4 h-4" />
                              <span>Subscribed</span>
                            </div>
                            <button
                              onClick={handleEmailUnsubscribe}
                              className="flex items-center space-x-2 px-3 py-2 bg-red-500/30 text-red-300 hover:bg-red-500/40 rounded-lg transition-all duration-200 backdrop-blur-sm border border-red-500/40"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Unsubscribe</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Email Format Preview */}
                      <div className="mt-4 p-3 bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg">
                        <h5 className="font-medium text-white mb-2 text-sm">📧 Email Format Preview</h5>
                        <div className="text-xs text-gray-200 space-y-1">
                          <p><strong>Subject:</strong> 🐋 Whale Alert: 2,500,000 ALGO moved ($625,000)</p>
                          <p><strong>Content:</strong> Professional HTML email with transaction details, amounts, and explorer links</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-medium text-white mb-3">🎨 Theme Selection</h4>
                    <p className="text-gray-300 text-sm mb-4">
                      Choose your preferred theme. Changes apply instantly to the entire dashboard.
                    </p>
                    
                    <div className="space-y-2">
                      {/* Dark Theme */}
                      <button
                        onClick={() => setTheme('dark')}
                        className={`w-full p-3 rounded-lg border transition-all hover:scale-[1.01] backdrop-blur-sm ${
                          theme === 'dark' 
                            ? 'border-neon-green bg-gradient-to-r from-neon-green/20 to-neon-green/10 shadow-lg' 
                            : 'border-white/30 hover:border-white/50 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-6 bg-gradient-to-r from-gray-900 to-black rounded border border-gray-600 shadow-inner"></div>
                          <div className="text-left flex-1">
                            <div className="font-medium text-white text-sm">Dark Theme</div>
                            <div className="text-xs text-gray-300">Default professional dark theme</div>
                          </div>
                          {theme === 'dark' && <Check className="w-4 h-4 text-neon-green" />}
                        </div>
                      </button>

                      {/* Cyber Theme */}
                      <button
                        onClick={() => setTheme('cyber')}
                        className={`w-full p-3 rounded-lg border transition-all hover:scale-[1.01] backdrop-blur-sm ${
                          theme === 'cyber' 
                            ? 'border-cyan-400 bg-gradient-to-r from-cyan-400/20 to-cyan-400/10 shadow-lg' 
                            : 'border-white/30 hover:border-white/50 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-6 bg-gradient-to-r from-blue-900 via-purple-900 to-cyan-900 rounded border border-cyan-500/50 shadow-inner"></div>
                          <div className="text-left flex-1">
                            <div className="font-medium text-white text-sm">Cyber Theme</div>
                            <div className="text-xs text-gray-300">Futuristic neon interface</div>
                          </div>
                          {theme === 'cyber' && <Check className="w-4 h-4 text-cyan-400" />}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-medium text-white mb-3">🔒 Security & Privacy</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg">
                        <h5 className="font-medium text-white mb-1 text-sm">🔐 API Security</h5>
                        <p className="text-gray-200 text-xs">
                          All API calls are made through secure HTTPS connections. No private keys stored.
                        </p>
                      </div>
                      <div className="p-3 bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg">
                        <h5 className="font-medium text-white mb-1 text-sm">🛡️ Data Privacy</h5>
                        <p className="text-gray-200 text-xs">
                          Only public blockchain data is accessed. Email addresses stored locally only.
                        </p>
                      </div>
                      <div className="p-3 bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg">
                        <h5 className="font-medium text-white mb-1 text-sm">🌐 Network Safety</h5>
                        <p className="text-gray-200 text-xs">
                          All data fetched from official Algorand APIs and verified services.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/20 bg-gradient-to-r from-black/20 to-black/10 backdrop-blur-sm">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-all duration-200 rounded-lg hover:bg-white/10 backdrop-blur-sm border border-white/10 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-blue/80 hover:from-neon-blue/90 hover:to-neon-blue/70 text-white font-medium rounded-lg transition-all duration-200 shadow-lg backdrop-blur-sm border border-neon-blue/30 text-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 