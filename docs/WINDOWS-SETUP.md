# Run Onyx on Windows

## Requirements
- Windows 10 or 11, 64-bit
- Node.js 22 or newer (Node.js 26 is also acceptable)
- npm (installed with Node.js)

## Run the development preview
Open PowerShell in the repository folder (the folder containing `package.json`).

Check Node and npm:
```powershell
node -v
npm -v
```

Review and approve the esbuild dependency install script:
```powershell
npm install-scripts approve esbuild
npm install
```

Start the preview:
```powershell
npm run dev
```

Open http://127.0.0.1:1420 in your browser. Keep the PowerShell window open while using the preview. Press Ctrl+C in that window to stop it.

## Get the newest code
The GitHub pull request branch is `feat/onyx-foundation`. Download its ZIP from:
https://github.com/gizmoshifter/Onyx/archive/refs/heads/feat/onyx-foundation.zip

Extract the ZIP to a new folder before running `npm install`.

## Windows desktop installer
GitHub Actions is configured to build Windows installers and attach them as a workflow artifact when the Windows build succeeds. The installer is not considered ready until that job finishes successfully.

## Current limitations
- The current interface is a foundation preview.
- Champion win-rate figures shown in the preview are illustrative placeholders, not live statistics.
- Live League Client integration, patch-aware matchup data, and the in-game overlay are not implemented yet.
