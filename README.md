# Onyx

A personal League of Legends companion with a live player dashboard and post-game review.

## Current features

- Opens to the **Sin #O00 · North America** profile.
- Connects to League's local Live Client Data API while a match is running.
- Shows the active champion, game clock, KDA, CS per minute, current gold, team towers, first blood, first tower, and current items.
- Generates short in-game tips from the player's visible stats and match events.
- Recent match cards are still illustrative examples; real historical match data is not connected yet.
- No ads or forced account sign-in.

## Live game connection

The live view reads `https://127.0.0.1:2999/liveclientdata/allgamedata` from the PC running League. It does not need a Riot API key.

For the browser preview, the Vite development server proxies this local endpoint:

```sh
npm install
npm run dev
```

Open the local preview while League is running. The live panel checks for a match every four seconds.

The Tauri desktop app reads the same local endpoint through its native command:

```sh
npm run tauri dev
```

## Data still to connect

Real past match history, verified gold-at-15 comparisons, and rank data need Riot's account and match-history APIs. Those credentials are not included in this public repository. The three historical match cards remain labeled as examples until that connection is added.

## Architecture

- Tauri 2 + React + TypeScript + Vite.
- Windows desktop shell using the Windows WebView runtime.
- Riot's local Live Client Data API for active-game data.
- Riot Data Dragon for champion and item artwork.

## Riot disclaimer

Onyx is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc.

Products serving League players must be registered in Riot's Developer Portal. Keep the product description current and follow Riot's policies.
