# SettingsDialog

带侧边导航的标签式设置对话框。内置"数据库"、"外观"、"关于"三个 tab，支持自定义 tab、细粒度设置项控制、内置 UpdateDialog。

## 基本用法

```vue
<script setup lang="ts">
import { ref } from "vue";
import { EditPen } from "@element-plus/icons-vue";
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
    :show-about-tab="true"
    app-name="我的应用"
    :app-icon="EditPen"
    :saving="saving"
    @save="onSave"
    @pick-database-file="() => console.log('pick db')"
    @pick-font-file="() => console.log('pick font')"
  />
</template>
```

## Tab 结构

对话框的 tab 按以下顺序排列：

1. 内置"数据库"tab（`showDatabaseTab` 控制）
2. 内置"外观"tab（`showAppearanceTab` 控制）
3. 自定义 tabs（`tabs` prop）
4. 内置"关于"tab（`showAboutTab` 控制）

侧边栏点击切换 tab，默认激活第一个 tab（可通过 `activeTabName` 指定）。

## Props

### 基础

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `visible` | `boolean` | `false` | 对话框显隐（`v-model:visible`） |
| `title` | `string` | `"软件设置"` | 对话框标题 |
| `width` | `string` | `"640px"` | 对话框宽度 |
| `saving` | `boolean` | `false` | 保存按钮 loading 状态 |
| `activeTabName` | `string` | `""` | 默认激活的 tab name。空字符串自动选第一个 |

### 关于 tab

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `showAboutTab` | `boolean` | `true` | 是否显示"关于"tab |
| `appName` | `string` | `""` | 应用名称 |
| `appIcon` | `Component \| null` | `null` | 应用图标组件（Element Plus icon） |
| `iconColor` | `string` | `"#2da44e"` | 应用图标颜色 |
| `appVersion` | `string` | `""` | 应用版本号。不传则运行时通过 `getVersion()` 读取 |
| `showUpdateButton` | `boolean` | `true` | 关于 tab 是否显示"检查更新"按钮 |

### 内置 tab 开关

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `showDatabaseTab` | `boolean` | `false` | 是否显示内置"数据库"tab |
| `showAppearanceTab` | `boolean` | `false` | 是否显示内置"外观"tab |

### 数据绑定

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `appearance` | `AppearanceSettings` | `{}` | 外观配置（`v-model:appearance`） |
| `database` | `DatabaseConfig` | `{}` | 数据库配置（`v-model:database`） |
| `fontOptions` | `FontOption[]` | `[]` | 字体下拉选项 |

### AppearanceTab 透传

以下 props 透传给内置 AppearanceTab，用于细粒度控制外观设置项：

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `showTheme` | `boolean` | `true` | 是否显示主题模式选择 |
| `showWordFont` | `boolean` | `true` | 是否显示单词字体下拉 |
| `showPhoneticFont` | `boolean` | `true` | 是否显示注音字体下拉 |
| `showUiFont` | `boolean` | `true` | 是否显示 UI 字体下拉 |
| `showFontUpload` | `boolean` | `true` | 是否显示上传字体按钮 |

### DatabaseTab 透传

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `showPath` | `boolean` | `true` | 是否显示数据库路径输入行 |
| `dbPlaceholder` | `string` | `"数据库文件路径"` | 数据库路径输入框 placeholder |

### 自定义 tab

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `tabs` | `SettingsTab[]` | `[]` | 自定义 tab 列表 |

```ts
interface SettingsTab {
  name: string;       // tab 唯一标识
  label: string;      // 侧边栏显示文本
  icon?: Component;   // 侧边栏图标（Element Plus icon 组件）
  builtin?: boolean;  // 是否内置（内部使用）
  [key: string]: unknown;
}
```

## Events

| 事件名 | 参数 | 说明 |
|---|---|---|
| `update:visible` | `(value: boolean)` | 对话框显隐变化 |
| `update:appearance` | `(value: AppearanceSettings)` | 外观配置变化 |
| `update:database` | `(value: DatabaseConfig)` | 数据库配置变化 |
| `save` | — | 点击"保存"按钮 |
| `cancel` | — | 点击"取消"按钮（随后自动关闭对话框） |
| `pick-database-file` | — | 数据库 tab 中点击"选择"按钮 |
| `pick-font-file` | — | 外观 tab 中点击"上传字体文件"按钮 |

## Slots

### 内容插槽

| 插槽 | 说明 |
|---|---|
| `tab-{name}` | 自定义 tab 的内容（`name` 为 `tabs` 中定义的 tab name） |
| `appearance-extra` | 外观 tab 末尾追加的自定义设置项 |
| `database-extra` | 数据库 tab 末尾追加的自定义设置项 |

### 扩展插槽

| 插槽 | 说明 |
|---|---|
| `sidebar-extra` | 侧边栏末尾追加项（如额外链接、按钮） |
| `about-extra` | 关于 tab 中"检查更新"按钮下方追加内容 |
| `footer-extra` | 底部按钮区域左侧追加按钮 |

## 自定义 tab

```vue
<script setup lang="ts">
import { ref } from "vue";
import { SettingsDialog, type SettingsTab } from "@gebinee/components";
import { Setting, Bell } from "@element-plus/icons-vue";

const visible = ref(false);

const tabs: SettingsTab[] = [
  { name: "general", label: "常规", icon: Setting },
  { name: "notification", label: "通知", icon: Bell },
];
</script>

<template>
  <SettingsDialog
    v-model:visible="visible"
    :tabs="tabs"
    title="应用设置"
  >
    <!-- 常规 tab 内容 -->
    <template #tab-general>
      <el-form label-position="top">
        <el-form-item label="语言">
          <el-select v-model="lang" style="width: 100%">
            <el-option label="简体中文" value="zh-CN" />
            <el-option label="English" value="en-US" />
          </el-select>
        </el-form-item>
      </el-form>
    </template>

    <!-- 通知 tab 内容 -->
    <template #tab-notification>
      <el-form label-position="top">
        <el-form-item label="桌面通知">
          <el-switch v-model="desktopNotify" />
        </el-form-item>
      </el-form>
    </template>
  </SettingsDialog>
</template>
```

## 细粒度设置项控制

隐藏内置设置项，只保留需要的部分：

```vue
<SettingsDialog
  v-model:visible="visible"
  v-model:appearance="appearance"
  :show-appearance-tab="true"
  :show-theme="true"
  :show-word-font="false"
  :show-phonetic-font="false"
  :show-ui-font="true"
  :show-font-upload="false"
  :font-options="fontOptions"
/>

<SettingsDialog
  v-model:visible="visible"
  v-model:database="database"
  :show-database-tab="true"
  :show-path="false"
  db-placeholder="或输入路径"
>
  <!-- 数据库 tab 不显示路径输入，改为自定义设置项 -->
  <template #database-extra>
    <el-form-item label="备份目录">
      <GebineeInput v-model="backupDir" />
    </el-form-item>
  </template>
</SettingsDialog>
```

## 关于 tab

关于 tab 显示应用信息（名称、版本、图标）和"检查更新"按钮：

```vue
<SettingsDialog
  v-model:visible="visible"
  :show-about-tab="true"
  app-name="我的应用"
  :app-icon="EditPen"
  icon-color="#2da44e"
  :show-update-button="true"
>
  <template #about-extra>
    <div class="links">
      <a href="https://example.com">官方网站</a>
      <a href="https://example.com/docs">使用文档</a>
    </div>
  </template>
</SettingsDialog>
```

- `appVersion` 不传时，组件打开时通过 `@tauri-apps/api/app` 的 `getVersion()` 读取
- `showUpdateButton` 为 `true` 时，点击"检查更新"会打开内置 `UpdateDialog`
- 关于 tab 使用 `v-if`（仅激活时渲染），其他内置 tab 使用 `v-show`（保持状态）

## 底部按钮

底部固定显示"取消"和"保存"按钮（保存为 GitHub 绿色）。可通过 `footer-extra` 插槽追加按钮：

```vue
<SettingsDialog v-model:visible="visible" @save="onSave">
  <template #footer-extra>
    <GebineeButton @click="onResetDefaults">恢复默认</GebineeButton>
  </template>
</SettingsDialog>
```

## 注意事项

- 对话框使用 `destroy-on-close`，关闭时销毁内容（`script setup` 状态保留）
- 内置 tab 的内容通过 `v-show` 切换（保持状态），关于 tab 用 `v-if`（无需保持状态）
- `appVersion` 仅在对话框首次打开时获取一次，之后缓存
- 内置 `UpdateDialog` 在 `showUpdateButton` 为 `true` 时渲染
