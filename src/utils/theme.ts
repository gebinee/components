// 主题模式应用工具
import type { AppearanceSettings, ThemeMode } from "../types";

let mediaListenerBound = false;
let currentTheme: ThemeMode = "auto";

function applyTheme(theme: ThemeMode): void {
  const root = document.documentElement;
  const setDark = (isDark: boolean) => {
    root.classList.toggle("dark", isDark);
  };

  if (theme === "dark") {
    setDark(true);
  } else if (theme === "light") {
    setDark(false);
  } else {
    // auto: 跟随系统
    setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }
}

// 监听系统主题变化（仅在 auto 模式下生效）
function ensureMediaListener(): void {
  if (mediaListenerBound) return;
  mediaListenerBound = true;
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", (e) => {
    if (currentTheme === "auto") {
      document.documentElement.classList.toggle("dark", e.matches);
    }
  });
}

/**
 * 应用外观设置到 CSS 变量与主题
 *
 * 字体变量统一加 --gebinee 前缀，声明到 :root。
 * 使用者通过 var(--gebinee-word-font) 等引用，不会与项目自身的 --word-font 冲突。
 * 单词字体与注音字体默认值均为 gebinee 内置字体。
 * UI 字体若同时设置了西文字体与中文字体，则合并为 CSS font-family 回退链：
 *   "西文字体", "中文字体", generic-family
 * 浏览器会为每个字符选择第一个有对应字形的字体，实现中西文分别渲染。
 */
export function applyAppearance(settings: AppearanceSettings): void {
  const root = document.documentElement;

  // 字体族（加 --gebinee 前缀，避免与消费项目的 --word-font 等冲突）
  // 单词字体与注音字体默认值为 gebinee 内置字体
  root.style.setProperty("--gebinee-word-font", settings.word_font || "gebinee");
  root.style.setProperty("--gebinee-phonetic-font", settings.phonetic_font || "gebinee");
  root.style.setProperty("--gebinee-ui-font", buildFontFamily(settings.ui_font || "system-ui", settings.ui_font_cn));

  // 主题
  currentTheme = settings.theme || "auto";
  ensureMediaListener();
  applyTheme(currentTheme);
}

/** 根据西文字体推断通用字体族回退值 */
function getGenericFamily(westernFont: string): string {
  const font = westernFont.toLowerCase();
  if (font.includes("times") || font.includes("georgia") || font.includes("cambria") || font.includes("palatino")) return "serif";
  if (font.includes("consolas") || font.includes("courier") || font.includes("mono") || font.includes("lucida console")) return "monospace";
  return "sans-serif";
}

/** 构建 CSS font-family 值：中文字体在前，西文字体在后 */
function buildFontFamily(western: string, cn?: string): string {
  if (!cn) return western;
  const generic = getGenericFamily(western);
  return `"${cn}", "${western}", ${generic}`;
}

/** 判断字体名是否为系统/内置字体 */
export function isSystemFontName(name: string | null | undefined): boolean {
  if (!name) return true;
  const builtins = new Set([
    "system-ui", "gebinee",
    "arial", "georgia", "verdana", "trebuchet ms", "courier new",
  ]);
  return builtins.has(name.toLowerCase());
}
