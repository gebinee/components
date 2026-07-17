<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { ElInput } from "element-plus";
// 使用 InputProps 类型（Element Plus 推荐），弃用的 inputProps 运行时对象将在 3.0.0 移除
import type { InputProps } from "element-plus";

defineOptions({ name: "GebineeInput", inheritAttrs: false });

// defineModel 自动声明 modelValue prop 和 update:modelValue emit
// 类型来自 InputProps["modelValue"]，即 string | number | null | undefined
const model = defineModel<InputProps["modelValue"]>();

// 声明 el-input 的全部 props（排除 modelValue，由 defineModel 处理），
// 使消费项目使用时获得 IDE 类型提示
defineProps<Omit<InputProps, "modelValue">>();
const attrs = useAttrs();

// 透传 ElInput 的所有具名插槽：用索引签名给出明确类型，避免动态插槽名的循环推断
defineSlots<{
  [name: string]: (props: Record<string, unknown>) => unknown;
}>();

// 透传给 el-input 的属性（排除 class，class 由模板显式绑定以触发 Vue 的 class 合并机制）
const passthrough = computed(() => {
  const rest = { ...attrs };
  delete rest.class;
  return rest;
});
</script>

<template>
  <el-input
    class="gebinee-input"
    :class="attrs.class"
    v-bind="passthrough"
    v-model="model"
  >
    <template v-for="name in Object.keys($slots)" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </el-input>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
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
</style>
