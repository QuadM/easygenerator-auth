
import { defineConfig, loadEnv } from 'vite';
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({mode})=>{
  const env = loadEnv(mode, process.cwd());
  return {
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },define: {
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
      // Expose all env variables (not recommended for secrets)
      // 'process.env': env
    },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
}
});
