<script setup lang="ts">
import { ref } from "vue";
import { AppearanceTab, type AppearanceSettings, type FontOption } from "@gebinee/components";

const appearance = ref<AppearanceSettings>({
  font_size: 16,
  word_font: "system-ui",
  phonetic_font: "system-ui",
  ui_font: "system-ui",
  theme: "auto",
});

const fontOptions: FontOption[] = [
  { label: "系统默认", value: "system-ui" },
  { label: "宋体", value: "SimSun" },
  { label: "微软雅黑", value: "Microsoft YaHei" },
  { label: "等线", value: "DengXian" },
  { label: "Gebinee 字体", value: "gebinee" },
];

function onPickFont() {
  console.log("[demo] 触发 pick-font-file");
}

function onUpdate(v: AppearanceSettings) {
  appearance.value = v;
  console.log("[demo] appearance 更新：", v);
}
</script>

<template>
  <div class="demo">
    <section class="demo-section">
      <h3>AppearanceTab 组件</h3>
      <div class="panel">
        <AppearanceTab
          v-model="appearance"
          :font-options="fontOptions"
          @pick-font-file="onPickFont"
        />
      </div>
    </section>

    <section class="demo-section">
      <h3>当前配置</h3>
      <pre class="preview">{{ JSON.stringify(appearance, null, 2) }}</pre>
    </section>
  </div>
</template>

<style scoped>
.demo { display: flex; flex-direction: column; gap: 28px; max-width: 480px; }
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
.preview {
  font-size: 13px;
  padding: 12px;
  background: var(--el-fill-color-light);
  border-radius: 6px;
  font-family: Consolas, Monaco, monospace;
  color: var(--el-text-color-regular);
}
</style>
