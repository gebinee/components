# 快速上手

## 前置条件

消费项目需基于以下技术栈：

| 依赖 | 版本 | 说明 |
|---|---|---|
| Vue | ^3.5.39 | 框架 |
| Element Plus | ^2.14.3 | UI 组件库 |
| @element-plus/icons-vue | ^2.3.2 | 图标 |
| marked | ^18.0.6 | Markdown 解析（UpdateDialog 使用） |
| @tauri-apps/api | ^2 | Tauri 核心 API |
| @tauri-apps/plugin-process | ^2 | 应用重启 |
| @tauri-apps/plugin-updater | ^2 | 自动更新 |

> 若消费项目不使用 UpdateDialog，可省略 Tauri 相关依赖。但组件库导出时会引用这些包，未安装会导致构建报错。

## 安装

```bash
npm install @gebinee/components
```

## 引入样式

```ts
// main.ts
import "@gebinee/components/style.css";
```

该样式文件已包含组件库自身样式 + 所用 Element Plus 组件样式，无需再单独引入 Element Plus 组件样式。

> 若消费项目已全量引入 `element-plus/dist/index.css`，两者会重复但不会冲突（后者覆盖前者，最终以引入顺序为准）。

## 全高度布局

组件库**不包含**全局 reset。若消费项目需要全高度布局（如使用 `.app-layout`），请自行添加：

```css
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}
* {
  box-sizing: border-box;
}
```

## 基础示例

### 1. 使用设置对话框

```vue
<script setup lang="ts">
import { ref } from "vue";
import {
  SettingsDialog,
  type AppearanceSettings,
  type DatabaseConfig,
  type FontOption,
} from "@gebinee/components";

const visible = ref(false);
const saving = ref(false);

const appearance = ref<AppearanceSettings>({
  font_size: 16,
  word_font: "system-ui",
  phonetic_font: "system-ui",
  ui_font: "system-ui",
  theme: "auto",
});

const database = ref<DatabaseConfig>({ db_path: "" });

const fontOptions: FontOption[] = [
  { label: "系统默认", value: "system-ui" },
  { label: "微软雅黑", value: "Microsoft YaHei" },
];

function onSave() {
  saving.value = true;
  // 保存逻辑...
  setTimeout(() => {
    saving.value = false;
    visible.value = false;
  }, 1000);
}
</script>

<template>
  <SettingsDialog
    v-model:visible="visible"
    v-model:appearance="appearance"
    v-model:database="database"
    :font-options="fontOptions"
    :show-database-tab="true"
    :show-appearance-tab="true"
    app-name="我的应用"
    :saving="saving"
    @save="onSave"
    @pick-database-file="() => console.log('选择数据库文件')"
    @pick-font-file="() => console.log('选择字体文件')"
  />
</template>
```

### 2. 应用外观配置

```ts
import { applyAppearance, type AppearanceSettings } from "@gebinee/components";

const settings: AppearanceSettings = {
  font_size: 16,
  word_font: "gebinee",
  phonetic_font: "gebinee",
  ui_font: "system-ui",
  theme: "dark",
};

applyAppearance(settings);
```

`applyAppearance` 会设置以下 CSS 变量到 `:root`：

| CSS 变量 | 来源字段 | 默认值 |
|---|---|---|
| `--gebinee-font-size` | `font_size` | `14px` |
| `--gebinee-word-font` | `word_font` | `gebinee` |
| `--gebinee-phonetic-font` | `phonetic_font` | `gebinee` |
| `--gebinee-ui-font` | `ui_font` | `system-ui` |
| `--el-font-family` | `ui_font` | `system-ui` |

在消费项目模板中通过 `var(--gebinee-word-font)` 等引用字体：

```vue
<template>
  <div class="gebinee">
    <span class="word" :style="{ fontFamily: 'var(--gebinee-word-font)' }">hello</span>
    <span class="phonetic" :style="{ fontFamily: 'var(--gebinee-phonetic-font)' }">/həˈloʊ/</span>
  </div>
</template>
```

### 3. 注册自定义字体

```ts
import {
  registerFontLoader,
  registerCustomFonts,
  type CustomFont,
} from "@gebinee/components";

// 1. 注册字体加载器（消费项目提供读取文件的能力）
registerFontLoader(async (filePath: string): Promise<string> => {
  // 返回字体的 data URL（base64）
  // 例如通过 Tauri 的 fs 插件读取字体文件并转为 data URL
  const bytes = await readFile(filePath);
  return `data:font/ttf;base64,${bytesToBase64(bytes)}`;
});

// 2. 注册自定义字体
const fonts: CustomFont[] = [
  { name: "MyFont", file_path: "/path/to/my-font.ttf" },
];
await registerCustomFonts(fonts);
```

注册后即可在 `fontOptions` 中使用 `MyFont` 作为字体值，或在 CSS 中通过 `font-family: 'MyFont'` 引用。

## 内置字体

组件库内置 `gebinee` 字体（`src/assets/fonts/aaae.ttf`），在引入 `@gebinee/components` 时自动注入 `@font-face`。可直接在 `fontOptions` 中使用 `gebinee` 作为字体值。

## TypeScript 类型

组件库导出以下类型：

```ts
import type {
  AppearanceSettings,
  DatabaseConfig,
  FontOption,
  CustomFont,
  FontLoaderFn,
  ErrorMessageFn,
  SettingsTab,
  ThemeMode,
} from "@gebinee/components";
```

| 类型 | 说明 |
|---|---|
| `ThemeMode` | `"light" \| "dark" \| "auto"` |
| `AppearanceSettings` | 外观配置（font_size / word_font / phonetic_font / ui_font / theme） |
| `DatabaseConfig` | 数据库配置（db_path） |
| `FontOption` | 字体下拉选项（label / value） |
| `CustomFont` | 自定义字体注册项（name / file_path） |
| `FontLoaderFn` | 字体加载器函数类型 |
| `ErrorMessageFn` | 错误信息提取函数类型 |
| `SettingsTab` | 自定义设置 tab（name / label / icon / builtin） |
