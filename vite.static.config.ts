// Standalone static SPA build for Vercel / GitHub Pages.
// Independent from the Lovable TanStack Start build (vite.config.ts).
// Run with: npm run build:static  -> outputs to dist-static/
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

// GH Pages serves under /<repo-name>/, Vercel serves at root.
// Set BASE_PATH=/Muhammad-Ammar-resume-website/ in the GH Action.
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  build: {
    outDir: "dist-static",
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "index.static.html"),
    },
  },
});
