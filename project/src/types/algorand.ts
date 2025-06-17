export interface NetworkStatus {
  lastRound: number;
  lastVersion: string;
  nextVersion: string;
  nextVersionRound: number;
  nextVersionSupported: boolean;
  timeSinceLastRound: number;
  catchupTime: number;
  hasSyncedSinceStartup: boolean;
  stoppedAtUnsupportedRound: boolean;
  lastCatchpoint: string;
  upgradeVotesRequired: number;
  upgradeNoVotes: number;
  upgradeYesVotes: number;
  nextProtocolVoteBefore: number;
  nextProtocolApprovals: number;
  // Optional fields that might be present
  lastRoundTimestamp?: number;
  nextConsensusVersion?: string;
  nextConsensusVersionRound?: number;
  nextConsensusVersionSupported?: boolean;
  catchpointTotalAccounts?: number;
  catchpointProcessedAccounts?: number;
  catchpointTotalBlocks?: number;
  catchpointAcquiredBlocks?: number;
  catchpointVerifiedBlocks?: number;
  upgradeVoteTotalStake?: number;
  upgradeVoteThreshold?: number;
  upgradeDelay?: number;
  upgradeVotes?: number;
  upgradeNodeDelay?: number;
}

export interface Transaction {
  id: string;
  sender: string;
  txType: string;
  amount?: number;
  fee: number;
  firstValid: number;
  lastValid: number;
  genesisId: string;
  genesisHash: string;
  note?: string;
  receiver?: string;
  closeRemainderTo?: string;
  assetTransfer?: {
    amount: number;
    assetId: number;
    closeTo?: string;
    receiver: string;
    sender?: string;
  };
  confirmedRound?: number;
  poolError?: string;
  roundTime?: number;
  // Explorer links
  explorerLink?: string;
  senderLink?: string;
  receiverLink?: string;
}

export interface Account {
  address: string;
  amount: number;
  amountWithoutPendingRewards: number;
  assets?: Asset[];
  authAddr?: string;
  closedAtRound?: number;
  createdAtRound?: number;
  deleted?: boolean;
  participationRecord?: ParticipationRecord;
  pendingRewards: number;
  rewardBase?: number;
  rewards: number;
  round: number;
  sigType?: string;
  status: string;
  totalAppsLocalState: number;
  totalAppsOptedIn: number;
  totalAssetsOptedIn: number;
  totalCreatedApps: number;
  totalCreatedAssets: number;
  totalBoxBytes: number;
  totalBoxes: number;
}

export interface Asset {
  amount: number;
  assetId: number;
  deleted?: boolean;
  isFrozen?: boolean;
  optedInAtRound?: number;
  optedOutAtRound?: number;
}

export interface ParticipationRecord {
  partId?: string;
  selection?: string;
  stateProofKey?: string;
  vote?: string;
  voteFirst?: number;
  voteKeyDilution?: number;
  voteLast?: number;
}

export interface Block {
  genesisHash: string;
  genesisId: string;
  previousBlockHash: string;
  rewards?: BlockRewards;
  round: number;
  seed: string;
  timestamp: number;
  txns?: Transaction[];
  txnRoot: string;
  upgradeApprove?: boolean;
  upgradeDelay?: number;
}

export interface BlockRewards {
  feesCollected: number;
  rewardsCalculated: number;
  rewardsPool: number;
  rewardsRate: number;
  rewardsResidue: number;
}

export interface WhaleWallet {
  address: string;
  balance: number;
  rank: number;
  percentOfSupply: number;
  lastActivity: number;
  transactionCount: number;
  assets: number;
  isExchange?: boolean;
  label?: string;
  explorerLink?: string;
}

export interface NetworkMetrics {
  tps: number;
  blockTime: number;
  currentRound: number;
  healthScore: number;
  activeAccounts: number;
  totalTransactions: number;
  avgFee: number;
  networkStake: number;
  totalValidators?: number;
  algoPrice?: number;
}

export interface DeFiMetrics {
  totalValueLocked: number;
  topAssets: AssetPerformance[];
  yieldOpportunities: YieldOpportunity[];
  liquidityPools: LiquidityPool[];
}

export interface AssetPerformance {
  assetId: number;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
}

export interface YieldOpportunity {
  protocol: string;
  asset: string;
  apy: number;
  tvl: number;
  risk: 'low' | 'medium' | 'high';
}

export interface LiquidityPool {
  id: string;
  assets: string[];
  tvl: number;
  volume24h: number;
  fee: number;
  apy: number;
}

export interface Alert {
  id: string;
  type: 'whale_movement' | 'unusual_activity' | 'network_congestion' | 'defi_opportunity';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  data?: any;
}

export interface TrendPrediction {
  metric: string;
  currentValue: number;
  predicted1h: number;
  predicted24h: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
}