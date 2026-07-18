// 主题模式应用工具
import type { AppearanceSettings, FontOption, ThemeMode } from "../types";

/** 检测当前操作系统 */
export type OSType = "windows" | "macos" | "linux";

export function detectOS(): OSType {
  if (typeof navigator === "undefined") return "windows";
  const p = (navigator.platform || "").toLowerCase();
  if (p.includes("win")) return "windows";
  if (p.includes("mac")) return "macos";
  return "linux";
}

/** 各平台共用的西文字体 */
const COMMON_FONTS: FontOption[] = [
  { label: "系统默认", value: "system-ui" },
  { label: "Gebinee 字体", value: "gebinee" },
  { label: "Arial", value: "Arial" },
  { label: "Georgia", value: "Georgia" },
  { label: "Verdana", value: "Verdana" },
  { label: "Trebuchet MS", value: "Trebuchet MS" },
  { label: "Courier New", value: "Courier New" },
];

/** 平台专属西文字体 */
const PLATFORM_FONTS: Record<OSType, FontOption[]> = {
  windows: [
    { label: "Consolas", value: "Consolas" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Segoe UI", value: "Segoe UI" },
  ],
  macos: [
    { label: "Helvetica", value: "Helvetica" },
    { label: "Monaco", value: "Monaco" },
    { label: "Menlo", value: "Menlo" },
  ],
  linux: [
    { label: "DejaVu Sans", value: "DejaVu Sans" },
    { label: "DejaVu Sans Mono", value: "DejaVu Sans Mono" },
    { label: "Liberation Sans", value: "Liberation Sans" },
    { label: "Liberation Serif", value: "Liberation Serif" },
  ],
};

/** 平台专属中文字体 */
const PLATFORM_CN_FONTS: Record<OSType, FontOption[]> = {
  windows: [
    { label: "微软雅黑", value: "微软雅黑" },
    { label: "宋体", value: "宋体" },
    { label: "楷体", value: "楷体" },
    { label: "仿宋", value: "仿宋" },
    { label: "黑体", value: "黑体" },
  ],
  macos: [
    { label: "PingFang SC", value: "PingFang SC" },
    { label: "Heiti SC", value: "Heiti SC" },
    { label: "STKaiti", value: "STKaiti" },
    { label: "STSong", value: "STSong" },
  ],
  linux: [
    { label: "Noto Sans CJK SC", value: "Noto Sans CJK SC" },
    { label: "Noto Serif CJK SC", value: "Noto Serif CJK SC" },
  ],
};

/** 获取当前平台的默认西文字体选项 */
export function getDefaultFontOptions(): FontOption[] {
  const os = detectOS();
  return [...COMMON_FONTS, ...PLATFORM_FONTS[os]];
}

/** 获取当前平台的默认中文字体选项（"系统默认" 始终在第一项） */
export function getDefaultFontOptionsCn(): FontOption[] {
  const os = detectOS();
  return [{ label: "系统默认", value: "" }, ...PLATFORM_CN_FONTS[os]];
}

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

/** 构建 CSS font-family 值：西文在前，中文在后。
 *  system-ui 通过字体链接包含 CJK 字形，会阻止中文字体回退，
 *  此时替换为不含 CJK 的无衬线栈确保中文字体生效。 */
function buildFontFamily(western: string, cn?: string): string {
  if (!cn) return western;
  let effective = western;
  if (western === "system-ui") {
    effective = "Arial, Helvetica, sans-serif";
  }
  const generic = getGenericFamily(effective);
  return `"${effective}", "${cn}", ${generic}`;
}

/** 判断字体名是否为系统/内置字体 */
export function isSystemFontName(name: string | null | undefined): boolean {
  if (!name) return true;
  const builtins = new Set([
    // 跨平台
    "system-ui", "gebinee",
    "arial", "georgia", "verdana", "trebuchet ms", "courier new",
    // Windows
    "consolas", "times new roman", "segoe ui",
    "微软雅黑", "宋体", "楷体", "仿宋", "黑体",
    // macOS
    "helvetica", "monaco", "menlo",
    "pingfang sc", "heiti sc", "stkaiti", "stsong",
    // Linux
    "dejavu sans", "dejavu sans mono", "liberation sans", "liberation serif",
    "noto sans cjk sc", "noto serif cjk sc",
  ]);
  return builtins.has(name.toLowerCase());
}
