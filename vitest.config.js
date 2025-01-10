import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path"; // Nécessaire pour configurer les alias

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./components"), // Définit l'alias @components
    },
  },
  test: {
    globals: true,
    environment: "jsdom", // Simule un environnement DOM
  },
});
