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
 */
export function applyAppearance(settings: AppearanceSettings): void {
  const root = document.documentElement;

  // 字体族（加 --gebinee 前缀，避免与消费项目的 --word-font 等冲突）
  // 单词字体与注音字体默认值为 gebinee 内置字体
  root.style.setProperty("--gebinee-word-font", settings.word_font || "gebinee");
  root.style.setProperty("--gebinee-phonetic-font", settings.phonetic_font || "gebinee");
  root.style.setProperty("--gebinee-ui-font", settings.ui_font || "system-ui");

  // 主题
  currentTheme = settings.theme || "auto";
  ensureMediaListener();
  applyTheme(currentTheme);
}

/** 判断字体名是否为系统/内置字体 */
export function isSystemFontName(name: string | null | undefined): boolean {
  return !name || name === "system-ui" || name === "gebinee";
}
