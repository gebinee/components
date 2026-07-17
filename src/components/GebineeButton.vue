<script setup lang="ts">
import { computed } from "vue";
import { ElButton, buttonProps } from "element-plus";

defineOptions({ name: "GebineeButton", inheritAttrs: false });

// 声明 el-button 的全部 props，使消费项目使用时获得 IDE 类型提示
const props = defineProps(buttonProps);

// type="success" 且 plain 时，自动应用 GitHub 绿色 hover 样式
const autoClass = computed(() => {
  return props.type === "success" && props.plain ? "btn-success-hover" : "";
});
</script>

<template>
  <el-button
    class="gebinee-button"
    :class="autoClass"
    v-bind="{ ...$attrs, ...props }"
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
