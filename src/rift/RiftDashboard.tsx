import React, { useState, useEffect } from 'react';
import './index.css';
import { Header } from './components/Header';
import { ChampionHero } from './components/ChampionHero';
import { BuildOverview } from './components/BuildOverview';
import { ProMatchFeed } from './components/ProMatchFeed';
import { RankShowcase } from './components/RankShowcase';
import { MatchupAnalytics } from './components/MatchupAnalytics';
import { ProPlayerDirectory } from './components/ProPlayerDirectory';
import { RuneBuilderModal } from './components/RuneBuilderModal';
import { MatchModal } from './components/MatchModal';
import { AmbientBackground } from './components/AmbientBackground';
import { UserSummonerCard } from './components/UserSummonerCard';
import { SummonerPickerModal } from './components/SummonerPickerModal';
import { HomeLiveFeed } from './components/HomeLiveFeed';
import { LiveOverlay } from './components/LiveOverlay';
import { Role, Region, ProMatch, UserSummonerProfile } from './types/league';
import { CHAMPIONS_METADATA, RECENT_PRO_MATCHES, USER_SUMMONER_PRESETS } from './data/mockLeagueData';

export default function App() {
  const [selectedChampionId, setSelectedChampionId] = useState<string>('Ahri');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('faker');
  const [selectedRole, setSelectedRole] = useState<Role | 'ALL'>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<Region>('ALL');
  const [activeTab, setActiveTab] = useState<'builds' | 'overlay' | 'ranks' | 'matchups' | 'pros' | 'sandbox'>('builds');
  const [activeMatch, setActiveMatch] = useState<ProMatch | null>(null);

  // User Profile Picker (First Launch & Persistent HUD)
  const [userProfile, setUserProfile] = useState<UserSummonerProfile>(() => {
    try {
      const saved = localStorage.getItem('user_summoner_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore JSON error
    }
    return USER_SUMMONER_PRESETS[0];
  });

  const [isPickerOpen, setIsPickerOpen] = useState(false);

  useEffect(() => {
    try {
      const hasChosen = localStorage.getItem('has_selected_summoner');
      if (hasChosen !== 'true') {
        setIsPickerOpen(true);
      }
    } catch (e) {
      // Fallback
    }
  }, []);

  const handleSelectProfile = (profile: UserSummonerProfile) => {
    setUserProfile(profile);
    try {
      localStorage.setItem('user_summoner_profile', JSON.stringify(profile));
      localStorage.setItem('has_selected_summoner', 'true');
    } catch (e) {
      // Fallback
    }
  };

  // Get active champion object
  const activeChampion =
    CHAMPIONS_METADATA.find((c) => c.id.toLowerCase() === selectedChampionId.toLowerCase()) ||
    CHAMPIONS_METADATA[0];
  const overlayMatch =
    RECENT_PRO_MATCHES.find((match) =>
      match.blueTeam.some((player) => player.championId.toLowerCase() === activeChampion.id.toLowerCase())
    ) || RECENT_PRO_MATCHES[0];

  const handleSelectRole = (role: Role | 'ALL') => {
    setSelectedRole(role);
    if (role !== 'ALL' && activeChampion.role !== role) {
      const matchInRole = CHAMPIONS_METADATA.find((c) => c.role === role);
      if (matchInRole) {
        setSelectedChampionId(matchInRole.id);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#080a10] text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200 relative overflow-x-hidden">
      {/* High-Dynamic Ambient Light Mesh */}
      <AmbientBackground />

      {/* Sleek Minimal Onyx Header */}
      <Header
        selectedRole={selectedRole}
        onSelectRole={handleSelectRole}
        selectedRegion={selectedRegion}
        onSelectRegion={setSelectedRegion}
        selectedChampion={selectedChampionId}
        onSelectChampion={(champId) => {
          setSelectedChampionId(champId);
          setActiveTab('builds');
        }}
        onSelectPlayer={(playerId) => {
          setSelectedPlayerId(playerId);
          setActiveTab('ranks');
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        onOpenSummonerPicker={() => setIsPickerOpen(true)}
      />

      {/* Main Container Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full relative z-10 space-y-6">
        {/* Tab 0: COMPACT LIVE HUD PREVIEW */}
        {activeTab === 'overlay' && (
          <div className="mx-auto max-w-xl animate-fadeIn">
            <LiveOverlay champion={activeChampion} match={overlayMatch} />
          </div>
        )}

        {/* Tab 1: HOME SCREEN (User Summoner HUD, Live Patch Feed, Champion Hero, Runes, Matches) */}
        {activeTab === 'builds' && (
          <div className="space-y-6 animate-fadeIn">
            {/* User Selected Summoner HUD Card */}
            <UserSummonerCard
              profile={userProfile}
              onOpenSwitchModal={() => setIsPickerOpen(true)}
              onSelectChampion={(cId) => setSelectedChampionId(cId)}
            />

            {/* Patch 14.23 Notes, Sales, Event Pass & Mythic Shop Hub */}
            <HomeLiveFeed />

            {/* Champion Splash Showcase & Quick Abilities */}
            <ChampionHero
              champion={activeChampion}
              onSelectChampion={setSelectedChampionId}
              onSelectRole={(r) => setSelectedRole(r)}
            />

            {/* Authentic League Client Constellation Rune Tree & Items */}
            <BuildOverview champion={activeChampion} />

            {/* Pro & High Elo Stream */}
            <ProMatchFeed
              matches={RECENT_PRO_MATCHES}
              selectedChampionId={activeChampion.id}
              selectedRole={selectedRole}
              selectedRegion={selectedRegion}
              onOpenMatch={setActiveMatch}
              onSelectChampion={setSelectedChampionId}
            />
          </div>
        )}

        {/* Tab 2: RANK SHOWCASE & TIMELINE SLIDER */}
        {activeTab === 'ranks' && (
          <div className="animate-fadeIn">
            <RankShowcase
              selectedPlayerId={selectedPlayerId}
              onSelectPlayer={setSelectedPlayerId}
            />
          </div>
        )}

        {/* Tab 3: LANE COUNTERS */}
        {activeTab === 'matchups' && (
          <div className="animate-fadeIn">
            <MatchupAnalytics
              champion={activeChampion}
              onSelectChampion={setSelectedChampionId}
            />
          </div>
        )}

        {/* Tab 4: PRO DIRECTORY */}
        {activeTab === 'pros' && (
          <div className="animate-fadeIn">
            <ProPlayerDirectory
              onSelectPlayer={(id) => {
                setSelectedPlayerId(id);
                setActiveTab('ranks');
              }}
              onViewRanksTab={() => setActiveTab('ranks')}
            />
          </div>
        )}

        {/* Tab 5: RUNE STUDIO */}
        {activeTab === 'sandbox' && (
          <div className="animate-fadeIn">
            <RuneBuilderModal />
          </div>
        )}
      </main>

      {/* Match Breakdown Modal */}
      <MatchModal match={activeMatch} onClose={() => setActiveMatch(null)} />

      {/* Summoner Profile Selection Modal */}
      <SummonerPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        currentProfile={userProfile}
        onSelectProfile={handleSelectProfile}
      />

      {/* Clean Minimalist Onyx Footer */}
      <footer className="mt-auto border-t border-white/5 py-6 glass-panel text-xs text-slate-400 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-black/60 border border-white/10 flex items-center justify-center">
              <div className="w-2 h-2 rotate-45 bg-sky-400/80" />
            </div>
            <span className="font-heading font-extrabold tracking-widest text-slate-200">ONYX</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">14.23</span>
        </div>
      </footer>
    </div>
  );
}

