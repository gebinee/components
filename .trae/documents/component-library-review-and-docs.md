# 组件库梳理、BUG 修复与文档编写计划

## 一、任务概要

对 `@gebinee/components` (v1.2.4) 组件库进行：
1. 组件及功能梳理（交付到文档）
2. BUG 检查与修复（修改源码）
3. `SettingsDialog` 可定制性增强（按用户要求：内置 tab 的设置项可单独控制显隐 + 可追加自定义设置项）
4. 编写文档（根目录 `README.md` + `docs/` 目录分文件）

---

## 二、组件库现状分析

### 技术栈
- Vue 3.5+ / Element Plus 2.14+ / Tauri 2 / TypeScript / Vite 6 / marked
- 库模式打包（ES 格式），CSS 不拆分（单 `style.css`），字体文件通过 vite 插件 emit
- peerDependencies：vue, element-plus, @element-plus/icons-vue, marked, @tauri-apps/*

### 组件清单（6 个）

| 组件 | 文件 | 职责 |
|---|---|---|
| `GebineeButton` | [src/components/GebineeButton.vue](file:///d:/workspace/gebinee/components/src/components/GebineeButton.vue) | ElButton 封装，固定高度 38px / 字号 16px，配合 `.btn-green` 类实现 GitHub 绿色按钮 |
| `GebineeInput` | [src/components/GebineeInput.vue](file:///d:/workspace/gebinee/components/src/components/GebineeInput.vue) | ElInput 封装，字号 18px / placeholder 16px，透传全部具名插槽 |
| `AppearanceTab` | [src/components/AppearanceTab.vue](file:///d:/workspace/gebinee/components/src/components/AppearanceTab.vue) | 外观设置表单：主题模式、单词/注音/UI 字体选择、上传字体按钮 |
| `DatabaseTab` | [src/components/DatabaseTab.vue](file:///d:/workspace/gebinee/components/src/components/DatabaseTab.vue) | 数据库路径设置表单：路径输入 + 选择按钮 |
| `SettingsDialog` | [src/components/SettingsDialog.vue](file:///d:/workspace/gebinee/components/src/components/SettingsDialog.vue) | 带侧边栏的标签式设置对话框，内置"数据库/外观/关于"tab + 自定义 tab |
| `UpdateDialog` | [src/components/UpdateDialog.vue](file:///d:/workspace/gebinee/components/src/components/UpdateDialog.vue) | Tauri 自动更新对话框，状态机驱动（checking→available→downloading→installing） |

### 工具函数清单（4 模块）

| 函数 | 文件 | 职责 |
|---|---|---|
| `errorMessage` | [src/utils/error.ts](file:///d:/workspace/gebinee/components/src/utils/error.ts) | 通用错误信息提取，兼容 Tauri AppError 风格 |
| `applyAppearance` | [src/utils/theme.ts](file:///d:/workspace/gebinee/components/src/utils/theme.ts) | 将 AppearanceSettings 应用到 CSS 变量与 .dark 主题 |
| `isSystemFontName` | [src/utils/theme.ts](file:///d:/workspace/gebinee/components/src/utils/theme.ts) | 判断是否为系统/内置字体 |
| `registerFontLoader` / `registerCustomFont` / `registerCustomFonts` | [src/utils/font.ts](file:///d:/workspace/gebinee/components/src/utils/font.ts) | 自定义字体注册（消费项目提供文件读取函数） |

### 样式文件

| 文件 | 职责 |
|---|---|
| [src/styles/base.css](file:///d:/workspace/gebinee/components/src/styles/base.css) | 全局 reset + `:root` 变量声明 + `.gebinee` 作用域 + 滚动条 |
| [src/styles/button.css](file:///d:/workspace/gebinee/components/src/styles/button.css) | `.btn-green`（GitHub 绿色实心）+ `.btn-success-hover`（浅色 hover 变绿） |
| [src/styles/layout.css](file:///d:/workspace/gebinee/components/src/styles/layout.css) | `.app-layout` / `.app-header` / `.app-main` 布局类 |
| [src/styles/index.css](file:///d:/workspace/gebinee/components/src/styles/index.css) | 汇总导入以上三个文件 |

---

## 三、发现的 BUG 与问题

### BUG-1：`button.css` 存在无效 CSS 变量与遗留调试注释
- **文件**：[src/styles/button.css](file:///d:/workspace/gebinee/components/src/styles/button.css#L7-L14)
- **问题**：
  - `--el-button-active-color` 不是 Element Plus 的有效按钮 CSS 变量（有效的是 `--el-button-active-text-color` / `-bg-color` / `-border-color`，已存在）。此行无效。
  - `--el-button-outline-color` 和 `--el-button-hover-link-text-color` 对 ElButton 无实际效果，属于不确定的遗留代码。
  - 三处 `/* 干嘛的这个 */` 调试注释表明开发时对变量作用不确定。
- **修复**：删除无效的 `--el-button-active-color`、`--el-button-outline-color`、`--el-button-hover-link-text-color` 三行及调试注释。

### BUG-2：`UpdateDialog.vue` 在模块加载时修改全局 `marked` 配置
- **文件**：[src/components/UpdateDialog.vue](file:///d:/workspace/gebinee/components/src/components/UpdateDialog.vue#L40-L43)
- **问题**：`marked.setOptions({ gfm: true, breaks: true })` 在 `<script setup>` 顶层执行（模块加载时），会全局修改 `marked` 的配置。若消费项目也使用 `marked` 且需要不同配置（如不启用 `breaks`），会被覆盖。
- **修复**：改为在 `releaseNotesHtml` computed 内使用 `marked.parse(body, { gfm: true, breaks: true })` 传参方式，不修改全局配置。

### BUG-3：`UpdateDialog.vue` 的 `onCheck()` 存在竞态条件
- **文件**：[src/components/UpdateDialog.vue](file:///d:/workspace/gebinee/components/src/components/UpdateDialog.vue#L65-L82)
- **问题**：对话框每次 `@open` 都调用 `onCheck()`。若用户快速关闭再打开对话框，前一次 `check()` 的 Promise 可能尚未完成，两次检查并发执行，后完成的可能覆盖先完成的结果状态。
- **修复**：引入 `checkSeq` 序号，每次 `onCheck` 递增并捕获当前序号；`check()` resolve/reject 时比对序号，仅处理最新一次的结果。

### BUG-4：`base.css` 全局 reset 侵入消费项目
- **文件**：[src/styles/base.css](file:///d:/workspace/gebinee/components/src/styles/base.css#L4-L14)
- **问题**：注释写"非侵入性"，但 `* { box-sizing: border-box }` 和 `html, body, #app { height: 100%; margin: 0; padding: 0 }` 是全局规则，会覆盖消费项目自身的 reset / layout。与用户偏好"组件样式 scoped 无全局侵入"矛盾。
- **修复**：
  - 删除全局 reset（`*` 和 `html, body, #app` 规则）
  - 保留 `:root` 变量声明（CSS 自定义属性天然全局，但不影响渲染）
  - 保留 `.gebinee` 作用域样式
  - 在文档中说明：若需要全高度布局，消费项目应自行添加 `html, body, #app { height: 100% }`

### BUG-5：`SettingsDialog.vue` 关于 tab 的应用图标颜色硬编码为蓝色
- **文件**：[src/components/SettingsDialog.vue](file:///d:/workspace/gebinee/components/src/components/SettingsDialog.vue#L215)
- **问题**：`<el-icon :size="40" color="#409eff">` 使用 Element Plus 默认蓝色，与项目 GitHub 绿色主题（`#2da44e`）不一致。`UpdateDialog` 内的成功图标已统一使用 `#2da44e`，此处遗漏。
- **修复**：新增 `iconColor` prop（默认 `#2da44e`），替换硬编码。

### BUG-6：`font.ts` 的 `registerCustomFont` 在加载器未注册时静默失败
- **文件**：[src/utils/font.ts](file:///d:/workspace/gebinee/components/src/utils/font.ts#L24)
- **问题**：`if (!font || injectedFonts.has(font.name) || !fontLoaderFn) return;` — 当 `fontLoaderFn` 为 null 时静默返回，调用方无法感知注册失败。
- **修复**：当 `!fontLoaderFn` 时 `console.warn` 提示"字体加载器未注册，请先调用 registerFontLoader()"。

### BUG-7：`AppearanceSettings.font_size` 在 AppearanceTab 中无对应 UI
- **文件**：[src/components/AppearanceTab.vue](file:///d:/workspace/gebinee/components/src/components/AppearanceTab.vue)
- **问题**：`AppearanceSettings` 类型含 `font_size` 字段，`applyAppearance()` 会应用它，但 `AppearanceTab` 没有任何 UI 控件来设置它。
- **处理**：本次不新增 UI（避免超出需求范围），仅在文档中说明此字段需由消费项目通过其他方式设置。在 BUG 报告中记录为"功能缺口"。

---

## 四、SettingsDialog 可定制性增强

### 背景
用户要求：内置 tab（外观、数据库）的设置项应可由消费项目控制显隐，并支持追加自定义设置项。当前内置 tab 内容完全写死，无法定制。

### 改动方案

#### 4.1 `AppearanceTab.vue` — 新增细粒度显隐 props + 默认插槽

新增 props（均默认 `true`，保持向后兼容）：
```ts
showTheme?: boolean;        // 主题模式单选组
showWordFont?: boolean;     // 单词字体下拉
showPhoneticFont?: boolean; // 注音字体下拉
showUiFont?: boolean;       // UI 字体下拉
showFontUpload?: boolean;   // 上传字体按钮
```

新增插槽：
- 默认插槽 `<slot />`：渲染在表单末尾，供消费项目追加自定义设置项

模板用 `v-if` 包裹各分区，表单底部放默认插槽。

#### 4.2 `DatabaseTab.vue` — 新增显隐 prop + 默认插槽

新增 prop（默认 `true`）：
```ts
showPath?: boolean;  // 数据库路径输入行
```

新增插槽：
- 默认插槽 `<slot />`：渲染在表单末尾

#### 4.3 `SettingsDialog.vue` — 透传细粒度 props + 透传插槽

新增 props（透传给内置 tab）：
```ts
// AppearanceTab 透传
showTheme?: boolean;
showWordFont?: boolean;
showPhoneticFont?: boolean;
showUiFont?: boolean;
showFontUpload?: boolean;
// DatabaseTab 透传
showPath?: boolean;
```

在内置 tab 渲染处透传 props 和插槽：
```vue
<AppearanceTab
  v-model="appearanceProxy"
  :font-options="fontOptions"
  :show-theme="showTheme"
  :show-word-font="showWordFont"
  :show-phonetic-font="showPhoneticFont"
  :show-ui-font="showUiFont"
  :show-font-upload="showFontUpload"
  @pick-font-file="emit('pick-font-file')"
>
  <slot name="appearance-extra" />
</AppearanceTab>

<DatabaseTab
  v-model="databaseProxy"
  :placeholder="placeholder"
  :show-path="showPath"
  @pick-database-file="emit('pick-database-file')"
>
  <slot name="database-extra" />
</DatabaseTab>
```

同时为 `DatabaseTab` 新增 `placeholder` prop 透传（当前 `SettingsDialog` 未将 `placeholder` 传给 `DatabaseTab`，这也是一个小遗漏）。

---

## 五、文档结构

### 文件清单

```
README.md                        # 项目首页：简介、安装、快速上手、组件总览表、链接
docs/
  getting-started.md             # 安装、peerDependencies、样式引入、快速上手示例
  gebinee-button.md              # GebineeButton 文档（Props/Slots/样式类/示例）
  gebinee-input.md               # GebineeInput 文档（Props/Slots/样式/示例）
  appearance-tab.md              # AppearanceTab 文档（含新增细粒度 props）
  database-tab.md                # DatabaseTab 文档（含新增 props）
  settings-dialog.md             # SettingsDialog 文档（含自定义 tab、细粒度控制）
  update-dialog.md               # UpdateDialog 文档（状态机、Props/Events/示例）
  utils.md                       # 工具函数文档（errorMessage/applyAppearance/font 注册）
  bug-report.md                  # BUG 报告：发现的问题与修复说明
```

### 每个组件文档包含
- 功能描述
- Props 表格（名/类型/默认/说明）
- Events 表格
- Slots 表格
- 样式类说明（如 `.btn-green`）
- 代码示例
- 注意事项

---

## 六、实施步骤

### 步骤 1：修复 BUG-1 — `button.css` 清理
- 编辑 [src/styles/button.css](file:///d:/workspace/gebinee/components/src/styles/button.css)
- 删除 3 行无效 CSS 变量及调试注释

### 步骤 2：修复 BUG-2 — `UpdateDialog.vue` marked 配置局部化
- 编辑 [src/components/UpdateDialog.vue](file:///d:/workspace/gebinee/components/src/components/UpdateDialog.vue)
- 删除顶层 `marked.setOptions(...)` 调用
- 在 `releaseNotesHtml` computed 内改为 `marked.parse(body, { gfm: true, breaks: true })`

### 步骤 3：修复 BUG-3 — `UpdateDialog.vue` 竞态条件
- 编辑 [src/components/UpdateDialog.vue](file:///d:/workspace/gebinee/components/src/components/UpdateDialog.vue)
- 新增 `checkSeq` ref，`onCheck` 内捕获序号，回调中比对

### 步骤 4：修复 BUG-4 — `base.css` 去全局 reset
- 编辑 [src/styles/base.css](file:///d:/workspace/gebinee/components/src/styles/base.css)
- 删除 `* {}` 和 `html, body, #app {}` 规则
- 保留 `:root` 变量和 `.gebinee` 作用域

### 步骤 5：修复 BUG-5 — `SettingsDialog.vue` 图标颜色
- 编辑 [src/components/SettingsDialog.vue](file:///d:/workspace/gebinee/components/src/components/SettingsDialog.vue)
- 新增 `iconColor` prop（默认 `#2da44e`），替换硬编码 `#409eff`

### 步骤 6：修复 BUG-6 — `font.ts` 加载器未注册警告
- 编辑 [src/utils/font.ts](file:///d:/workspace/gebinee/components/src/utils/font.ts)
- `!fontLoaderFn` 分支改为 `console.warn` 后 return

### 步骤 7：增强 `AppearanceTab.vue` 可定制性
- 编辑 [src/components/AppearanceTab.vue](file:///d:/workspace/gebinee/components/src/components/AppearanceTab.vue)
- 新增 5 个 `showXxx` props
- 用 `v-if` 包裹各分区
- 表单底部添加默认插槽

### 步骤 8：增强 `DatabaseTab.vue` 可定制性
- 编辑 [src/components/DatabaseTab.vue](file:///d:/workspace/gebinee/components/src/components/DatabaseTab.vue)
- 新增 `showPath` prop
- 表单底部添加默认插槽

### 步骤 9：增强 `SettingsDialog.vue` 透传
- 编辑 [src/components/SettingsDialog.vue](file:///d:/workspace/gebinee/components/src/components/SettingsDialog.vue)
- 新增 6 个透传 props（5 个 Appearance + 1 个 Database）+ `placeholder` 透传
- 新增 `appearance-extra` / `database-extra` 插槽透传
- 在内置 tab 渲染处绑定 props 和插槽

### 步骤 10：编写文档
- 创建 `README.md`（根目录）
- 创建 `docs/` 目录及 9 个文档文件

### 步骤 11：验证
- 运行 `npm run build` 确认库打包无报错
- 运行 `npm run playground` 确认 playground 正常预览（手动验证）

---

## 七、假设与决策

1. **文档语言**：中文（与用户沟通语言一致）
2. **向后兼容**：所有新增 props 默认值与当前行为一致（`showXxx` 默认 `true`），不影响现有消费项目
3. **不新增 `font_size` UI**：BUG-7 仅记录不修复，避免超出需求范围
4. **`base.css` reset 移除后**：消费项目需自行处理全高度布局，文档中说明
5. **不改动 `tsconfig.json` / `vite.config.ts`**：打包配置无需修改
6. **不改动 playground demo**：playground 不受影响（playground 的 `App.vue` 自带 reset）

---

## 八、验证方式

1. `npm run build` — 确认 TypeScript 编译和库打包无报错
2. `npm run playground` — 启动预览，手动验证：
   - GebineeButton 绿色按钮样式正常
   - UpdateDialog 各状态正常（available / noUpdate / error）
   - SettingsDialog 内置 tab 正常显示
   - SettingsDialog 新增 `showXxx="false"` 后对应设置项隐藏
3. 检查 `dist/` 产物中 `style.css` 不再包含全局 reset
