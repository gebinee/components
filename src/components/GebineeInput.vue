<script setup>
import { ElInput } from "element-plus";

defineOptions({ name: "GebineeInput", inheritAttrs: false });
</script>

<template>
  <el-input class="gebinee-input" v-bind="$attrs">
    <template v-for="(_, name) in $slots" #[name]="slotData">
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
