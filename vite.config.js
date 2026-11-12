import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Custom domain (public/CNAME) is served from the root, so base stays "/".
export default defineConfig({
  plugins: [react()],
  base: "/",
});
