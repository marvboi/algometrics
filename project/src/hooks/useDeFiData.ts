import { useState, useEffect } from 'react';
import { algorandAPI } from '../services/algorand';

export interface DeFiMetrics {
  totalValueLocked: number;
  volume24h: number;
  activePools: number;
  protocols: Array<{
    id: string;
    name: string;
    tvl: number;
    category: string;
    change24h?: number;
    symbol?: string;
    logo?: string;
    url?: string;
  }>;
  topAssets: Array<{
    id: number;
    name: string;
    symbol: string;
    price: number;
    volume24h: number;
    tvl: number;
  }>;
  recentSwaps: Array<{
    id: string;
    assetIn: string;
    assetOut: string;
    amountIn: number;
    amountOut: number;
    timestamp: number;
    txId: string;
    explorerLink?: string;
  }>;
  yieldPools?: Array<{
    pool: string;
    project: string;
    apy: number;
    tvl: number;
    category: string;
  }>;
}

export function useDeFiMetrics() {
  const [metrics, setMetrics] = useState<DeFiMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeFiData = async () => {
      try {
        console.log('Fetching DeFi data from multiple sources...');
        
        // Fetch from both DeFiLlama and Vestige APIs in parallel
        const [
          defiLlamaProtocolsResult,
          defiLlamaChainResult,
          defiLlamaYieldsResult,
          assetsResult,
          poolsResult,
          swapsResult
        ] = await Promise.allSettled([
          algorandAPI.getDeFiLlamaProtocols(),
          algorandAPI.getDeFiLlamaChainTVL('algorand'),
          algorandAPI.getDeFiLlamaYields(),
          algorandAPI.getVestigeAssets(),
          algorandAPI.getVestigePools(),
          algorandAPI.getVestigeSwaps(50)
        ]);

        console.log('API Results:', { 
          defiLlamaProtocolsResult, 
          defiLlamaChainResult,
          defiLlamaYieldsResult,
          assetsResult, 
          poolsResult, 
          swapsResult 
        });

        // Extract DeFiLlama data
        const protocols = defiLlamaProtocolsResult.status === 'fulfilled' ? defiLlamaProtocolsResult.value : [];
        const chainData = defiLlamaChainResult.status === 'fulfilled' ? defiLlamaChainResult.value : null;
        const yields = defiLlamaYieldsResult.status === 'fulfilled' ? defiLlamaYieldsResult.value : [];

        // Extract Vestige data
        const assetsData = assetsResult.status === 'fulfilled' ? assetsResult.value : { assets: [] };
        const poolsData = poolsResult.status === 'fulfilled' ? poolsResult.value : { pools: [] };
        const swapsData = swapsResult.status === 'fulfilled' ? swapsResult.value : { swaps: [] };

        // Handle different possible response structures
        const assets = assetsData?.assets || assetsData?.data || assetsData || [];
        const pools = poolsData?.pools || poolsData?.data || poolsData || [];
        const swaps = swapsData?.swaps || swapsData?.data || swapsData || [];

        console.log('Processed Data:', { protocols, chainData, yields, assets, pools, swaps });

        // Calculate TVL - combine DeFiLlama chain TVL with Vestige pools
        const defiLlamaTVL = chainData?.tvl || 0;
        const vestigeTVL = Array.isArray(pools) ? pools.reduce((sum: number, pool: any) => {
          const poolTvl = pool.tvl || pool.total_liquidity || pool.totalLiquidity || pool.value_locked || 0;
          return sum + (typeof poolTvl === 'number' ? poolTvl : 0);
        }, 0) : 0;
        
        // Use the higher TVL value or combine them intelligently
        const totalValueLocked = Math.max(defiLlamaTVL, vestigeTVL);

        // Process DeFiLlama protocols
        const protocolList = Array.isArray(protocols) ? protocols.map((protocol: any) => ({
          id: protocol.slug || protocol.name?.toLowerCase().replace(/\s+/g, '-') || `protocol-${Math.random()}`,
          name: protocol.name || 'Unknown Protocol',
          tvl: protocol.tvl || 0,
          category: protocol.category || 'DeFi',
          change24h: protocol.change_1d || protocol.change24h,
          symbol: protocol.symbol,
          logo: protocol.logo,
          url: protocol.url
        })).sort((a, b) => b.tvl - a.tvl) : [];

        // Calculate 24h volume from swaps
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        const recent24hSwaps = Array.isArray(swaps) ? swaps.filter((swap: any) => {
          const swapTime = (swap.timestamp || swap.created_at || swap.time || 0) * 1000;
          return swapTime > oneDayAgo;
        }) : [];

        const volume24h = recent24hSwaps.reduce((sum: number, swap: any) => {
          const swapVolume = swap.amount_in_usd || swap.volume_usd || swap.usd_amount || swap.value || 0;
          return sum + (typeof swapVolume === 'number' ? swapVolume : 0);
        }, 0);

        // Process top assets
        const topAssets = Array.isArray(assets) ? assets.slice(0, 10).map((asset: any) => ({
          id: asset.asset_id || asset.id || asset.assetId || Math.random(),
          name: asset.name || asset.asset_name || asset.assetName || 'Unknown Asset',
          symbol: asset.unit_name || asset.symbol || asset.ticker || asset.unitName || 'N/A',
          price: asset.price || asset.current_price || asset.usd_price || 0,
          volume24h: asset.volume_24h || asset.volume24h || asset.daily_volume || 0,
          tvl: asset.tvl || asset.total_value_locked || 0
        })) : [];

        // Process recent swaps
        const recentSwaps = Array.isArray(swaps) ? swaps.slice(0, 20).map((swap: any) => ({
          id: swap.id || swap.tx_id || swap.transaction_id || Math.random().toString(),
          assetIn: swap.asset_in_symbol || swap.from_asset || swap.assetIn || 'ALGO',
          assetOut: swap.asset_out_symbol || swap.to_asset || swap.assetOut || 'USDC',
          amountIn: swap.amount_in || swap.from_amount || swap.amountIn || 0,
          amountOut: swap.amount_out || swap.to_amount || swap.amountOut || 0,
          timestamp: (swap.timestamp || swap.created_at || swap.time || Date.now() / 1000) * 1000,
          txId: swap.tx_id || swap.transaction_id || swap.txId || '',
          explorerLink: swap.tx_id ? `https://explorer.perawallet.app/tx/${swap.tx_id}` : undefined
        })) : [];

        // Process DeFiLlama yield pools
        const yieldPools = Array.isArray(yields) ? yields.slice(0, 10).map((yieldPool: any) => ({
          pool: yieldPool.pool || 'Unknown Pool',
          project: yieldPool.project || 'Unknown Project',
          apy: yieldPool.apy || yieldPool.apyBase || 0,
          tvl: yieldPool.tvlUsd || yieldPool.tvl || 0,
          category: yieldPool.category || 'Yield Farming'
        })) : [];

        const defiMetrics: DeFiMetrics = {
          totalValueLocked: Math.round(totalValueLocked * 100) / 100,
          volume24h: Math.round(volume24h * 100) / 100,
          activePools: Array.isArray(pools) ? pools.length : 0,
          protocols: protocolList,
          topAssets,
          recentSwaps,
          yieldPools
        };

        console.log('Final DeFi Metrics:', defiMetrics);
        setMetrics(defiMetrics);
        setError(null);

        // Log any failed API calls for debugging
        const failedCalls = [
          { name: 'DeFiLlama Protocols', result: defiLlamaProtocolsResult },
          { name: 'DeFiLlama Chain', result: defiLlamaChainResult },
          { name: 'DeFiLlama Yields', result: defiLlamaYieldsResult },
          { name: 'Vestige Assets', result: assetsResult },
          { name: 'Vestige Pools', result: poolsResult },
          { name: 'Vestige Swaps', result: swapsResult }
        ].filter(call => call.result.status === 'rejected');

        failedCalls.forEach(call => {
          console.warn(`${call.name} API failed:`, call.result.reason);
        });

      } catch (err) {
        console.error('DeFi data fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch DeFi data');
        
        // Set fallback data
        setMetrics({
          totalValueLocked: 0,
          volume24h: 0,
          activePools: 0,
          protocols: [],
          topAssets: [],
          recentSwaps: [],
          yieldPools: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDeFiData();
    // Longer interval for DeFiLlama to avoid rate limiting (10 minutes default)
    const interval = setInterval(fetchDeFiData, Number(import.meta.env.VITE_DEFI_REFRESH_INTERVAL) || 600000);
    return () => clearInterval(interval);
  }, []);

  return { metrics, loading, error };
}

export function useAssetPrice(assetId: number) {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = async (id: number) => {
    if (!id) return;
    
    setLoading(true);
    try {
      const data = await algorandAPI.getVestigeAssetPrice(id);
      setPrice(data.price || data.current_price || data.usd_price || 0);
      setError(null);
    } catch (err) {
      console.error('Asset price fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch asset price');
      setPrice(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assetId) {
      fetchPrice(assetId);
    }
  }, [assetId]);

  return { price, loading, error, fetchPrice };
} 