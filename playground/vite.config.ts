import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const playgroundDir = fileURLToPath(import.meta.url);
const root = resolve(playgroundDir, "..");

export default defineConfig({
  root: root,
  plugins: [vue()],
  resolve: {
    alias: {
      // 直接引用组件库源码，改源码即时生效
      "@gebinee/components": resolve(root, "..", "src", "index.ts"),
      // mock Tauri 相关包，让浏览器环境可预览
      "@tauri-apps/plugin-updater": resolve(root, "src", "mock", "tauri-updater.ts"),
      "@tauri-apps/plugin-process": resolve(root, "src", "mock", "tauri-process.ts"),
      "@tauri-apps/api/app": resolve(root, "src", "mock", "tauri-app.ts"),
    },
  },
  server: {
    port: 5180,
  },
});
