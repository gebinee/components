import SettingsDialog from "./components/SettingsDialog.vue";
import UpdateDialog from "./components/UpdateDialog.vue";
import AppearanceTab from "./components/AppearanceTab.vue";
import DatabaseTab from "./components/DatabaseTab.vue";
import { errorMessage } from "./utils/error.js";
import { applyAppearance, isSystemFontName } from "./utils/theme.js";
import { registerFontLoader, registerCustomFont, registerCustomFonts } from "./utils/font.js";

export {
  SettingsDialog,
  UpdateDialog,
  AppearanceTab,
  DatabaseTab,
  errorMessage,
  applyAppearance,
  isSystemFontName,
  registerFontLoader,
  registerCustomFont,
  registerCustomFonts,
};
export default {
  SettingsDialog,
  UpdateDialog,
  AppearanceTab,
  DatabaseTab,
  errorMessage,
  applyAppearance,
  isSystemFontName,
  registerFontLoader,
  registerCustomFont,
  registerCustomFonts,
};