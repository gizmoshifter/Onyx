export type Champion = {
  id: string;
  key: string;
  name: string;
  title: string;
  blurb: string;
  tags: string[];
  image: { full: string };
};

export type ChampionSpell = {
  id: string;
  name: string;
  description: string;
  cooldown: number[];
  image: { full: string };
};

export type ChampionDetails = Champion & {
  spells: ChampionSpell[];
};

export type ChampionCatalog = {
  patch: string;
  champions: Champion[];
};

const VERSIONS_URL = "https://ddragon.leagueoflegends.com/api/versions.json";
const CDN = "https://ddragon.leagueoflegends.com/cdn";
const LANGUAGE = "en_US";

type VersionsResponse = string[];
type ChampionResponse = {
  data: Record<string, Champion>;
};

type ChampionDetailsResponse = {
  data: Record<string, ChampionDetails>;
};

let catalogRequest: Promise<ChampionCatalog> | undefined;
const detailRequests = new Map<string, Promise<ChampionDetails>>();

/**
 * Loads the current published Data Dragon patch and its champion catalog.
 * Data Dragon provides official static champion metadata, not win rates,
 * matchup statistics, or live game state.
 */
export function getChampionCatalog(): Promise<ChampionCatalog> {
  if (!catalogRequest) {
    catalogRequest = loadChampionCatalog().catch((error: unknown) => {
      catalogRequest = undefined;
      throw error;
    });
  }
  return catalogRequest;
}

async function loadChampionCatalog(): Promise<ChampionCatalog> {
  const versionsResponse = await fetch(VERSIONS_URL, {
    headers: { Accept: "application/json" },
  });
  if (!versionsResponse.ok) {
    throw new Error(`Could not load Riot patch versions (${versionsResponse.status}).`);
  }

  const versions = (await versionsResponse.json()) as VersionsResponse;
  const patch = versions[0];
  if (!patch) throw new Error("Riot did not return a published patch version.");

  const championsResponse = await fetch(
    `${CDN}/${patch}/data/${LANGUAGE}/champion.json`,
    { headers: { Accept: "application/json" } },
  );
  if (!championsResponse.ok) {
    throw new Error(`Could not load champion data for patch ${patch} (${championsResponse.status}).`);
  }

  const payload = (await championsResponse.json()) as ChampionResponse;
  const champions = Object.values(payload.data).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return { patch, champions };
}

export function championIconUrl(patch: string, champion: Champion): string {
  return `${CDN}/${patch}/img/champion/${champion.image.full}`;
}


/** Loads one champion's official spell icons only when the overlay needs them. */
export function getChampionDetails(patch: string, championId: string): Promise<ChampionDetails> {
  const cacheKey = patch + ':' + championId;
  const cached = detailRequests.get(cacheKey);
  if (cached) return cached;

  const request = fetch(
    CDN + '/' + patch + '/data/' + LANGUAGE + '/champion/' + championId + '.json',
    { headers: { Accept: 'application/json' } },
  ).then(async (response) => {
    if (!response.ok) throw new Error('Could not load spell data for ' + championId + '.');
    const payload = (await response.json()) as ChampionDetailsResponse;
    const details = payload.data[championId];
    if (!details) throw new Error('Riot did not return spell data for ' + championId + '.');
    return details;
  }).catch((error) => {
    detailRequests.delete(cacheKey);
    throw error;
  });

  detailRequests.set(cacheKey, request);
  return request;
}

export function spellIconUrl(patch: string, spell: ChampionSpell): string {
  return CDN + '/' + patch + '/img/spell/' + spell.image.full;
}