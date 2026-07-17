# AppearanceTab

外观设置表单，包含主题模式选择、单词/注音/UI 字体选择、上传字体按钮。支持 `v-model` 双向绑定，可细粒度控制各设置项的显隐，并可通过默认插槽追加自定义设置项。

## 基本用法

```vue
<script setup lang="ts">
import { ref } from "vue";
import { AppearanceTab, type AppearanceSettings, type FontOption } from "@gebinee/components";

const appearance = ref<AppearanceSettings>({
  font_size: 16,
  word_font: "system-ui",
  phonetic_font: "system-ui",
  ui_font: "system-ui",
  theme: "auto",
});

const fontOptions: FontOption[] = [
  { label: "系统默认", value: "system-ui" },
  { label: "Gebinee 字体", value: "gebinee" },
  { label: "微软雅黑", value: "Microsoft YaHei" },
];

function onPickFont() {
  // 调用 Tauri 文件选择对话框
}
</script>

<template>
  <AppearanceTab
    v-model="appearance"
    :font-options="fontOptions"
    @pick-font-file="onPickFont"
  />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | `AppearanceSettings` | — | 外观配置（v-model 绑定） |
| `fontOptions` | `FontOption[]` | `[]` | 字体下拉选项列表 |
| `showTheme` | `boolean` | `true` | 是否显示主题模式选择 |
| `showWordFont` | `boolean` | `true` | 是否显示单词字体下拉 |
| `showPhoneticFont` | `boolean` | `true` | 是否显示注音字体下拉 |
| `showUiFont` | `boolean` | `true` | 是否显示 UI 字体下拉 |
| `showFontUpload` | `boolean` | `true` | 是否显示上传字体按钮 |

### AppearanceSettings 类型

```ts
type ThemeMode = "light" | "dark" | "auto";

interface AppearanceSettings {
  font_size?: number;
  word_font?: string;
  phonetic_font?: string;
  ui_font?: string;
  theme?: ThemeMode;
}
```

> **注意**：`font_size` 字段在 `AppearanceTab` 中没有对应的 UI 控件。该值需由消费项目通过其他方式设置（如单独的字号选择器），并通过 `applyAppearance()` 应用。

### FontOption 类型

```ts
interface FontOption {
  label: string;  // 显示文本
  value: string;  // 字体值（CSS font-family 名称）
}
```

## Events

| 事件名 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `(value: AppearanceSettings)` | 配置变化时触发（任意字段修改均触发） |
| `pick-font-file` | — | 点击"上传字体文件"按钮时触发 |

## Slots

| 插槽 | 说明 |
|---|---|
| 默认插槽 | 渲染在所有设置项之后，供消费项目追加自定义设置项 |

```vue
<AppearanceTab v-model="appearance" :font-options="fontOptions">
  <el-divider content-position="left">高级</el-divider>
  <el-form-item label="字号">
    <el-input-number v-model="appearance.font_size" :min="12" :max="32" />
  </el-form-item>
</AppearanceTab>
```

## 细粒度控制

通过 `showXxx` props 可单独控制各设置项的显隐：

```vue
<!-- 只显示主题模式，不显示字体相关设置 -->
<AppearanceTab
  v-model="appearance"
  :font-options="fontOptions"
  :show-theme="true"
  :show-word-font="false"
  :show-phonetic-font="false"
  :show-ui-font="false"
  :show-font-upload="false"
/>

<!-- 只显示字体设置，不显示主题 -->
<AppearanceTab
  v-model="appearance"
  :font-options="fontOptions"
  :show-theme="false"
/>

<!-- 隐藏上传按钮，只保留字体下拉 -->
<AppearanceTab
  v-model="appearance"
  :font-options="fontOptions"
  :show-font-upload="false"
/>
```

## 字段更新机制

组件内部通过 `updateField` 函数代理单个字段的更新：

```ts
function updateField(field, value) {
  emit("update:modelValue", { ...props.modelValue, [field]: value });
}
```

每次字段变化都会触发 `update:modelValue`，传递完整的 `AppearanceSettings` 对象（浅拷贝）。消费项目可通过 `watch(appearance, ...)` 监听变化并调用 `applyAppearance()` 应用到页面。

## 主题模式

| 值 | 说明 |
|---|---|
| `"light"` | 浅色模式 |
| `"dark"` | 深色模式 |
| `"auto"` | 跟随系统（通过 `prefers-color-scheme` 媒体查询） |

主题的实际应用由 `applyAppearance()` 函数完成，`AppearanceTab` 仅负责配置的编辑。

## 注意事项

- 字体下拉的 `fontOptions` 应包含 `"system-ui"` 选项，作为默认值
- `"gebinee"` 是组件库内置字体，可直接作为选项值使用
- `pick-font-file` 事件仅通知消费项目，实际的字体文件选择和注册逻辑由消费项目实现
