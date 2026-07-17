# @gebinee/components

> Vue 3 + Element Plus 组件库，面向 Tauri 桌面应用，提供设置对话框、自动更新、外观管理、字体注册等开箱即用的能力。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue](https://img.shields.io/badge/Vue-3.5+-42b883.svg)](https://vuejs.org/)
[![Element Plus](https://img.shields.io/badge/Element_Plus-2.14+-409eff.svg)](https://element-plus.org/)

## 特性

- **设置对话框**：带侧边导航的标签式设置面板，内置"数据库 / 外观 / 关于"三个 tab，支持自定义 tab 和细粒度设置项控制
- **自动更新**：基于 `@tauri-apps/plugin-updater` 的更新对话框，状态机驱动，支持 Markdown 更新日志渲染
- **外观管理**：主题模式（浅色/深色/跟随系统）、字体配置（单词/注音/UI）、CSS 变量注入
- **字体注册**：内置 `gebinee` 字体，支持消费项目注册自定义字体
- **GitHub 风格**：按钮采用 GitHub 绿色主题（`#2da44e`），样式 scoped 无全局侵入
- **自包含**：Element Plus 组件样式打包进 `dist/style.css`，消费项目无需额外引入

## 安装

```bash
npm install @gebinee/components
# 或
pnpm add @gebinee/components
```

### peerDependencies

消费项目需自行安装以下依赖：

```bash
npm install vue element-plus @element-plus/icons-vue marked
npm install @tauri-apps/api @tauri-apps/plugin-process @tauri-apps/plugin-updater
```

## 快速上手

```ts
// main.ts
import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "@gebinee/components/style.css";
import App from "./App.vue";

const app = createApp(App);
app.use(ElementPlus);
app.mount("#app");
```

```vue
<!-- App.vue -->
<script setup lang="ts">
import { ref } from "vue";
import { SettingsDialog, type AppearanceSettings, type DatabaseConfig } from "@gebinee/components";

const visible = ref(false);
const appearance = ref<AppearanceSettings>({ theme: "auto", font_size: 16 });
const database = ref<DatabaseConfig>({ db_path: "" });
</script>

<template>
  <SettingsDialog
    v-model:visible="visible"
    v-model:appearance="appearance"
    v-model:database="database"
    :show-database-tab="true"
    :show-appearance-tab="true"
    app-name="我的应用"
    @save="() => visible = false"
  />
</template>
```

## 组件总览

| 组件 | 说明 | 文档 |
|---|---|---|
| `GebineeButton` | ElButton 封装，固定高度 38px，配合 `.gebinee--btn-green` 实现 GitHub 绿色按钮 | [文档](docs/gebinee-button.md) |
| `GebineeInput` | ElInput 封装，字号 18px / placeholder 16px，透传全部插槽 | [文档](docs/gebinee-input.md) |
| `AppearanceTab` | 外观设置表单：主题模式、字体选择、上传字体 | [文档](docs/appearance-tab.md) |
| `DatabaseTab` | 数据库路径设置表单 | [文档](docs/database-tab.md) |
| `SettingsDialog` | 标签式设置对话框，支持自定义 tab 和细粒度设置项控制 | [文档](docs/settings-dialog.md) |
| `UpdateDialog` | Tauri 自动更新对话框，支持 Markdown 更新日志 | [文档](docs/update-dialog.md) |

## 工具函数

| 函数 | 说明 | 文档 |
|---|---|---|
| `errorMessage` | 通用错误信息提取，兼容 Tauri AppError | [文档](docs/utils.md) |
| `applyAppearance` | 应用外观配置到 CSS 变量与主题 | [文档](docs/utils.md) |
| `isSystemFontName` | 判断是否为系统/内置字体 | [文档](docs/utils.md) |
| `registerFontLoader` | 注册字体文件加载器 | [文档](docs/utils.md) |
| `registerCustomFont` | 注册单个自定义字体 | [文档](docs/utils.md) |
| `registerCustomFonts` | 批量注册自定义字体 | [文档](docs/utils.md) |

## 详细文档

- [快速上手](docs/getting-started.md)
- [工具函数](docs/utils.md)
- [BUG 报告与修复说明](docs/bug-report.md)

## 样式说明

组件库样式打包在 `dist/style.css` 中，包含：

- `:root` CSS 变量声明（`--gebinee-font-size`、`--gebinee-word-font` 等）
- `.gebinee` 作用域样式（字体、滚动条）
- `.gebinee--btn-green` / `.gebinee--btn-success-hover` 按钮颜色类
- `.app-layout` / `.app-header` / `.app-main` 布局类
- Element Plus 组件样式（Button、Input、Dialog 等）

> **注意**：组件库不包含全局 reset（`* { box-sizing }` / `html, body { height: 100% }`）。若消费项目需要全高度布局，请自行添加。

## 开发

```bash
# 启动 playground 预览
npm run playground

# 库模式打包
npm run build

# 监听模式打包
npm run dev
```

## License
@gebinee/components 是一款采用 [MIT](LICENSE) 许可证的开源 vue3 组件库。
