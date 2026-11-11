# Riot data adapter plan

## Adapter layers

| Layer | Source | Status |
| --- | --- | --- |
| Static content | Riot Data Dragon | Active |
| Local match telemetry | League Live Client Data API | Active in desktop bridge |
| Account identity | Riot Sign On | Pending production approval |
| Rank and match history | Riot API | Pending production approval |
| Live sales / Mythic Shop / owned skins | Riot-approved scope only | Disabled |

## Implementation rule

The app uses `src/lib/marketAdapter.ts` as the explicit seam. `PreviewMarketAdapter` is the only enabled commerce provider today. `RiotApprovedMarketAdapter` fails closed until Riot documents and approves a supported endpoint.

When approval exists, the live provider should be a small backend or native bridge that:

- validates the RSO access token server-side;
- requests only the approved scope;
- normalizes data into `MarketSnapshot`;
- includes `source`, `fetchedAt`, region, and an expiry/update time;
- returns a typed unavailable state when the scope is missing or revoked.

Do not put a Riot API key or RSO client secret in Vite environment variables that ship to the browser. `VITE_*` values are public build-time values.

## Approval handoff

After the Riot product is approved, replace `RiotApprovedMarketAdapter.getSnapshot()` with the approved provider and add an integration test for the exact endpoint contract. Keep the preview adapter as an offline fallback.

