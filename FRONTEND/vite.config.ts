import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import * as path from "path"; //절대 경로 설정

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "./src") },
      { find: "react", replacement: path.resolve(__dirname, "node_modules/react") },
      { find: "react-dom", replacement: path.resolve(__dirname, "node_modules/react-dom") },
      { find: "react/jsx-runtime", replacement: path.resolve(__dirname, "node_modules/react/jsx-runtime") },
    ],
  },
  server: {
    proxy: {
      "/api": {
        changeOrigin: true,
      },
    },
  },
});
