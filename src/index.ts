// 组件库自身全局样式（gebinee--btn-green 颜色类、布局、主题变量等）
import "./styles/index.css";

// 用到的 element-plus 组件样式：打包进 dist/style.css，消费者无需再单独引入
// ElementPlusResolver 只扫描消费者模板的 <el-xxx> 标签，不会为组件库内部 import 的组件引入样式
import "element-plus/es/components/button/style/css";
import "element-plus/es/components/input/style/css";
import "element-plus/es/components/dialog/style/css";
import "element-plus/es/components/icon/style/css";
import "element-plus/es/components/form/style/css";
import "element-plus/es/components/form-item/style/css";
import "element-plus/es/components/divider/style/css";
import "element-plus/es/components/radio-group/style/css";
import "element-plus/es/components/radio-button/style/css";
import "element-plus/es/components/select/style/css";
import "element-plus/es/components/option/style/css";
import "element-plus/es/components/progress/style/css";

import SettingsDialog from "./components/SettingsDialog.vue";
import UpdateDialog from "./components/UpdateDialog.vue";
import AppearanceTab from "./components/AppearanceTab.vue";
import DatabaseTab from "./components/DatabaseTab.vue";
import GebineeButton from "./components/GebineeButton.vue";
import GebineeInput from "./components/GebineeInput.vue";
import { errorMessage } from "./utils/error";
import { applyAppearance, isSystemFontName, getDefaultFontOptions, getDefaultFontOptionsCn, detectOS } from "./utils/theme";
import { registerFontLoader, registerCustomFont, registerCustomFonts } from "./utils/font";

export {
  SettingsDialog,
  UpdateDialog,
  AppearanceTab,
  DatabaseTab,
  GebineeButton,
  GebineeInput,
  errorMessage,
  applyAppearance,
  isSystemFontName,
  getDefaultFontOptions,
  getDefaultFontOptionsCn,
  detectOS,
  registerFontLoader,
  registerCustomFont,
  registerCustomFonts,
};

export type {
  AppearanceSettings,
  DatabaseConfig,
  FontOption,
  CustomFont,
  FontLoaderFn,
  ErrorMessageFn,
  SettingsTab,
  ThemeMode,
} from "./types";

export type { OSType } from "./utils/theme";

// noinspection JSUnusedGlobalSymbols
export default {
  SettingsDialog,
  UpdateDialog,
  AppearanceTab,
  DatabaseTab,
  GebineeButton,
  GebineeInput,
  errorMessage,
  applyAppearance,
  isSystemFontName,
  getDefaultFontOptions,
  getDefaultFontOptionsCn,
  detectOS,
  registerFontLoader,
  registerCustomFont,
  registerCustomFonts,
};
