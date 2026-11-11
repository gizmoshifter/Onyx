# Onyx Riot application review packet

## Product

Onyx is a free Windows League of Legends companion focused on calm, compact presentation. It combines a pre-game dashboard, a lightweight in-game overlay, official static League artwork, and player-authorized account views.

There are no ads, sponsored placements, betting features, or paid gameplay advantages.

## Current supported data

- Riot Data Dragon: patch version, champion metadata, ability icons, item icons, splash art, and loading art.
- League Client / Live Client Data API: local active-game telemetry for the overlay when League is running.
- Riot API / RSO: planned account identity, rank, and player-authorized data after the product is approved and the correct access is granted.

## Data boundaries

Onyx does not ask players for Riot passwords, store Riot access tokens in the frontend, scrape websites, or call undocumented storefront endpoints.

The Market view currently uses a clearly labeled preview catalog. Live skin-sale rotation, Mythic Shop inventory, and owned cosmetics remain disabled because the public League API documentation does not provide a supported endpoint for those capabilities.

## Review request

Please review Onyx for:

1. Production API access for the supported account and player-data features.
2. Riot Sign On access so a player can authorize their own account without sharing credentials.
3. Guidance on whether any official API or approved partner scope exists for live storefront rotation, Mythic Shop inventory, or owned cosmetics.

## User flow

1. A player opens Onyx and can use the static dashboard and overlay without signing in.
2. For account-linked features, the player selects **Connect Riot ID** and is redirected to Riot Sign On.
3. Riot returns the player to Onyx with an authorization result; Onyx stores only the minimum token/session data needed for the approved scope.
4. If an approved commerce scope is unavailable, Onyx keeps the Market view in preview mode and tells the player why.

## Operational safeguards

- API secrets stay server-side or in an approved native bridge; they are never shipped in browser JavaScript.
- Requests use short timeouts, bounded caches, and visible source/update state.
- Unsupported or revoked scopes fail closed and fall back to preview data.
- New data sources and product features will be submitted for review before public release.

