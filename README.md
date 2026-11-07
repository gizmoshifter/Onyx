# Onyx

A lightweight Windows desktop companion for League of Legends, focused on preparation before a match and reflection after it.

## Current implementation

- Tauri 2 + React + TypeScript + Vite desktop foundation.
- Apple-inspired dark glass interface with restrained ambient color and responsive layout.
- Live published patch detection through Riot Data Dragon.
- Searchable champion catalog with official names, titles, tags, and champion portraits.
- Clear loading, retry, and offline states.
- No ads, sponsored placements, or tracking.

## Important data boundaries

The champion catalog is official static game data. Data Dragon does **not** publish win rates, matchup rates, pick rates, or role-specific performance statistics. Those features are not enabled until a separate trustworthy source is identified and validated. Onyx must never invent current-patch statistics or present sample values as real recommendations.

The app does not connect to the League Client, read live game state, or provide real-time instructions during a match. Future recommendations are planned around pregame context and explainable alternatives. Any post-game review or static overlay must be checked against Riot's current requirements before implementation.

Riot's League of Legends policy says products serving players must be registered in the Developer Portal, even when they do not use documented APIs. Keep the product description current and follow the policies in effect at release.

## Architecture

- Tauri 2 + React + TypeScript + Vite.
- Windows desktop shell using the Windows WebView runtime.
- Static game data and recommendation logic are kept separate so data sources can be reviewed and replaced.
- No League Client API (LCU) connection: Riot says that API is not officially supported for third-party applications.

## Development

Requirements: Node.js 20 or newer.

```sh
npm install
npm run dev
```

Desktop development requires Rust and the Tauri CLI:

```sh
npm run tauri dev
```

Create a production frontend build:

```sh
npm run build
```

## Roadmap

1. Complete the champion catalog and patch metadata layer.
2. Add verified current-patch role and matchup statistics with source, rank/region scope, sample size, and update timestamp.
3. Build explainable champion-select recommendations using matchup counters, team synergy, and the player's champion pool.
4. Add item and rune comparisons using permitted static data.
5. Add post-game review through a permitted and documented data source.
6. Evaluate a minimal static-only overlay with Riot's current policy and registration requirements before implementation.
7. Add cloud model orchestration behind provider adapters, with free-tier limits, transparent usage, and graceful fallbacks.

## Riot disclaimer

Onyx is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
