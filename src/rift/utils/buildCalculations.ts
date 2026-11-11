/**
 * Pure calculations and transformation utilities for Rift Companion.
 * Decoupled from UI to enable fast deterministic unit testing.
 */

import { ProMatch, MatchPlayer, GameModeRank, SeasonRankHistory, MatchupData } from '../types/league';

/**
 * Calculates Kill-Death-Assist ratio.
 * Handled gracefully if deaths = 0 (perfect KDA).
 */
export function calculateKDA(kills: number, deaths: number, assists: number): number {
  if (deaths <= 0) {
    return Math.round((kills + assists) * 10) / 10;
  }
  const ratio = (kills + assists) / deaths;
  return Math.round(ratio * 100) / 100;
}

/**
 * Formats KDA display string.
 */
export function formatKDAString(kills: number, deaths: number, assists: number): string {
  const kda = calculateKDA(kills, deaths, assists);
  return `${kills} / ${deaths} / ${assists} (${kda} KDA)`;
}

/**
 * Calculates win rate percentage from wins and losses.
 */
export function calculateWinRate(wins: number, losses: number): number {
  const total = wins + losses;
  if (total <= 0) return 0;
  return Math.round((wins / total) * 1000) / 10;
}

/**
 * Calculates Kill Participation (KP%) of a player relative to team total kills.
 */
export function calculateKillParticipation(playerKills: number, playerAssists: number, teamTotalKills: number): number {
  if (teamTotalKills <= 0) return 0;
  const participation = ((playerKills + playerAssists) / teamTotalKills) * 100;
  return Math.min(100, Math.round(participation));
}

/**
 * Calculates total gold and team kills from an array of match players.
 */
export function aggregateTeamStats(team: MatchPlayer[]): { totalKills: number; totalGold: number; totalDamage: number } {
  return team.reduce(
    (acc, player) => ({
      totalKills: acc.totalKills + player.kills,
      totalGold: acc.totalGold + player.gold,
      totalDamage: acc.totalDamage + player.damage,
    }),
    { totalKills: 0, totalGold: 0, totalDamage: 0 }
  );
}

/**
 * Determines matchup advantage score based on win rate and gold differential at 15m.
 * Returns -100 to +100 where > 0 favors champion, < 0 favors opponent.
 */
export function evaluateMatchupAdvantage(matchup: MatchupData): {
  score: number;
  label: 'Favored' | 'Even' | 'Unfavored' | 'Counter';
  badgeColor: string;
} {
  // Win rate component (50% = 0, 55% = +25)
  const wrDelta = (matchup.winRate - 50) * 5;
  // Gold diff component (e.g. +500 gold = +25)
  const goldDelta = (matchup.goldDiffAt15 / 500) * 25;
  const rawScore = wrDelta + goldDelta;
  const score = Math.max(-100, Math.min(100, Math.round(rawScore)));

  if (score >= 20) {
    return { score, label: 'Favored', badgeColor: '#10b981' };
  } else if (score >= -10) {
    return { score, label: 'Even', badgeColor: '#38bdf8' };
  } else if (score >= -35) {
    return { score, label: 'Unfavored', badgeColor: '#f59e0b' };
  } else {
    return { score, label: 'Counter', badgeColor: '#ef4444' };
  }
}

/**
 * Sorts and filters matches by role, region, and search term.
 */
export function filterMatches(
  matches: ProMatch[],
  filters: {
    championId?: string;
    role?: string;
    region?: string;
    searchQuery?: string;
    resultFilter?: 'all' | 'win' | 'loss';
  }
): ProMatch[] {
  return matches.filter((m) => {
    if (filters.championId && m.championId.toLowerCase() !== filters.championId.toLowerCase()) {
      return false;
    }
    if (filters.role && filters.role !== 'ALL' && m.role !== filters.role) {
      return false;
    }
    if (filters.region && filters.region !== 'ALL' && m.region !== filters.region) {
      return false;
    }
    if (filters.resultFilter && filters.resultFilter !== 'all') {
      const wantWin = filters.resultFilter === 'win';
      if (m.win !== wantWin) return false;
    }
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchPro = m.proPlayerName.toLowerCase().includes(q);
      const matchTeam = m.teamTag.toLowerCase().includes(q);
      const matchChamp = m.championName.toLowerCase().includes(q);
      const matchOpponent = m.opponentChampionName.toLowerCase().includes(q);
      if (!matchPro && !matchTeam && !matchChamp && !matchOpponent) {
        return false;
      }
    }
    return true;
  });
}

/**
 * Finds peak LP and best season from season history records.
 */
export function findCareerPeak(seasons: SeasonRankHistory[]): {
  peakLp: number;
  season: string;
  tier: string;
} {
  if (seasons.length === 0) {
    return { peakLp: 0, season: 'N/A', tier: 'UNRANKED' };
  }
  let maxRecord = seasons[0];
  for (const s of seasons) {
    if (s.peakLp > maxRecord.peakLp) {
      maxRecord = s;
    }
  }
  return {
    peakLp: maxRecord.peakLp,
    season: maxRecord.season,
    tier: maxRecord.tier,
  };
}

/**
 * Formats LP or rating display (e.g. "1,482 LP" or "8,450 Rating").
 */
export function formatRankRating(mode: GameModeRank): string {
  if (mode.modeKey === 'arena') {
    return `${mode.lpOrRating.toLocaleString()} Rating`;
  }
  if (mode.modeKey === 'aram') {
    return `${mode.lpOrRating.toLocaleString()} MMR`;
  }
  return `${mode.lpOrRating.toLocaleString()} LP`;
}

/**
 * Returns official Riot CommunityDragon ranked emblem asset URL for any rank tier.
 * Tiers: challenger, grandmaster, master, diamond, emerald, platinum, gold, silver, bronze, iron.
 */
export function getRankEmblemUrl(tier: string): string {
  if (!tier) {
    return 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-unranked.png';
  }
  const t = tier.toLowerCase();
  if (t === 'gladiator' || t === 'hyper') {
    return 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-challenger.png';
  }
  if (t === 'aram_god') {
    return 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-grandmaster.png';
  }
  return `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-${t}.png`;
}


