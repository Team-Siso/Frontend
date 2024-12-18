import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import * as path from "path"; //절대 경로 설정

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "./src") },
      { find: "react", replacement: "react" },
      { find: "react-dom", replacement: "react-dom" },
    ],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://43.203.231.200:8080", // API 서버 주소
        changeOrigin: true,
      },
    },
  },
});

//vite,config.ts
