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

/** 应用外观设置到 CSS 变量与主题 */
export function applyAppearance(settings: AppearanceSettings): void {
  const root = document.documentElement;

  // 字体大小
  const fontSize = settings.font_size || 14;
  const sizePx = `${fontSize}px`;
  root.style.setProperty("--font-size", sizePx);
  root.style.setProperty("--el-font-size-base", sizePx);
  root.style.setProperty("--el-font-size-small", `${Math.max(12, fontSize - 2)}px`);
  root.style.setProperty("--el-font-size-large", `${fontSize + 2}px`);

  // 字体族
  root.style.setProperty("--word-font", settings.word_font || "system-ui");
  root.style.setProperty("--phonetic-font", settings.phonetic_font || "system-ui");
  root.style.setProperty("--ui-font", settings.ui_font || "system-ui");
  root.style.setProperty("--el-font-family", settings.ui_font || "system-ui");

  // 主题
  currentTheme = settings.theme || "auto";
  ensureMediaListener();
  applyTheme(currentTheme);
}

/** 判断字体名是否为系统/内置字体 */
export function isSystemFontName(name: string | null | undefined): boolean {
  return !name || name === "system-ui" || name === "gebinee";
}
