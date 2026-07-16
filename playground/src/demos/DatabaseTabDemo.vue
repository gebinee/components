<script setup lang="ts">
import { ref } from "vue";
import { DatabaseTab, type DatabaseConfig } from "@gebinee/components";

const db = ref<DatabaseConfig>({ db_path: "C:/Users/data/words.db" });

function onPick() {
  console.log("[demo] 触发 pick-database-file");
  // 模拟选择
  db.value = { db_path: "D:/workspace/test/vocabulary.db" };
}
</script>

<template>
  <div class="demo">
    <section class="demo-section">
      <h3>DatabaseTab 组件</h3>
      <div class="panel">
        <DatabaseTab
          v-model="db"
          placeholder="选择数据库文件路径"
          @pick-database-file="onPick"
        />
      </div>
    </section>

    <section class="demo-section">
      <h3>当前路径</h3>
      <div class="path">{{ db.db_path || "(空)" }}</div>
    </section>
  </div>
</template>

<style scoped>
.demo { display: flex; flex-direction: column; gap: 28px; max-width: 560px; }
.demo-section h3 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 14px;
}
.panel {
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  padding: 16px;
  background: var(--el-bg-color);
}
.path {
  font-size: 13px;
  padding: 10px 12px;
  background: var(--el-fill-color-light);
  border-radius: 6px;
  font-family: Consolas, Monaco, monospace;
  word-break: break-all;
}
</style>
