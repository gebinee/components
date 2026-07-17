<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { ElButton } from "element-plus";
// 使用 ButtonProps 类型（Element Plus 推荐），弃用的 buttonProps 运行时对象将在 3.0.0 移除
import type { ButtonProps } from "element-plus";

defineOptions({ name: "GebineeButton", inheritAttrs: false });

// 声明 el-button 的全部 props，使消费项目使用时获得 IDE 类型提示
const props = defineProps<ButtonProps>();
const attrs = useAttrs();

// type="success" 且 plain 时，自动应用 GitHub 绿色 hover 样式
const autoClass = computed(() => {
  return props.type === "success" && props.plain ? "gebinee--btn-success-hover" : "";
});

// Vue :class 接受 string | object | array；attrs.class 是 unknown，这里统一收敛为数组形式
const mergedClass = computed(() => {
  const userClass = attrs.class as unknown;
  const arr: unknown[] = [autoClass.value];
  if (userClass) arr.push(userClass);
  return arr;
});

// 透传给 el-button 的属性（排除 class，class 由模板显式绑定以触发 Vue 的 class 合并机制）
const passthrough = computed(() => {
  const rest = { ...attrs };
  delete rest.class;
  return rest;
});
</script>

<template>
  <el-button
    class="gebinee-button"
    :class="mergedClass"
    v-bind="{ ...passthrough, ...props }"
  >
    <slot />
  </el-button>
</template>

<style scoped>
.gebinee-button {
  height: 38px;
  font-size: 16px;
}
</style>
