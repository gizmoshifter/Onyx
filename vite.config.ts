import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    strictPort: true,
    port: 1420,
    proxy: {
      "/liveclient": {
        target: "https://127.0.0.1:2999",
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/liveclient/, "")
      }
    }
  }
});
