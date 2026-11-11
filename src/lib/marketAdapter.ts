import { CURRENT_SALES, MYTHIC_SHOP_ITEMS } from '../rift/data/mockLeagueData';

export type MarketSource = 'preview' | 'riot-approved-live' | 'unsupported';

export type MarketSale = {
  id: string;
  championName: string;
  skinName: string;
  splashUrl: string;
  originalRp: number;
  saleRp: number;
  discountPercent: number;
  expiresInDays: number;
};

export type MarketMythicItem = {
  id: string;
  skinName: string;
  championName: string;
  splashUrl: string;
  mythicCost: number;
  isPrestige: boolean;
  rotationNote: string;
  chromaNames: string[];
};

export type MarketSnapshot = {
  source: MarketSource;
  fetchedAt: string;
  sales: MarketSale[];
  mythic: MarketMythicItem[];
  note: string;
};

export class UnsupportedRiotCapabilityError extends Error {
  constructor(capability: string) {
    super(`Riot has not approved a supported live endpoint for ${capability}.`);
    this.name = 'UnsupportedRiotCapabilityError';
  }
}

export interface MarketAdapter {
  readonly source: MarketSource;
  getSnapshot(): Promise<MarketSnapshot>;
}

/**
 * Safe default used until Riot approves a live storefront or inventory scope.
 * The preview feed is intentionally explicit so the UI never presents sample
 * commerce data as an official current rotation.
 */
export class PreviewMarketAdapter implements MarketAdapter {
  readonly source = 'preview' as const;

  async getSnapshot(): Promise<MarketSnapshot> {
    return {
      source: this.source,
      fetchedAt: new Date().toISOString(),
      sales: CURRENT_SALES,
      mythic: MYTHIC_SHOP_ITEMS.map((item) => ({
        ...item,
        chromaNames: item.chromaNames ?? [],
      })),
      note: 'Preview catalog. Live storefront and owned-skin data are disabled until Riot approval.',
    };
  }
}

/**
 * Deliberately fails closed. This is the seam for a future Riot-approved
 * backend/RSO provider; it must not be replaced with private client endpoints
 * or scraped storefront responses.
 */
export class RiotApprovedMarketAdapter implements MarketAdapter {
  readonly source = 'riot-approved-live' as const;

  async getSnapshot(): Promise<MarketSnapshot> {
    throw new UnsupportedRiotCapabilityError('League storefront and owned cosmetics');
  }
}

export function createMarketAdapter(mode: 'preview' | 'riot-approved-live' = 'preview'): MarketAdapter {
  return mode === 'riot-approved-live'
    ? new RiotApprovedMarketAdapter()
    : new PreviewMarketAdapter();
}

