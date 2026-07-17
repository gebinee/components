# GebineeInput

Element Plus `ElInput` 的封装组件，统一输入框字号（18px）和 placeholder 字号（16px），透传全部具名插槽。

## 基本用法

```vue
<script setup lang="ts">
import { ref } from "vue";
import { GebineeInput } from "@gebinee/components";

const text = ref("hello world");
const empty = ref("");
const textarea = ref("多行文本");
</script>

<template>
  <!-- 基础输入 -->
  <GebineeInput v-model="text" placeholder="请输入内容" />

  <!-- 占位符 -->
  <GebineeInput v-model="empty" placeholder="这是 placeholder 文字" />

  <!-- 文本域 -->
  <GebineeInput v-model="textarea" type="textarea" :rows="3" placeholder="多行输入" />

  <!-- 禁用 -->
  <GebineeInput model-value="禁用内容" disabled />

  <!-- 可清空 -->
  <GebineeInput v-model="text" clearable placeholder="可清空" />
</template>
```

## Props

GebineeInput 透传 ElInput 的所有 Props，不额外定义自有 Props。

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | `string \| number` | `""` | v-model 绑定值 |
| `type` | `"text" \| "textarea" \| ...` | `"text"` | 输入框类型 |
| `placeholder` | `string` | — | 占位符 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `clearable` | `boolean` | `false` | 是否可清空 |
| ... | ... | ... | 其他 ElInput Props 均透传 |

> 完整 Props 列表请参考 [Element Plus Input 文档](https://element-plus.org/en-US/component/input.html)。

## Slots

GebineeInput 透传 ElInput 的所有具名插槽：

| 插槽 | 说明 |
|---|---|
| `prefix` | 输入框头部内容 |
| `suffix` | 输入框尾部内容 |
| `prepend` | 输入框前置内容 |
| `append` | 输入框后置内容 |

```vue
<GebineeInput v-model="text" placeholder="搜索...">
  <template #prefix>
    <el-icon><Search /></el-icon>
  </template>
  <template #append>
    <GebineeButton class="btn-green">搜索</GebineeButton>
  </template>
</GebineeInput>
```

## 样式

组件通过 scoped 深度选择器设置了字号：

```css
:deep(.el-input__inner) {
  font-size: 18px;
  height: 38px;
}
:deep(.el-textarea__inner) {
  font-size: 18px;
}
:deep(.el-input__inner::placeholder) {
  font-size: 16px;
}
```

如需覆盖输入框字体样式，建议通过深度选择器在消费项目中调整，而非修改组件库。

## 注意事项

- `inheritAttrs: false` 已设置，所有 `$attrs` 透传到内部 `el-input`
- 所有具名插槽（`prefix`、`suffix`、`prepend`、`append` 等）均动态透传
- `defineSlots` 使用了索引签名类型，支持任意插槽名
