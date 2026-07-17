# GebineeButton

Element Plus `ElButton` 的封装组件，统一按钮高度和字号，配合 `.btn-green` 样式类实现 GitHub 风格绿色按钮。

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
  <GebineeButton class="btn-green">保存</GebineeButton>

  <!-- 带图标 -->
  <GebineeButton class="btn-green">
    <el-icon><Download /></el-icon>
    <span>下载</span>
  </GebineeButton>

  <!-- 禁用 -->
  <GebineeButton class="btn-green" disabled>禁用</GebineeButton>

  <!-- 加载中 -->
  <GebineeButton class="btn-green" :loading="true">加载中</GebineeButton>
</template>
```

## Props

GebineeButton 透传 ElButton 的所有 Props，不额外定义自有 Props。

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

组件库提供以下按钮颜色类，通过 `class` 属性使用：

### `.btn-green` — GitHub 绿色实心按钮

```vue
<GebineeButton class="btn-green">保存</GebineeButton>
```

| 状态 | 背景色 | 文字色 |
|---|---|---|
| 默认 | `#2da44e` | `#ffffff` |
| hover | `#2c974b` | `#ffffff` |
| active | `#298e46` | `#ffffff` |
| disabled | `#94d3a3` | `#ffffff` |

### `.btn-success-hover` — 浅色按钮 hover 变绿

配合 `type="success" plain` 使用，hover 时变为 GitHub 绿色实心：

```vue
<GebineeButton type="success" plain class="btn-success-hover">编辑</GebineeButton>
```

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
- `class` 属性会自动合并到内部 `el-button`，因此 `.btn-green` 等类直接生效
