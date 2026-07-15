<script setup>
import { computed } from "vue";
import { ElForm, ElFormItem, ElInput, ElButton, ElIcon } from "element-plus";
import { FolderOpened } from "@element-plus/icons-vue";

const props = defineProps({
  modelValue: { type: Object, required: true },
  placeholder: { type: String, default: "数据库文件路径" },
});

const emit = defineEmits(["update:modelValue", "pick-database-file"]);

const dbPath = computed({
  get: () => props.modelValue.db_path ?? "",
  set: (v) => emit("update:modelValue", { ...props.modelValue, db_path: v }),
});
</script>

<template>
  <el-form label-position="top">
    <el-form-item label="数据库文件路径">
      <div class="db-row">
        <el-input v-model="dbPath" :placeholder="placeholder" />
        <el-button @click="emit('pick-database-file')">
          <el-icon><FolderOpened /></el-icon>
          <span>选择</span>
        </el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.db-row {
  display: flex;
  gap: 8px;
  width: 100%;
}
.db-row :deep(.el-input) {
  flex: 1;
}
</style>