import SettingsDialog from "./components/SettingsDialog.vue";
import UpdateDialog from "./components/UpdateDialog.vue";
import AppearanceTab from "./components/AppearanceTab.vue";
import DatabaseTab from "./components/DatabaseTab.vue";
import GebineeButton from "./components/GebineeButton.vue";
import GebineeInput from "./components/GebineeInput.vue";
import { errorMessage } from "./utils/error";
import { applyAppearance, isSystemFontName } from "./utils/theme";
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
  registerFontLoader,
  registerCustomFont,
  registerCustomFonts,
};
