export type Role = 'TOP' | 'JUNGLE' | 'MID' | 'ADC' | 'SUPPORT';
export type Region = 'ALL' | 'KR' | 'EUW' | 'NA' | 'CN';
export type Tier = 'CHALLENGER' | 'GRANDMASTER' | 'MASTER' | 'DIAMOND' | 'EMERALD' | 'PLATINUM' | 'GOLD';

export interface RuneInfo {
  id: string;
  name: string;
  tree: 'Precision' | 'Domination' | 'Sorcery' | 'Resolve' | 'Inspiration';
  icon: string;
  description: string;
  isKeystone?: boolean;
}

export interface StatShard {
  id: string;
  name: string;
  slot: 'offense' | 'flex' | 'defense';
  description: string;
  icon?: string;
}

export interface ItemInfo {
  id: string;
  name: string;
  cost: number;
  icon: string;
  stats: string;
  description: string;
  category: 'starting' | 'core' | 'boots' | 'situational';
}

export interface ChampionAbility {
  key: 'P' | 'Q' | 'W' | 'E' | 'R';
  name: string;
  icon: string;
  description: string;
  symbol: string;
}

export interface SkillOrder {
  maxOrder: ('Q' | 'W' | 'E')[];
  progression: ('Q' | 'W' | 'E' | 'R')[];
}

export interface BuildVariant {
  id: string;
  title: string;
  tag: string; // e.g. "BURST", "DPS", "SURVIVE", "OTP"
  icon: string;
  startingItems: ItemInfo[];
  coreBuild: ItemInfo[];
  boots: ItemInfo[];
  situationalItems: ItemInfo[];
  recommendedRunes: {
    primaryTree: 'Precision' | 'Domination' | 'Sorcery' | 'Resolve' | 'Inspiration';
    keystone: RuneInfo;
    primarySlot1: RuneInfo;
    primarySlot2: RuneInfo;
    primarySlot3: RuneInfo;
    secondaryTree: 'Precision' | 'Domination' | 'Sorcery' | 'Resolve' | 'Inspiration';
    secondarySlot1: RuneInfo;
    secondarySlot2: RuneInfo;
    shards: StatShard[];
  };
  maxOrder: ('Q' | 'W' | 'E')[];
}

export interface MatchupData {
  championId: string;
  championName: string;
  championIcon: string;
  role: Role;
  winRate: number; // e.g. 52.4
  matchCount: number;
  goldDiffAt15: number; // e.g. +340 or -210
  killRateInLane: number; // e.g. 56.2%
  difficulty: 'Favored' | 'Skill' | 'Hard' | 'Extreme';
  proTips: string;
  recommendedCounterItem: string;
  tradeWindow: string; // concise in-game timing window
  powerSpike: string; // in-game level/item warning
}

export interface MatchPlayer {
  championId: string;
  championName: string;
  championIcon: string;
  role: Role;
  summonerName: string;
  proTag?: string;
  teamTag?: string;
  region: Region;
  rankTier: Tier;
  lp?: number;
  isCurrentUserOrPro?: boolean;
  kills: number;
  deaths: number;
  assists: number;
  cs: number;
  gold: number;
  damage: number;
  items: (ItemInfo | null)[];
  spells: [string, string];
  keystone: string;
  secondaryTree: string;
}

export interface ProMatch {
  id: string;
  proPlayerId: string;
  proPlayerName: string;
  teamTag: string;
  region: Region;
  championId: string;
  championName: string;
  role: Role;
  opponentChampionId: string;
  opponentChampionName: string;
  opponentPlayerName: string;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  cs: number;
  csPerMin: number;
  gold: number;
  gameDurationMinutes: number;
  timeAgo: string;
  killParticipation: number;
  damageDealt: number;
  spells: [string, string];
  items: ItemInfo[];
  trinket: ItemInfo;
  keystone: RuneInfo;
  primaryRunes: RuneInfo[];
  secondaryTree: 'Precision' | 'Domination' | 'Sorcery' | 'Resolve' | 'Inspiration';
  secondaryRunes: RuneInfo[];
  statShards: StatShard[];
  skillOrder: SkillOrder;
  timeline: {
    minute: number;
    items: string[];
    description: string;
  }[];
  blueTeam: MatchPlayer[];
  redTeam: MatchPlayer[];
}

export interface SeasonRankHistory {
  season: string;
  year: number;
  tier: Tier;
  division: string;
  lp: number;
  peakLp: number;
  wins: number;
  losses: number;
  leaderboardRank?: number;
  topChampions: {
    championId: string;
    championName: string;
    gamesPlayed: number;
    winRate: number;
  }[];
}

export interface GameModeRank {
  modeKey: 'soloDuo' | 'flex' | 'arena' | 'aram' | 'tft';
  modeName: string;
  tier: Tier | 'GLADIATOR' | 'ARAM_GOD' | 'HYPER';
  division?: string;
  lpOrRating: number;
  peakRating: number;
  wins: number;
  losses: number;
  winRate: number;
  topRankPercentile: string;
  leaderboardPosition?: number;
  badgeAccent: string;
}

export interface PlayerRankProfile {
  playerId: string;
  summonerName: string;
  tagline: string;
  proName: string;
  team: string;
  teamLogo?: string;
  region: Region;
  avatarUrl: string;
  currentRank: {
    tier: Tier;
    division: string;
    lp: number;
    wins: number;
    losses: number;
    winRate: number;
    ladderRank: number;
    streak: number;
  };
  peakCareerRank: {
    tier: Tier;
    lp: number;
    season: string;
    ladderRank: number;
  };
  highestRankEver: {
    tier: Tier;
    lp: number;
    date: string;
    ladderRank: number;
  };
  seasonHistory: SeasonRankHistory[];
  gameModes: GameModeRank[];
}

export interface ChampionMeta {
  id: string;
  name: string;
  title: string;
  role: Role;
  tier: 'S+' | 'S' | 'A' | 'B';
  winRate: number;
  pickRate: number;
  banRate: number;
  iconUrl: string;
  splashUrl: string;
  colorAccent: string;
  abilities: {
    P: ChampionAbility;
    Q: ChampionAbility;
    W: ChampionAbility;
    E: ChampionAbility;
    R: ChampionAbility;
  };
  startingItems: ItemInfo[];
  coreBuild: ItemInfo[];
  boots: ItemInfo[];
  situationalItems: ItemInfo[];
  recommendedRunes: {
    primaryTree: 'Precision' | 'Domination' | 'Sorcery' | 'Resolve' | 'Inspiration';
    keystone: RuneInfo;
    primarySlot1: RuneInfo;
    primarySlot2: RuneInfo;
    primarySlot3: RuneInfo;
    secondaryTree: 'Precision' | 'Domination' | 'Sorcery' | 'Resolve' | 'Inspiration';
    secondarySlot1: RuneInfo;
    secondarySlot2: RuneInfo;
    shards: StatShard[];
  };
  skillOrder: SkillOrder;
  buildVariants: BuildVariant[];
  matchups: MatchupData[];
  recentPros: string[];
}

export interface UserMatchSummary {
  id: string;
  championId: string;
  championName: string;
  championIcon: string;
  role: Role;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  cs: number;
  csPerMin: number;
  durationMinutes: number;
  timeAgo: string;
  items: (ItemInfo | null)[];
  spells: [string, string];
  keystoneIcon: string;
  killParticipation: number;
  damage: number;
}

export interface UserSummonerProfile {
  id: string;
  summonerName: string;
  tagline: string;
  region: Region;
  profileIconUrl: string;
  level: number;
  soloTier: Tier;
  soloLp: number;
  soloWins: number;
  soloLosses: number;
  topChampions: {
    championId: string;
    championName: string;
    iconUrl: string;
    games: number;
    winRate: number;
    kda: string;
    masteryLevel: number;
  }[];
  recentMatches: UserMatchSummary[];
  streak: number;
  averageCsPerMin: number;
  averageKp: number;
}

export interface PatchNoteHighlight {
  category: 'champions' | 'items' | 'systems';
  name: string;
  role?: Role;
  type: 'buff' | 'nerf' | 'adjusted';
  summary: string;
  details: string[];
}

export interface SkinSaleItem {
  id: string;
  championName: string;
  skinName: string;
  splashUrl: string;
  originalRp: number;
  saleRp: number;
  discountPercent: number;
  expiresInDays: number;
}

export interface EventPassInfo {
  name: string;
  badge: string;
  passTier: number;
  maxTier: number;
  tokens: number;
  expiresInDays: number;
  featuredReward: string;
}

export interface MythicShopItem {
  id: string;
  skinName: string;
  championName: string;
  splashUrl: string;
  mythicCost: number;
  isPrestige: boolean;
  rotationNote: string;
}


