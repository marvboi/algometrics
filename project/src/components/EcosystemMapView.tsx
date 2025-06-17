import React, { useState } from 'react';

// Category Icon Components
const WalletIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const DeFiIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const NFTIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const InfraIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
  </svg>
);

const BridgeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

const TokenIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

const PaymentIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const GovernanceIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

// Project Logo Component with official-style SVG logos
const ProjectLogo = ({ type, className = "w-6 h-6" }: { type: string; className?: string }) => {
  const getProjectSVG = (projectType: string): React.ReactNode => {
    switch (projectType.toLowerCase()) {
      case 'pera':
        return (
          <svg className={className} viewBox="0 0 32 32">
            <defs>
              <linearGradient id="peraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFEE55" />
                <stop offset="50%" stopColor="#21EBBA" />
                <stop offset="100%" stopColor="#FE6746" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#peraGradient)" />
            <path d="M10 8h12c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H10c-1.1 0-2-.9-2-2V10c0-1.1.9-2 2-2z" fill="white" opacity="0.9" />
            <path d="M12 12h8v2h-8zm0 4h8v2h-8zm0 4h6v2h-6z" fill="url(#peraGradient)" />
          </svg>
        );
      
      case 'defly':
        return (
          <svg className={className} viewBox="0 0 32 32">
            <defs>
              <linearGradient id="deflyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#deflyGradient)" />
            <path d="M16 6l6 10-6 10-6-10 6-10z" fill="white" />
            <path d="M16 10l3 6-3 6-3-6 3-6z" fill="#8B5CF6" />
          </svg>
        );
      
      case 'lute':
        return (
          <svg className={className} viewBox="0 0 32 32">
            <defs>
              <linearGradient id="luteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#luteGradient)" />
            <path d="M12 6v12c-1 0-2 1-2 2s1 2 2 2 2-1 2-2V10h6V6h-8z" fill="white" />
          </svg>
        );
      
      case 'exodus':
        return (
          <svg className={className} viewBox="0 0 32 32">
            <defs>
              <linearGradient id="exodusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#exodusGradient)" />
            <path d="M16 4L4 10l12 6 12-6-12-6zM4 18l12 6 12-6M4 14l12 6 12-6" fill="white" />
          </svg>
        );
      
      case 'tinyman':
        return (
          <svg className={className} viewBox="0 0 32 32">
            <defs>
              <linearGradient id="tinymanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00D2FF" />
                <stop offset="100%" stopColor="#0066CC" />
              </linearGradient>
            </defs>
            <circle cx="16" cy="16" r="16" fill="url(#tinymanGradient)" />
            <path d="M8 16l8-6v4h8v4h-8v4l-8-6z" fill="white" />
            <circle cx="20" cy="16" r="2" fill="#00D2FF" />
          </svg>
        );
      
      case 'folks-finance':
        return (
          <svg className={className} viewBox="0 0 32 32">
            <defs>
              <linearGradient id="folksGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#4F46E5" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#folksGradient)" />
            <path d="M8 20h4v4H8zm6-4h4v8h-4zm6-6h4v14h-4z" fill="white" />
            <circle cx="10" cy="18" r="1" fill="#6366F1" />
            <circle cx="16" cy="14" r="1" fill="#6366F1" />
            <circle cx="22" cy="8" r="1" fill="#6366F1" />
          </svg>
        );
      
      case 'pact':
        return (
          <svg className={className} viewBox="0 0 32 32">
            <defs>
              <linearGradient id="pactGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#pactGradient)" />
            <path d="M16 6l8 10H8l8-10z" fill="white" />
            <path d="M16 18l-8 8h16l-8-8z" fill="white" opacity="0.8" />
            <circle cx="16" cy="16" r="2" fill="#10B981" />
          </svg>
        );
      
      case 'alammex':
        return (
          <svg className={className} viewBox="0 0 32 32">
            <defs>
              <linearGradient id="alammexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#alammexGradient)" />
            <path d="M16 4l6 12-6 12-6-12 6-12z" fill="white" />
            <path d="M16 8l3 8-3 8-3-8 3-8z" fill="#F59E0B" />
          </svg>
        );
      
      case 'compx':
        return (
          <svg className={className} viewBox="0 0 32 32">
            <defs>
              <linearGradient id="compxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#0891B2" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#compxGradient)" />
            <path d="M4 14h8V4H4v10zm0 14h8v-10H4v10zm12 0h12V18H16v10zm0-24v10h12V4H16z" fill="white" />
          </svg>
        );
      
      case 'algoxnft':
        return (
          <svg className={className} viewBox="0 0 32 32">
            <defs>
              <linearGradient id="algoxnftGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#DB2777" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#algoxnftGradient)" />
            <rect x="6" y="6" width="20" height="20" rx="4" fill="white" />
            <rect x="10" y="10" width="12" height="8" rx="2" fill="#EC4899" />
            <circle cx="13" cy="13" r="1" fill="white" />
            <path d="M10 20h12l-2-2H12l-2 2z" fill="#EC4899" />
          </svg>
        );
      
      case 'exa-market':
        return (
          <svg className={className} viewBox="0 0 32 32">
            <defs>
              <linearGradient id="exaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#exaGradient)" />
            <path d="M8 12h16v12H8V12zm2 2v8h12v-8H10z" fill="white" />
            <path d="M12 16h8v2h-8zm0 3h6v2h-6z" fill="#F97316" />
          </svg>
        );
      
      case 'fracctal-monsters':
        return (
          <svg className={className} viewBox="0 0 32 32">
            <defs>
              <linearGradient id="fracctalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#6D28D9" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#fracctalGradient)" />
            <circle cx="16" cy="16" r="10" fill="white" />
            <circle cx="12" cy="13" r="2" fill="#7C3AED" />
            <circle cx="20" cy="13" r="2" fill="#7C3AED" />
            <path d="M12 20h8c0-2-2-4-4-4s-4 2-4 4z" fill="#7C3AED" />
          </svg>
        );
      
      case 'algoworld':
        return (
          <svg className={className} viewBox="0 0 32 32">
            <defs>
              <linearGradient id="algoworldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
            <circle cx="16" cy="16" r="16" fill="url(#algoworldGradient)" />
            <circle cx="16" cy="16" r="12" fill="white" />
            <path d="M8 16c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="#10B981" />
            <path d="M12 12h8v8h-8z" fill="#10B981" opacity="0.3" />
          </svg>
        );
      
      case 'wen-tools':
        return (
          <svg className={className} viewBox="0 0 32 32">
            <defs>
              <linearGradient id="wenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#wenGradient)" />
            <path d="M24 20l-8-8c1-2 0-4-2-6-2-2-4-2-6-1l4 4-4 4-4-4c-1 2-1 4 1 6 2 2 4 2 6 1l8 8c0 0 1 0 1 0l2-2s0-1 0-2z" fill="white" />
          </svg>
        );
      
      case 'xballot':
        return (
          <svg className={className} viewBox="0 0 32 32">
            <defs>
              <linearGradient id="xballotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#xballotGradient)" />
            <path d="M6 8h20v16H6V8zm2 2v12h16V10H8z" fill="white" />
            <path d="M10 12h12v2H10zm0 4h12v2H10zm0 4h12v2H10z" fill="#3B82F6" />
            <circle cx="12" cy="13" r="1" fill="white" />
            <circle cx="12" cy="17" r="1" fill="white" />
            <circle cx="12" cy="21" r="1" fill="white" />
          </svg>
        );
      
      case 'nfdomains':
        return (
          <svg className={className} viewBox="0 0 32 32">
            <defs>
              <linearGradient id="nfdomainsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#nfdomainsGradient)" />
            <path d="M6 10h20v12H6V10zm2 2v8h16v-8H8z" fill="white" />
            <text x="16" y="18" textAnchor="middle" fontSize="7" fill="#F59E0B" fontWeight="bold">.algo</text>
            <path d="M8 14h16v1H8z" fill="#F59E0B" opacity="0.3" />
          </svg>
        );
      
      case 'goplausible':
        return (
          <svg className={className} viewBox="0 0 32 32">
            <defs>
              <linearGradient id="goplausibleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#goplausibleGradient)" />
            <path d="M16 6l10 10-10 10-10-10 10-10z" fill="white" />
            <path d="M16 10l6 6-6 6-6-6 6-6z" fill="#059669" />
            <path d="M16 14l2 2-2 2-2-2 2-2z" fill="white" />
          </svg>
        );
      
      case 'lofty':
        return (
          <svg className={className} viewBox="0 0 32 32">
            <defs>
              <linearGradient id="loftyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="#B91C1C" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#loftyGradient)" />
            <path d="M6 24h6v2H6zm8-6h6v8h-6zm8-8h6v16h-6z" fill="white" />
            <path d="M8 22h2v2H8zm8-4h2v6h-2zm8-6h2v12h-2z" fill="#DC2626" />
          </svg>
        );
      
      default:
        return (
          <svg className={className} viewBox="0 0 32 32">
            <defs>
              <linearGradient id="defaultGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6B7280" />
                <stop offset="100%" stopColor="#4B5563" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#defaultGradient)" />
            <text x="16" y="20" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">
              {projectType.charAt(0).toUpperCase()}
            </text>
          </svg>
        );
    }
  };

  return <div className="flex-shrink-0">{getProjectSVG(type)}</div>;
};

interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  logo?: React.ReactNode;
  url?: string;
  tags: string[];
}

interface Category {
  id: string;
  name: string;
  color: string;
  icon: React.ReactNode;
  position: { x: number; y: number };
  projects: Project[];
}

const EcosystemMapView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  // Algorand Ecosystem Data organized by categories
  const categories: Category[] = [
    {
      id: 'wallets',
      name: 'Wallets',
      color: 'bg-blue-500',
      icon: <WalletIcon />,
      position: { x: 15, y: 20 },
      projects: [
        {
          id: 'pera',
          name: 'Pera Wallet',
          description: 'Most popular mobile wallet on Algorand with dApp browser',
          category: 'wallets',
          logo: <ProjectLogo type="pera" className="w-8 h-8" />,
          url: 'https://perawallet.app',
          tags: ['mobile', 'dapp-browser', 'nft-support']
        },
        {
          id: 'defly',
          name: 'Defly Wallet',
          description: 'Advanced DeFi wallet with DEX support and multi-sig',
          category: 'wallets',
          logo: <ProjectLogo type="defly" className="w-8 h-8" />,
          url: 'https://defly.app',
          tags: ['defi', 'dex-support', 'multi-sig']
        },
        {
          id: 'lute',
          name: 'Lute',
          description: 'Web wallet for Ledger hardware users',
          category: 'wallets',
          logo: <ProjectLogo type="lute" className="w-8 h-8" />,
          url: 'https://lute.app',
          tags: ['hardware', 'web', 'ledger']
        },
        {
          id: 'exodus',
          name: 'Exodus',
          description: 'Multi-chain wallet with Algorand support',
          category: 'wallets',
          logo: <ProjectLogo type="exodus" className="w-8 h-8" />,
          url: 'https://exodus.com',
          tags: ['multi-chain', 'desktop', 'mobile']
        }
      ]
    },
    {
      id: 'defi',
      name: 'DeFi Protocols',
      color: 'bg-green-500',
      icon: <DeFiIcon />,
      position: { x: 25, y: 35 },
      projects: [
        {
          id: 'tinyman',
          name: 'Tinyman',
          description: 'Leading DEX for swapping and providing liquidity',
          category: 'defi',
          logo: <ProjectLogo type="tinyman" className="w-8 h-8" />,
          url: 'https://tinyman.org',
          tags: ['dex', 'amm', 'liquidity']
        },
        {
          id: 'folks-finance',
          name: 'Folks Finance',
          description: 'Comprehensive DeFi protocol with lending and borrowing',
          category: 'defi',
          logo: <ProjectLogo type="folks-finance" className="w-8 h-8" />,
          url: 'https://folks.finance',
          tags: ['lending', 'borrowing', 'yield']
        },
        {
          id: 'pact',
          name: 'Pact',
          description: 'Decentralized AMM for swapping and liquidity provision',
          category: 'defi',
          logo: <ProjectLogo type="pact" className="w-8 h-8" />,
          url: 'https://pact.fi',
          tags: ['amm', 'dex', 'governance']
        },
        {
          id: 'alammex',
          name: 'Alammex',
          description: 'DEX aggregator with smart order routing',
          category: 'defi',
          logo: <ProjectLogo type="alammex" className="w-8 h-8" />,
          url: 'https://alammex.com',
          tags: ['aggregator', 'routing', 'optimization']
        },
        {
          id: 'compx',
          name: 'CompX',
          description: 'DeFi suite with aggregation and portfolio tracking',
          category: 'defi',
          logo: <ProjectLogo type="compx" className="w-8 h-8" />,
          url: 'https://compx.io',
          tags: ['aggregation', 'portfolio', 'streaming']
        }
      ]
    },
    {
      id: 'nft-gaming',
      name: 'NFTs & Gaming',
      color: 'bg-purple-500',
      icon: <NFTIcon />,
      position: { x: 60, y: 25 },
      projects: [
        {
          id: 'algoxnft',
          name: 'AlgoxNFT',
          description: 'User-friendly NFT marketplace with shuffles',
          category: 'nft-gaming',
          logo: <ProjectLogo type="algoxnft" className="w-8 h-8" />,
          url: 'https://algoxnft.com',
          tags: ['marketplace', 'nft', 'trading']
        },
        {
          id: 'exa-market',
          name: 'EXA Market',
          description: 'Create and collect NFTs on Algorand',
          category: 'nft-gaming',
          logo: <ProjectLogo type="exa-market" className="w-8 h-8" />,
          url: 'https://examarketplace.com',
          tags: ['nft', 'creation', 'marketplace']
        },
        {
          id: 'fracctal-monsters',
          name: 'Fracctal Monsters',
          description: 'P2E monster taming game with NFTs',
          category: 'nft-gaming',
          logo: <ProjectLogo type="fracctal-monsters" className="w-8 h-8" />,
          url: 'https://fracctalmonsters.com',
          tags: ['p2e', 'gaming', 'monsters']
        },
        {
          id: 'algoworld',
          name: 'AlgoWorld',
          description: 'Collectible NFT card game representing world countries',
          category: 'nft-gaming',
          logo: <ProjectLogo type="algoworld" className="w-8 h-8" />,
          url: 'https://algoworld.io',
          tags: ['cards', 'collectibles', 'countries']
        },
        {
          id: 'wen-tools',
          name: 'wen.tools',
          description: 'No-code tools for NFT creation and management',
          category: 'nft-gaming',
          logo: <ProjectLogo type="wen-tools" className="w-8 h-8" />,
          url: 'https://wen.tools',
          tags: ['no-code', 'creation', 'tools']
        }
      ]
    },
    {
      id: 'infrastructure',
      name: 'Infrastructure & Tools',
      color: 'bg-orange-500',
      icon: <InfraIcon />,
      position: { x: 75, y: 45 },
      projects: [
        {
          id: 'allo',
          name: 'Allo',
          description: 'Intuitive blockchain explorer for Algorand',
          category: 'infrastructure',
          logo: <ProjectLogo type="default" className="w-8 h-8" />,
          url: 'https://allo.info',
          tags: ['explorer', 'blockchain', 'search']
        },
        {
          id: 'gora',
          name: 'Gora',
          description: 'Decentralized oracle network for secure data feeds',
          category: 'infrastructure',
          logo: <ProjectLogo type="default" className="w-8 h-8" />,
          url: 'https://gora.io',
          tags: ['oracle', 'data', 'feeds']
        },
        {
          id: 'nodely',
          name: 'Nodely',
          description: 'Distributed node and indexer infrastructure',
          category: 'infrastructure',
          logo: <ProjectLogo type="default" className="w-8 h-8" />,
          url: 'https://nodely.io',
          tags: ['nodes', 'indexer', 'api']
        },
        {
          id: 'vestige',
          name: 'Vestige',
          description: 'All-in-one trading platform for Algorand assets',
          category: 'infrastructure',
          logo: <ProjectLogo type="default" className="w-8 h-8" />,
          url: 'https://vestige.fi',
          tags: ['trading', 'analytics', 'data']
        },
        {
          id: 'dappflow',
          name: 'Dappflow',
          description: 'Block explorer for any Algorand node',
          category: 'infrastructure',
          logo: <ProjectLogo type="default" className="w-8 h-8" />,
          url: 'https://dappflow.org',
          tags: ['explorer', 'development', 'sandbox']
        }
      ]
    },
    {
      id: 'bridges-oracles',
      name: 'Bridges & Oracles',
      color: 'bg-cyan-500',
      icon: <BridgeIcon />,
      position: { x: 45, y: 60 },
      projects: [
        {
          id: 'wormhole',
          name: 'Wormhole',
          description: 'Cross-chain bridge with generic messaging',
          category: 'bridges-oracles',
          logo: <ProjectLogo type="default" className="w-8 h-8" />,
          url: 'https://wormhole.com',
          tags: ['bridge', 'cross-chain', 'messaging']
        },
        {
          id: 'messina',
          name: 'Messina',
          description: 'Bridge for Ethereum-Algorand interactions',
          category: 'bridges-oracles',
          logo: <ProjectLogo type="default" className="w-8 h-8" />,
          url: 'https://messina.one',
          tags: ['bridge', 'ethereum', 'defi']
        },
        {
          id: 'algomint',
          name: 'AlgoMint',
          description: 'Synthetic BTC and ETH on Algorand',
          category: 'bridges-oracles',
          logo: <ProjectLogo type="default" className="w-8 h-8" />,
          url: 'https://algomint.io',
          tags: ['synthetic', 'btc', 'eth']
        },
        {
          id: 'goracle',
          name: 'Goracle',
          description: 'Decentralized oracle abstraction layer',
          category: 'bridges-oracles',
          logo: <ProjectLogo type="default" className="w-8 h-8" />,
          url: 'https://goracle.io',
          tags: ['oracle', 'data', 'abstraction']
        }
      ]
    },
    {
      id: 'tokenization',
      name: 'Tokenization',
      color: 'bg-pink-500',
      icon: <TokenIcon />,
      position: { x: 20, y: 70 },
      projects: [
        {
          id: 'lofty',
          name: 'Lofty',
          description: 'Fractionalized real estate marketplace',
          category: 'tokenization',
          logo: <ProjectLogo type="lofty" className="w-8 h-8" />,
          url: 'https://lofty.ai',
          tags: ['real-estate', 'fractionalized', 'investment']
        },
        {
          id: 'travelx',
          name: 'TravelX',
          description: 'Tokenized travel tickets for flexible booking',
          category: 'tokenization',
          logo: <ProjectLogo type="default" className="w-8 h-8" />,
          url: 'https://travelx.io',
          tags: ['travel', 'tickets', 'nft']
        },
        {
          id: 'climatetrade',
          name: 'ClimateTrade',
          description: 'Blockchain marketplace for carbon credits',
          category: 'tokenization',
          logo: <ProjectLogo type="default" className="w-8 h-8" />,
          url: 'https://climatetrade.com',
          tags: ['carbon', 'credits', 'climate']
        },
        {
          id: 'meld',
          name: 'Meld',
          description: 'Secure gold trading platform',
          category: 'tokenization',
          logo: <ProjectLogo type="default" className="w-8 h-8" />,
          url: 'https://meld.gold',
          tags: ['gold', 'precious-metals', 'trading']
        }
      ]
    },
    {
      id: 'payments',
      name: 'Payments & Stablecoins',
      color: 'bg-yellow-500',
      icon: <PaymentIcon />,
      position: { x: 70, y: 15 },
      projects: [
        {
          id: 'usdca',
          name: 'USDCa',
          description: 'US dollar stablecoin by Circle on Algorand',
          category: 'payments',
          logo: <ProjectLogo type="default" className="w-8 h-8" />,
          url: 'https://centre.io',
          tags: ['stablecoin', 'usd', 'circle']
        },
        {
          id: 'hesabpay',
          name: 'HesabPay',
          description: 'Global mobile payment app with multiple features',
          category: 'payments',
          logo: <ProjectLogo type="default" className="w-8 h-8" />,
          url: 'https://hesabpay.com',
          tags: ['mobile', 'payments', 'global']
        },
        {
          id: 'quantoz-eurd',
          name: 'Quantoz EURD',
          description: 'Regulated Euro electronic money token',
          category: 'payments',
          logo: <ProjectLogo type="default" className="w-8 h-8" />,
          url: 'https://quantoz.com',
          tags: ['euro', 'regulated', 'emoney']
        },
        {
          id: 'complypay',
          name: 'ComplyPay',
          description: 'Compliant wallet infrastructure for platforms',
          category: 'payments',
          logo: <ProjectLogo type="default" className="w-8 h-8" />,
          url: 'https://complypay.com',
          tags: ['compliance', 'infrastructure', 'wallet']
        }
      ]
    },
    {
      id: 'governance',
      name: 'Governance & DAOs',
      color: 'bg-indigo-500',
      icon: <GovernanceIcon />,
      position: { x: 50, y: 80 },
      projects: [
        {
          id: 'xballot',
          name: 'XBallot',
          description: 'DAO management with governance and community forum',
          category: 'governance',
          logo: <ProjectLogo type="xballot" className="w-8 h-8" />,
          url: 'https://xballot.net',
          tags: ['dao', 'governance', 'voting']
        },
        {
          id: 'nfdomains',
          name: 'NFDomains',
          description: 'Algorand name service with .algo domains',
          category: 'governance',
          logo: <ProjectLogo type="nfdomains" className="w-8 h-8" />,
          url: 'https://nf.domains',
          tags: ['domains', 'naming', 'identity']
        },
        {
          id: 'goplausible',
          name: 'GoPlausible',
          description: 'Proof of Anything Protocol with DIDs',
          category: 'governance',
          logo: <ProjectLogo type="goplausible" className="w-8 h-8" />,
          url: 'https://goplausible.com',
          tags: ['proof', 'did', 'credentials']
        }
      ]
    }
  ];

  const filteredCategories = categories.map(category => ({
    ...category,
    projects: category.projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })).filter(category => category.projects.length > 0);

  const totalProjects = categories.reduce((sum, category) => sum + category.projects.length, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
          🗺️ Algorand Ecosystem Map
        </h1>
        <p className="text-gray-400 text-lg mb-6">
          Explore {totalProjects}+ projects building the future on Algorand
        </p>
        
        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects, categories, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent"
            />
            <svg className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Ecosystem Map */}
      <div className="relative bg-gradient-to-br from-space-800 to-space-900 rounded-2xl p-8 min-h-[600px] overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-10 grid-rows-10 h-full w-full">
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="border border-white/10"></div>
            ))}
          </div>
        </div>

        {/* Category Islands */}
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{
              left: `${category.position.x}%`,
              top: `${category.position.y}%`,
            }}
            onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
          >
            {/* Category Circle */}
            <div className={`
              relative w-24 h-24 ${category.color} rounded-full flex items-center justify-center
              shadow-lg group-hover:scale-110 transition-all duration-300
              ${selectedCategory === category.id ? 'ring-4 ring-white/50 scale-110' : ''}
            `}>
              <div className="text-white">{category.icon}</div>
              
              {/* Project Count Badge */}
              <div className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {category.projects.length}
              </div>
            </div>

            {/* Category Label */}
            <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <span className="text-sm font-semibold text-white bg-black/50 px-2 py-1 rounded">
                {category.name}
              </span>
            </div>

            {/* Connection Lines to Projects */}
            {selectedCategory === category.id && (
              <div className="absolute inset-0">
                {category.projects.map((project, index) => {
                  const angle = (index * 360) / category.projects.length;
                  const radius = 120;
                  const x = Math.cos((angle * Math.PI) / 180) * radius;
                  const y = Math.sin((angle * Math.PI) / 180) * radius;
                  
                  return (
                    <div key={project.id}>
                      {/* Connection Line */}
                      <div
                        className="absolute w-0.5 bg-gradient-to-r from-white/50 to-white/20 origin-bottom"
                        style={{
                          height: `${radius}px`,
                          left: '50%',
                          top: '50%',
                          transform: `rotate(${angle}deg)`,
                          transformOrigin: '0 0'
                        }}
                      />
                      
                      {/* Project Node */}
                      <div
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group/project"
                        style={{
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                        }}
                        onMouseEnter={() => setHoveredProject(project.id)}
                        onMouseLeave={() => setHoveredProject(null)}
                      >
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer border-2 border-white/30 hover:border-white/50">
                          <ProjectLogo type={project.id} className="w-6 h-6" />
                        </div>
                        
                        {/* Project Tooltip */}
                        {hoveredProject === project.id && (
                          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-10">
                            <div className="bg-black/90 text-white p-3 rounded-lg shadow-xl min-w-[200px] max-w-[300px]">
                              <h4 className="font-semibold text-sm mb-1">{project.name}</h4>
                              <p className="text-xs text-gray-300 mb-2">{project.description}</p>
                              <div className="flex flex-wrap gap-1">
                                {project.tags.slice(0, 3).map(tag => (
                                  <span key={tag} className="text-xs bg-white/20 px-2 py-0.5 rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              {project.url && (
                                <a
                                  href={project.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-neon-blue hover:text-neon-green mt-2 inline-block"
                                >
                                  Visit Project →
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-black/50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-2">Legend</h3>
          <div className="space-y-1 text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Click category to explore projects</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-white/30 rounded-full"></div>
              <span>Hover project for details</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="absolute bottom-4 right-4 bg-black/50 rounded-lg p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-neon-green">{totalProjects}</div>
            <div className="text-xs text-gray-300">Total Projects</div>
          </div>
        </div>
      </div>

      {/* Selected Category Details */}
      {selectedCategory && (
        <div className="glass-card p-6">
          {(() => {
            const category = categories.find(c => c.id === selectedCategory);
            if (!category) return null;
            
            return (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center`}>
                    <div className="text-white">{category.icon}</div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                    <p className="text-gray-400">{category.projects.length} projects in this category</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.projects.map((project) => (
                    <div key={project.id} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors group">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 flex items-center justify-center">
                          <ProjectLogo type={project.id} className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white group-hover:text-neon-blue transition-colors">
                            {project.name}
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">{project.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.tags.map(tag => (
                          <span key={tag} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-neon-blue hover:text-neon-green transition-colors inline-flex items-center gap-1"
                        >
                          Visit Project
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">How to Navigate the Ecosystem Map</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Click on category circles</strong> to explore projects in that area</li>
                <li><strong>Hover over project nodes</strong> to see detailed information</li>
                <li><strong>Use the search bar</strong> to find specific projects or technologies</li>
                <li><strong>Visit project links</strong> to learn more and start using these tools</li>
              </ul>
              <p className="mt-3">
                This ecosystem map represents the vibrant Algorand community with projects spanning 
                DeFi, NFTs, infrastructure, and more. Each category represents a different "continent" 
                in the Algorand world, with projects as cities within those regions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcosystemMapView; 