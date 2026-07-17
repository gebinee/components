<script setup lang="ts">
import { FolderOpened } from "@element-plus/icons-vue";
import { ElForm, ElFormItem, ElIcon } from "element-plus";
import { computed } from "vue";
import GebineeButton from "./GebineeButton.vue";
import GebineeInput from "./GebineeInput.vue";
import type { DatabaseConfig } from "../types";

const props = withDefaults(
  defineProps<{
    modelValue: DatabaseConfig;
    placeholder?: string;
    // 细粒度显隐控制（默认 true，保持向后兼容）
    showPath?: boolean;
  }>(),
  {
    placeholder: "数据库文件路径",
    showPath: true,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: DatabaseConfig];
  "pick-database-file": [];
}>();

const dbPath = computed({
  get: () => props.modelValue.db_path ?? "",
  set: (v) => emit("update:modelValue", { ...props.modelValue, db_path: v }),
});
</script>

<template>
  <el-form label-position="top">
    <el-form-item v-if="showPath" label="数据库文件路径">
      <div class="db-row">
        <GebineeInput v-model="dbPath" :placeholder="placeholder" />
        <GebineeButton @click="emit('pick-database-file')">
          <el-icon><FolderOpened /></el-icon>
          <span>选择</span>
        </GebineeButton>
      </div>
    </el-form-item>

    <!-- 消费项目可在此追加自定义设置项 -->
    <slot />
  </el-form>
</template>

<style scoped>
.db-row {
  display: flex;
  gap: 8px;
  width: 100%;
}

/*noinspection CssUnusedSymbol*/
.db-row :deep(.el-input) {
  flex: 1;
}
</style>
