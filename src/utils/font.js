// 字体注册工具
// 消费项目需提供读取字体 data URL 的函数，通过 registerFontLoader 注册

const injectedFonts = new Set();
let fontLoaderFn = null;

function injectFontFace(name, url, format = "truetype") {
  const id = `fontface-${name}`;
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `@font-face { font-family: '${name}'; src: url('${url}') format('${format}'); }`;
  document.head.appendChild(style);
}

/**
 * 注册字体加载器（消费项目在初始化时调用）
 * @param {(filePath: string) => Promise<string>} fn - 返回字体文件的 data URL
 */
export function registerFontLoader(fn) {
  fontLoaderFn = fn;
}

/**
 * 注册一个自定义字体
 * @param {{ name: string, file_path: string }} font
 */
export async function registerCustomFont(font) {
  if (!font || injectedFonts.has(font.name) || !fontLoaderFn) return;
  const dataUrl = await fontLoaderFn(font.file_path);
  const ext = (font.file_path.split(".").pop() || "ttf").toLowerCase();
  const format = ext === "woff2" ? "woff2" : ext === "woff" ? "woff" : ext === "otf" ? "opentype" : "truetype";
  injectFontFace(font.name, dataUrl, format);
  injectedFonts.add(font.name);
}

/** 批量注册自定义字体 */
export async function registerCustomFonts(fonts) {
  if (!fonts) return;
  for (const f of fonts) {
    try {
      await registerCustomFont(f);
    } catch (e) {
      console.error("注册字体失败:", f.name, e);
    }
  }
}