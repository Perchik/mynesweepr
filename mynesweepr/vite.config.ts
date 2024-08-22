import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env": {}, // Ensures libraries don't attempt to access Node.js environment variables
  },
  optimizeDeps: {
    include: ["seedrandom"], // Explicitly include seedrandom if necessary
  },
});
