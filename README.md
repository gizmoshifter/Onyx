# Onyx

A lightweight Windows desktop companion for League of Legends, focused on preparation before a match and reflection after it.

## Product boundaries

- The current interface is a prototype. Champion rates, matchup notes, and recommendation examples are illustrative and are not connected to live patch statistics.
- The app does not connect to the League Client, read live game state, or provide real-time instructions during a match.
- Planned recommendations use static game information available before a match and player-selected context. They show multiple options and their reasoning so the player makes the decision.
- Post-game coaching, if added, will run after the match and use data sources permitted by Riot.
- A static in-game overlay is only a future possibility for information available before the game. It would not refresh from live game state or dictate actions, and would be reviewed against Riot's current requirements before release.
- Riot's League of Legends policy says products serving players must be registered in the Developer Portal, even when they do not use documented APIs. Keep the product description current and follow the policies in effect at release.

## Architecture

- Tauri 2 + React + TypeScript + Vite.
- Windows desktop shell using the Windows WebView runtime.
- Static game data and recommendation logic are kept separate so data sources can be reviewed and replaced.
- No League Client API (LCU) connection: Riot says that API is not officially supported for third-party applications.

## Development

```sh
npm install
npm run dev
```

Desktop development requires Rust and the Tauri CLI:

```sh
npm run tauri dev
```

## Roadmap

1. App shell and design system.
2. Explainable pregame champion and build comparisons using permitted static data.
3. Post-game review after a match has ended, using a permitted and documented data source.
4. Accessibility, Windows packaging, and release readiness.
5. Evaluate a static-only overlay with Riot's current policy and registration requirements before any implementation.

## Riot disclaimer

Onyx is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
