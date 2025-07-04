import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      // ✅ Prevent reload when db.json is modified by JSON Server
      ignored: ['**/db.json'],
    },
  },
});
