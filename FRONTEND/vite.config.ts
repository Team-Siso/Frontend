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
        target: "https://siiso.site", // API 서버 주소
        changeOrigin: true,
      },
    },
  },
});
