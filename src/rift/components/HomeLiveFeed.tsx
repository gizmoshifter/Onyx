import React, { useState } from 'react';
import { Sparkles, Tag, Award, Gem, Flame, ChevronRight, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { PATCH_14_23_NOTES, CURRENT_SALES, CURRENT_EVENT, MYTHIC_SHOP_ITEMS } from '../data/mockLeagueData';

export const HomeLiveFeed: React.FC = () => {
  const [feedTab, setFeedTab] = useState<'patch' | 'sales' | 'event' | 'mythic'>('patch');

  return (
    <div className="glass-card rounded-2xl p-5 md:p-6 border border-white/10 shadow-2xl space-y-4">
      {/* Header and Filter Pills */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <h2 className="text-sm font-bold font-heading text-white tracking-wide">
            Live Feed & Patch Hub
          </h2>
        </div>

        {/* Category Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
          <button
            onClick={() => setFeedTab('patch')}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              feedTab === 'patch'
                ? 'bg-sky-500/30 text-sky-300 border border-sky-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Patch 14.23
          </button>
          <button
            onClick={() => setFeedTab('sales')}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              feedTab === 'sales'
                ? 'bg-amber-500/30 text-amber-300 border border-amber-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sales
          </button>
          <button
            onClick={() => setFeedTab('event')}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              feedTab === 'event'
                ? 'bg-purple-500/30 text-purple-300 border border-purple-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Event Pass
          </button>
          <button
            onClick={() => setFeedTab('mythic')}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              feedTab === 'mythic'
                ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Mythic Shop
          </button>
        </div>
      </div>

      {/* Tab 1: Patch 14.23 Highlights */}
      {feedTab === 'patch' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 animate-fadeIn">
          {PATCH_14_23_NOTES.slice(0, 4).map((n, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-black/30 border border-white/10 hover:border-white/20 transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-heading">{n.name}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold flex items-center gap-1 ${
                    n.type === 'buff'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                      : n.type === 'nerf'
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                      : 'bg-sky-950/80 text-sky-300 border border-sky-500/30'
                  }`}
                >
                  {n.type === 'buff' ? (
                    <TrendingUp className="w-2.5 h-2.5 text-emerald-400" />
                  ) : n.type === 'nerf' ? (
                    <TrendingDown className="w-2.5 h-2.5 text-rose-400" />
                  ) : null}
                  {n.type.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                {n.summary}
              </p>
              {n.details[0] && (
                <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-white/5 truncate">
                  {n.details[0]}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Current Skin & Champion Sales */}
      {feedTab === 'sales' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-fadeIn">
          {CURRENT_SALES.map((sale) => (
            <div
              key={sale.id}
              className="group relative rounded-xl overflow-hidden border border-white/10 hover:border-amber-400/50 bg-black/40 transition-all flex flex-col justify-end min-h-[140px]"
            >
              {/* Background Splash */}
              <img
                src={sale.splashUrl}
                alt={sale.skinName}
                className="absolute inset-0 w-full h-full object-cover object-center filter brightness-60 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090b14] via-[#090b14]/50 to-transparent" />

              {/* Discount Badge */}
              <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-mono font-black shadow">
                -{sale.discountPercent}%
              </span>

              {/* Info Content */}
              <div className="relative z-10 p-3 space-y-1">
                <span className="text-xs font-bold text-white block truncate">{sale.skinName}</span>
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400 font-bold">{sale.saleRp} RP</span>
                    <span className="text-[10px] text-slate-400 line-through">{sale.originalRp}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{sale.expiresInDays}d left</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Live Event Pass */}
      {feedTab === 'event' && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-black/40 border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-heading">{CURRENT_EVENT.name}</h3>
                <span className="text-[9px] px-2 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-400/30 font-mono font-bold">
                  {CURRENT_EVENT.badge}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{CURRENT_EVENT.featuredReward}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-mono block">Pass Tier</span>
              <span className="text-sm font-bold text-purple-300 font-mono">
                {CURRENT_EVENT.passTier} / {CURRENT_EVENT.maxTier}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-mono block">Banked Tokens</span>
              <span className="text-sm font-bold text-amber-400 font-mono">
                {CURRENT_EVENT.tokens.toLocaleString()}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-mono block">Duration</span>
              <span className="text-xs text-slate-300 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> {CURRENT_EVENT.expiresInDays} Days
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Mythic Shop Rotation */}
      {feedTab === 'mythic' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-fadeIn">
          {MYTHIC_SHOP_ITEMS.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-xl overflow-hidden border border-white/10 hover:border-emerald-400/50 bg-black/40 transition-all flex flex-col justify-end min-h-[140px]"
            >
              <img
                src={item.splashUrl}
                alt={item.skinName}
                className="absolute inset-0 w-full h-full object-cover object-center filter brightness-60 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090b14] via-[#090b14]/50 to-transparent" />

              <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1 shadow">
                <Gem className="w-3 h-3 text-emerald-400" /> {item.mythicCost} ME
              </span>

              <div className="relative z-10 p-3 space-y-0.5">
                <span className="text-xs font-bold text-white block truncate">{item.skinName}</span>
                <span className="text-[10px] text-slate-400 font-mono block">{item.rotationNote}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

