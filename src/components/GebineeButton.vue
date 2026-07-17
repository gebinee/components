<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { ElButton, type ButtonProps } from "element-plus";

defineOptions({ name: "GebineeButton", inheritAttrs: false });

// 声明 el-button 的全部 props，使消费项目使用时获得 IDE 类型提示
const props = defineProps<ButtonProps>();
const attrs = useAttrs();

// type="success" 且 plain 时，自动应用 GitHub 绿色 hover 样式
const autoClass = computed(() => {
  return props.type === "success" && props.plain ? "gebinee--btn-success-hover" : "";
});

// 透传给 el-button 的属性（排除 class，class 由模板显式绑定以触发 Vue 的 class 合并机制）
const passthrough = computed(() => {
  const { class: _omit, ...rest } = attrs;
  return rest;
});
</script>

<template>
  <el-button
    class="gebinee-button"
    :class="[autoClass, ($attrs as any).class]"
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
