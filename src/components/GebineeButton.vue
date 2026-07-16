<script setup lang="ts">
import { ElButton } from "element-plus";

defineOptions({ name: "GebineeButton", inheritAttrs: false });
</script>

<template>
  <el-button class="gebinee-button" v-bind="$attrs">
    <slot />
  </el-button>
</template>

<style scoped>
.gebinee-button {
  height: 38px;
  font-size: 16px;
}
</style>
