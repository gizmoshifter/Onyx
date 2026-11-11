import React, { useMemo, useState } from 'react';
import { Clock3, Gem, Gamepad2, Image as ImageIcon, ShoppingBag, Sparkles, Tag } from 'lucide-react';
import { CHAMPIONS_METADATA, CURRENT_SALES, MYTHIC_SHOP_ITEMS } from '../data/mockLeagueData';

type MarketTab = 'sales' | 'mythic';
type ArtMode = 'splash' | 'loading';

const loadingUrl = (splashUrl: string) => splashUrl.replace('/splash/', '/loading/');

export const SkinMarket: React.FC = () => {
  const [marketTab, setMarketTab] = useState<MarketTab>('sales');
  const [artMode, setArtMode] = useState<ArtMode>('splash');

  const championIcons = useMemo(
    () => new Map(CHAMPIONS_METADATA.map((champion) => [champion.name.toLowerCase(), champion.iconUrl])),
    [],
  );

  return (
    <section className="market-stage animate-fadeIn">
      <div className="market-head">
        <div className="market-title">
          <div className="market-mark"><ShoppingBag size={18} /></div>
          <div>
            <span className="panel-kicker">RIOT ART</span>
            <h2>Market</h2>
          </div>
        </div>
        <div className="market-tools">
          <div className="market-tabs" role="tablist" aria-label="Market tabs">
            <button className={marketTab === 'sales' ? 'active' : ''} onClick={() => setMarketTab('sales')} title="Skin sales" aria-label="Skin sales">
              <Tag size={14} /> <span>{CURRENT_SALES.length}</span>
            </button>
            <button className={marketTab === 'mythic' ? 'active' : ''} onClick={() => setMarketTab('mythic')} title="Mythic shop" aria-label="Mythic shop">
              <Gem size={14} /> <span>{MYTHIC_SHOP_ITEMS.length}</span>
            </button>
          </div>
          <div className="art-toggle" role="group" aria-label="Artwork view">
            <button className={artMode === 'splash' ? 'active' : ''} onClick={() => setArtMode('splash')} title="Splash art" aria-label="Splash art">
              <ImageIcon size={13} />
            </button>
            <button className={artMode === 'loading' ? 'active' : ''} onClick={() => setArtMode('loading')} title="In-game loading art" aria-label="In-game loading art">
              <Gamepad2 size={13} />
            </button>
          </div>
        </div>
      </div>

      {marketTab === 'sales' && (
        <div className="market-grid">
          {CURRENT_SALES.map((sale) => (
            <article className="market-card sale-market-card" key={sale.id}>
              <img src={artMode === 'splash' ? sale.splashUrl : loadingUrl(sale.splashUrl)} alt="" loading="lazy" decoding="async" />
              <div className="market-card-shade" />
              <div className="market-discount">-{sale.discountPercent}%</div>
              <div className="market-card-copy">
                <div className="market-card-title">
                  <img src={championIcons.get(sale.championName.toLowerCase())} alt="" loading="lazy" decoding="async" />
                  <div><b>{sale.skinName}</b><span>{sale.championName}</span></div>
                </div>
                <div className="market-card-meta"><strong>{sale.saleRp} RP</strong><del>{sale.originalRp}</del><span><Clock3 size={11} /> {sale.expiresInDays}d</span></div>
              </div>
            </article>
          ))}
        </div>
      )}

      {marketTab === 'mythic' && (
        <div className="market-grid mythic-market-grid">
          {MYTHIC_SHOP_ITEMS.map((item) => (
            <article className="market-card mythic-market-card" key={item.id}>
              <img src={artMode === 'splash' ? item.splashUrl : loadingUrl(item.splashUrl)} alt="" loading="lazy" decoding="async" />
              <div className="market-card-shade" />
              <div className="market-cost"><Gem size={12} /> {item.mythicCost} ME</div>
              <div className="market-card-copy">
                <div className="market-card-title">
                  <Sparkles size={15} />
                  <div><b>{item.skinName}</b><span>{item.isPrestige ? 'PRESTIGE' : 'MYTHIC'}</span></div>
                </div>
                <div className="market-chromas">
                  {(item.chromaNames ?? []).map((chroma, index) => <span key={chroma} title={chroma} style={{ '--chroma': ['#d5b19a', '#a7b3d6', '#d3b5e6', '#9de0d4'][index % 4] } as React.CSSProperties} />)}
                  <small>{item.chromaNames?.length ?? 0} chromas</small>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="market-foot"><span title="Official Riot/Data Dragon art">◈ RIOT ART</span><span>⌁ {artMode === 'splash' ? 'SPLASH' : 'IN-GAME'}</span></div>
    </section>
  );
};
