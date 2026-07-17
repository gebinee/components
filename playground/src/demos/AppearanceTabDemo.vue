<script setup lang="ts">
import { ref, watch } from "vue";
import { AppearanceTab, applyAppearance, type AppearanceSettings, type FontOption } from "@gebinee/components";

const appearance = ref<AppearanceSettings>({
  font_size: 16,
  word_font: "system-ui",
  phonetic_font: "system-ui",
  ui_font: "system-ui",
  theme: "auto",
});

const fontOptions: FontOption[] = [
  { label: "系统默认", value: "system-ui" },
  { label: "Gebinee 字体", value: "gebinee" },
];

function onPickFont() {
  console.log("[demo] 触发 pick-font-file");
}

// 配置变化时立即应用到页面，让字体/主题效果可见
watch(appearance, (v) => {
  applyAppearance(v);
  console.log("[demo] appearance 更新：", v);
}, { deep: true, immediate: true });
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
      <h3>效果预览</h3>
      <div class="preview-area" style="--font-size: 16px;">
        <div class="preview-row">
          <span class="label">UI 字体：</span>
          <span :style="{ fontFamily: appearance.ui_font || 'system-ui' }">
            The quick brown fox jumps over the lazy dog. 1234567890
          </span>
        </div>
        <div class="preview-row">
          <span class="label">单词字体：</span>
          <span :style="{ fontFamily: appearance.word_font || 'system-ui' }">
            hello / world / vocabulary
          </span>
        </div>
        <div class="preview-row">
          <span class="label">注音字体：</span>
          <span :style="{ fontFamily: appearance.phonetic_font || 'system-ui' }">
            /həˈloʊ/ /wɜːrld/
          </span>
        </div>
      </div>
    </section>

    <section class="demo-section">
      <h3>当前配置</h3>
      <pre class="config">{{ JSON.stringify(appearance, null, 2) }}</pre>
    </section>
  </div>
</template>

<style scoped>
.demo { display: flex; flex-direction: column; gap: 28px; max-width: 520px; }
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
.preview-area {
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  padding: 16px;
  background: var(--el-bg-color);
  display: flex;
  flex-direction: column;
  gap: 14px;
  font-size: var(--font-size, 16px);
}
.preview-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.preview-row .label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.config {
  font-size: 13px;
  padding: 12px;
  background: var(--el-fill-color-light);
  border-radius: 6px;
  font-family: Consolas, Monaco, monospace;
  color: var(--el-text-color-regular);
}
</style>
