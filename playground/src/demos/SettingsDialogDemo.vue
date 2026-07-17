<script setup lang="ts">
import { ref } from "vue";
import { EditPen } from "@element-plus/icons-vue";
import { SettingsDialog, type AppearanceSettings, type DatabaseConfig, type FontOption } from "@gebinee/components";

const visible = ref(false);
const saving = ref(false);

const appearance = ref<AppearanceSettings>({
  word_font: "system-ui",
  phonetic_font: "system-ui",
  ui_font: "system-ui",
  theme: "auto",
});

const database = ref<DatabaseConfig>({ db_path: "C:/Users/data/words.db" });

const fontOptions: FontOption[] = [
  { label: "系统默认", value: "system-ui" },
  { label: "微软雅黑", value: "Microsoft YaHei" },
  { label: "宋体", value: "SimSun" },
];

function onSave() {
  saving.value = true;
  setTimeout(() => {
    saving.value = false;
    visible.value = false;
    console.log("[demo] 保存完成", { appearance: appearance.value, database: database.value });
  }, 1200);
}
</script>

<template>
  <div class="demo">
    <section class="demo-section">
      <h3>打开设置对话框</h3>
      <p class="desc">点击按钮打开 SettingsDialog，内置"数据库 / 外观 / 关于"三个 tab。</p>
      <button class="open-btn" @click="visible = true">打开设置</button>
    </section>

    <section class="demo-section">
      <h3>当前配置快照</h3>
      <div class="snapshot">
        <div><span>数据库路径：</span>{{ database.db_path || "(空)" }}</div>
        <div><span>主题：</span>{{ appearance.theme }}</div>
      </div>
    </section>

    <SettingsDialog
      v-model:visible="visible"
      v-model:appearance="appearance"
      v-model:database="database"
      :font-options="fontOptions"
      :show-database-tab="true"
      :show-appearance-tab="true"
      :show-update-button="true"
      :app-icon="EditPen"
      app-name="Gebinee 词汇编辑器"
      :saving="saving"
      @save="onSave"
      @pick-database-file="() => console.log('pick db')"
      @pick-font-file="() => console.log('pick font')"
    />
  </div>
</template>

<style scoped>
.demo { display: flex; flex-direction: column; gap: 28px; max-width: 560px; }
.demo-section h3 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 14px;
}
.desc {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-bottom: 16px;
}
.open-btn {
  padding: 9px 18px;
  font-size: 14px;
  background: #2da44e;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.open-btn:hover { background: #1a7f37; }
.snapshot {
  font-size: 13px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 16px;
  background: var(--el-fill-color-light);
  border-radius: 6px;
}
.snapshot span { color: var(--el-text-color-secondary); margin-right: 4px; }
</style>
