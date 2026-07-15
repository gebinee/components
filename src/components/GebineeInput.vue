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
.gebinee-input :deep(.el-input__inner) {
  font-size: 18px;
  height: 38px;
}
.gebinee-input :deep(.el-textarea__inner) {
  font-size: 18px;
}
.gebinee-input :deep(.el-input__inner::placeholder) {
  font-size: 16px;
}
</style>
