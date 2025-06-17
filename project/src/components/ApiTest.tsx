import React, { useState, useEffect } from 'react';
import { algorandAPI } from '../services/algorand';

export function ApiTest() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log('Testing API connection...');
        const response = await algorandAPI.getNetworkStatus();
        console.log('API Response:', response);
        setStatus(response);
        setError(null);
      } catch (err) {
        console.error('API Test Error:', err);
        setError(err instanceof Error ? err.message : 'API test failed');
      } finally {
        setLoading(false);
      }
    };

    testApi();
    const interval = setInterval(testApi, 10000); // Test every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">🔧 API Connection Test</h3>
        <p className="text-yellow-400">Testing API connection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">🔧 API Connection Test</h3>
        <p className="text-red-400">❌ Error: {error}</p>
        <div className="mt-4 text-sm text-gray-400">
          <p>API Token: {import.meta.env.VITE_ALGORAND_API_TOKEN ? '✅ Present' : '❌ Missing'}</p>
          <p>Node API: {import.meta.env.VITE_ALGORAND_NODE_API}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4">🔧 API Connection Test</h3>
      <div className="space-y-2 text-sm">
        <p className="text-neon-green">✅ API Connected Successfully!</p>
        <p>Current Round: <span className="text-neon-blue">{status?.lastRound?.toLocaleString()}</span></p>
        <p>Time Since Last Round: <span className="text-neon-purple">{Math.round((status?.timeSinceLastRound || 0) / 1000000000)}s</span></p>
        <p>Network Status: <span className="text-neon-green">{status?.hasSyncedSinceStartup ? 'Online' : 'Syncing'}</span></p>
        <p>Next Version Supported: <span className="text-neon-blue">{status?.nextVersionSupported ? 'Yes' : 'No'}</span></p>
      </div>
      <div className="mt-4 text-xs text-gray-400">
        <p>Last updated: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
} 