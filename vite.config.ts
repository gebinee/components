import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { defineConfig, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

/**
 * 内置字体插件（仅 build 时生效）：
 * 1. transform 阶段：把 builtin-font.ts 中指向源码字体文件的 new URL 改写为 ./assets/aaae.ttf，
 *    阻止 vite 库模式将其内联为 base64。
 * 2. generateBundle 阶段：把字体文件 emit 到 dist/assets/aaae.ttf。
 */
function emitBuiltinFont(): Plugin {
  const fontSrcPath = resolve(rootDir, "src/assets/fonts/aaae.ttf");
  const fontDistPath = "assets/aaae.ttf";
  // 匹配 new URL("../assets/fonts/aaae.ttf", import.meta.url)
  const sourceUrlPattern = /new URL\(["']\.\.\/assets\/fonts\/aaae\.ttf["'],\s*import\.meta\.url\)/g;

  return {
    name: "emit-builtin-font",
    apply: "build",
    transform(code, id) {
      if (id.includes("builtin-font")) {
        return code.replace(sourceUrlPattern, `new URL("./${fontDistPath}", import.meta.url)`);
      }
      return null;
    },
    generateBundle() {
      const fontContent = readFileSync(fontSrcPath);
      this.emitFile({
        type: "asset",
        fileName: fontDistPath,
        source: fontContent,
      });
    },
  };
}

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: "./tsconfig.json",
      include: ["src"],
      exclude: ["src/styles"],
      cleanVueFileName: true,
    }),
    emitBuiltinFont(),
  ],
  build: {
    lib: {
      entry: resolve(rootDir, "src/index.ts"),
      name: "GebineeComponents",
      fileName: "index",
      formats: ["es"],
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: [
        "vue",
        "element-plus",
        "@element-plus/icons-vue",
        "marked",
        /^@tauri-apps\//,
      ],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "style.css";
          }
          return "assets/[name][extname]";
        },
      },
    },
  },
});
