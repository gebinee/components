# GebineeButton

Element Plus `ElButton` 的封装组件，统一按钮高度和字号，配合 `.gebinee--btn-green` 样式类实现 GitHub 风格绿色按钮。

## 基本用法

```vue
<script setup lang="ts">
import { GebineeButton } from "@gebinee/components";
import { Download } from "@element-plus/icons-vue";
</script>

<template>
  <!-- 默认样式 -->
  <GebineeButton>普通按钮</GebineeButton>

  <!-- GitHub 绿色实心按钮 -->
  <GebineeButton class="gebinee--btn-green">保存</GebineeButton>

  <!-- 带图标 -->
  <GebineeButton class="gebinee--btn-green">
    <el-icon><Download /></el-icon>
    <span>下载</span>
  </GebineeButton>

  <!-- 禁用 -->
  <GebineeButton class="gebinee--btn-green" disabled>禁用</GebineeButton>

  <!-- 加载中 -->
  <GebineeButton class="gebinee--btn-green" :loading="true">加载中</GebineeButton>
</template>
```

## Props

GebineeButton 通过 `defineProps<ButtonProps>()` 声明 ElButton 的全部 Props（使用 Element Plus 推荐的 `ButtonProps` 接口类型，弃用的 `buttonProps` 运行时对象将在 3.0.0 移除），消费项目使用时可获得完整的 IDE 类型提示（如 `type`、`plain`、`size` 等属性的自动补全和类型检查）。不额外定义自有 Props。

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `type` | `"default" \| "primary" \| "success" \| ...` | `"default"` | ElButton 原生 type |
| `size` | `"large" \| "default" \| "small"` | `"default"` | ElButton 原生 size（建议不设，组件已固定高度 38px） |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `loading` | `boolean` | `false` | 是否加载中 |
| ... | ... | ... | 其他 ElButton Props 均透传 |

> 完整 Props 列表请参考 [Element Plus Button 文档](https://element-plus.org/en-US/component/button.html)。

## Slots

| 插槽 | 说明 |
|---|---|
| 默认插槽 | 按钮内容（文字、图标等） |

## 样式类

组件库提供以下按钮颜色工具类，通过 `class` 属性使用。**这些类定义在全局 `dist/style.css` 中，选择器限定为 `.el-button.gebinee--btn-green`，仅对 Element Plus 按钮生效（含 GebineeButton 与消费项目的原生 el-button），普通元素加上 class 不会生效**：

### `.gebinee--btn-green` — GitHub 绿色实心按钮

```vue
<!-- GebineeButton -->
<GebineeButton class="gebinee--btn-green">保存</GebineeButton>

<!-- 原生 el-button 也可直接使用 -->
<el-button class="gebinee--btn-green">保存</el-button>

<!-- 普通元素不生效（无视觉效果） -->
<div class="gebinee--btn-green">不会变绿</div>
```

| 状态 | 背景色 | 文字色 |
|---|---|---|
| 默认 | `#2da44e` | `#ffffff` |
| hover | `#2c974b` | `#ffffff` |
| active | `#298e46` | `#ffffff` |
| disabled | `#94d3a3` | `#ffffff` |

### `.gebinee--btn-success-hover` — 浅色按钮 hover 变绿

hover/focus 时变为 GitHub 绿色实心。

**GebineeButton 自动应用**：传入 `type="success"` 且 `plain` 时无需手动添加 class。

```vue
<!-- GebineeButton 自动生效，hover 时变绿 -->
<GebineeButton type="success" plain>编辑</GebineeButton>
```

**原生 el-button 手动添加 class**：

```vue
<!-- 原生 el-button 需手动添加 class -->
<el-button type="success" plain class="gebinee--btn-success-hover">编辑</el-button>
```

| 状态 | 背景色 | 文字色 | 边框色 |
|---|---|---|---|
| 默认 | Element Plus success plain 默认 | — | — |
| hover / focus | `#2da44e` | `#ffffff` | `rgba(27, 31, 36, 0.15)` |

## 样式分层说明

按钮样式分为两层：

| 层级 | 位置 | 作用域 | 职责 |
|---|---|---|---|
| 组件 scoped | [GebineeButton.vue](file:///d:/workspace/gebinee/components/src/components/GebineeButton.vue) `<style scoped>` | 仅 GebineeButton | 固定高度 38px、字号 16px |
| 全局工具类 | [button.css](file:///d:/workspace/gebinee/components/src/styles/button.css)（打包进 `dist/style.css`） | 仅 `.el-button` 元素 | `.gebinee--btn-green` / `.gebinee--btn-success-hover` 颜色类 |

这样设计的好处：GebineeButton 自身布局样式内聚在组件内，颜色工具类作为全局样式可供消费项目的原生 el-button 复用，且通过 `.el-button` 选择器限定，普通元素加上 class 也不会误生效。

## 样式覆盖

组件通过 scoped 样式固定了高度和字号：

```css
.gebinee-button {
  height: 38px;
  font-size: 16px;
}
```

如需覆盖，消费项目可通过深度选择器调整：

```css
:deep(.gebinee-button) {
  height: 40px;
}
```

## 注意事项

- `inheritAttrs: false` 已设置，所有 `$attrs` 透传到内部 `el-button`
- `class` 属性会自动合并到内部 `el-button`，因此 `.gebinee--btn-green` 等类直接生效
