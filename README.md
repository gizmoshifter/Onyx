# Onyx

A lightweight Windows desktop companion for League of Legends with one calm surface for the lobby, the match, and the review.

## Current implementation

- Tauri 2 + React + TypeScript + Vite desktop foundation.
- Apple-inspired liquid-glass interface with icon-led navigation, restrained motion, and responsive layout.
- Live published patch detection through Riot Data Dragon.
- Searchable champion catalog with official names, titles, tags, and champion portraits.
- Three modes: standalone home, pregame preparation, and compact always-on-top overlay.
- Live-game stats through the native desktop bridge when League is running.
- Build, matchup, rune, skin-sale, splash, Mythic/chroma, and esports surfaces in one scrollable hub.
- Clear loading, retry, and offline states with small polling intervals and no heavy media layer.
- No ads, sponsored placements, or tracking.

## Important data boundaries

The champion catalog is official static game data. Data Dragon does **not** publish win rates, matchup rates, pick rates, or role-specific performance statistics. Those features are not enabled until a separate trustworthy source is identified and validated. Onyx must never invent current-patch statistics or present sample values as real recommendations.

The champion catalog is official static game data. The in-app sales, Mythic, chroma, and esports cards are presentation surfaces for the current preview feed; they must be connected to a verified, current source before being treated as authoritative live commerce or news data.

The overlay reads the local Live Client Data endpoint through the native Rust bridge and presents compact telemetry plus gentle reminders. It is intentionally not a directive coach. Any shipped overlay behavior must be checked against Riot's current requirements and registration policies.

Riot's League of Legends policy says products serving players must be registered in the Developer Portal, even when they do not use documented APIs. Keep the product description current and follow the policies in effect at release.

## Architecture

- Tauri 2 + React + TypeScript + Vite.
- Windows desktop shell using the Windows WebView runtime.
- Static game data, live telemetry, and presentation feeds are kept separate so sources can be reviewed and replaced.
- The web preview uses a Vite proxy for the local live endpoint; the Tauri build uses a short-timeout Rust client that accepts League's loopback certificate.
- The overlay is intentionally low-memory: a single React surface, CSS-only ambient motion, bounded lists, lazy images, and no video/canvas effects.

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

## Next data integrations

1. Connect the sales, Mythic/chroma, splash, and esports cards to verified current feeds.
2. Add source, region, rank scope, sample size, and update timestamps to any matchup or recommendation data.
3. Add a native overlay window launcher so the compact view can be opened without changing the main window.
4. Add post-game match history through a permitted and documented source.
5. Add optional provider adapters only behind transparent limits and graceful fallbacks.

## Riot disclaimer

Onyx is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
