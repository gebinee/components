<script setup lang="ts">
import { ElInput } from "element-plus";

defineOptions({ name: "GebineeInput", inheritAttrs: false });

// 透传 ElInput 的所有具名插槽：用索引签名给出明确类型，避免动态插槽名的循环推断
defineSlots<{
  [name: string]: (props: Record<string, unknown>) => unknown;
}>();
</script>

<template>
  <el-input class="gebinee-input" v-bind="$attrs">
    <template v-for="name in Object.keys($slots)" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </el-input>
</template>

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
