import type { Component } from "vue";

/** 主题模式 */
export type ThemeMode = "light" | "dark" | "auto";

/** 外观配置（v-model:appearance） */
export interface AppearanceSettings {
  word_font?: string;
  phonetic_font?: string;
  ui_font?: string;
  theme?: ThemeMode;
}

/** 数据库配置（v-model:database） */
export interface DatabaseConfig {
  db_path?: string;
}

/** 字体下拉选项 */
export interface FontOption {
  label: string;
  value: string;
}

/** 自定义字体注册项 */
export interface CustomFont {
  name: string;
  file_path: string;
}

/** 字体加载器：按文件路径返回 data URL */
export type FontLoaderFn = (filePath: string) => Promise<string>;

/** 错误信息提取函数 */
export type ErrorMessageFn = (e: unknown) => string;

/** 设置对话框自定义 tab */
export interface SettingsTab {
  name: string;
  label: string;
  icon?: Component;
  builtin?: boolean;
  [key: string]: unknown;
}
