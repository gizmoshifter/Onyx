# Onyx

A lightweight League of Legends companion focused on useful, explainable recommendations.

## Product principles
- Free, ad-free, no forced account, no trackers.
- Minimal resource use and a restrained, native-feeling interface.
- Explain why an item, rune, or champion is recommended.
- Patch-aware matchup and item data; never present stale data as current.
- Optional compact in-game overlay; the companion remains useful independently.

## Architecture
- Tauri 2 + React + TypeScript + Vite.
- Rust desktop layer for window management and local League Client (LCU) integration.
- Separate data adapters for patch data, matchup statistics, and live game state.
- Replaceable data sources; no paid service or API key required for the baseline.

## Development
`npm install`
`npm run dev`

Desktop development requires Rust and the Tauri CLI:
`npm run tauri dev`

## Roadmap
1. App shell and design system.
2. Current-patch champion select and matchup recommendations.
3. Explainable item/rune recommendations using enemy composition and builds.
4. Optional LCU-connected live overlay.
5. Tests, accessibility, and release packaging.
