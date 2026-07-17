<script lang="ts">
/**
 * 本地定义 el-button 的 props 类型（等价于 element-plus 的 ButtonProps 接口）。
 *
 * 不从 element-plus 导入 ButtonProps，是因为 @vue/compiler-sfc 在 TypeScript 7 下
 * 无法跨文件解析外部类型（缺少 ts.findConfigFile 等 API）。
 * 本地定义让类型自包含，避免 SFC 编译器调用 TS API 解析外部类型。
 * 待 @vue/compiler-sfc 适配 TS 7 后，可切回 `import { type ButtonProps } from "element-plus"`。
 */
export type GebineeButtonType = "" | "default" | "primary" | "success" | "info" | "warning" | "danger" | "text";
export type GebineeButtonNativeType = "button" | "submit" | "reset";
export type GebineeButtonSize = "" | "default" | "small" | "large";

export interface GebineeButtonProps {
  size?: GebineeButtonSize;
  disabled?: boolean;
  type?: GebineeButtonType;
  icon?: string | object;
  nativeType?: GebineeButtonNativeType;
  loading?: boolean;
  loadingIcon?: string | object;
  plain?: boolean;
  text?: boolean;
  link?: boolean;
  bg?: boolean;
  autofocus?: boolean;
  round?: boolean;
  circle?: boolean;
  dashed?: boolean;
  color?: string;
  dark?: boolean;
  autoInsertSpace?: boolean;
  tag?: string | object;
}
</script>

<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { ElButton } from "element-plus";

defineOptions({ name: "GebineeButton", inheritAttrs: false });

// 声明 el-button 的全部 props，使消费项目使用时获得 IDE 类型提示
const props = defineProps<GebineeButtonProps>();
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
