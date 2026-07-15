// 字体注册工具
// 消费项目需提供读取字体 data URL 的函数，通过 registerFontLoader 注册
import type { CustomFont, FontLoaderFn } from "../types";

const injectedFonts = new Set<string>();
let fontLoaderFn: FontLoaderFn | null = null;

function injectFontFace(name: string, url: string, format = "truetype"): void {
  const id = `fontface-${name}`;
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `@font-face { font-family: '${name}'; src: url('${url}') format('${format}'); }`;
  document.head.appendChild(style);
}

/** 注册字体加载器（消费项目在初始化时调用） */
export function registerFontLoader(fn: FontLoaderFn): void {
  fontLoaderFn = fn;
}

/** 注册一个自定义字体 */
export async function registerCustomFont(font: CustomFont): Promise<void> {
  if (!font || injectedFonts.has(font.name) || !fontLoaderFn) return;
  const dataUrl = await fontLoaderFn(font.file_path);
  const ext = (font.file_path.split(".").pop() || "ttf").toLowerCase();
  const format =
    ext === "woff2" ? "woff2" : ext === "woff" ? "woff" : ext === "otf" ? "opentype" : "truetype";
  injectFontFace(font.name, dataUrl, format);
  injectedFonts.add(font.name);
}

/** 批量注册自定义字体 */
export async function registerCustomFonts(
  fonts: CustomFont[] | null | undefined,
): Promise<void> {
  if (!fonts) return;
  for (const f of fonts) {
    try {
      await registerCustomFont(f);
    } catch (e) {
      console.error("注册字体失败:", f.name, e);
    }
  }
}
