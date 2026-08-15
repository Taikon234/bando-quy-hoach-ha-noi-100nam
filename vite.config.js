import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/bando-quy-hoach-ha-noi-100nam/",
  optimizeDeps: {
    exclude: ["maplibre-gl"],
  },
});
