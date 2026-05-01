import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // This exposes the project to your local network
    port: 5173, // Optional: keeps it on your preferred port
     watch: {
      usePolling: true,
    },
  },
});