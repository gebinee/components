<script setup lang="ts">
import { ref, watch } from "vue";
import { AppearanceTab, GebineeInput, applyAppearance, type AppearanceSettings } from "@gebinee/components";

const appearance = ref<AppearanceSettings>({
  word_font: "system-ui",
  phonetic_font: "system-ui",
  ui_font: "system-ui",
  ui_font_cn: undefined,
  theme: "auto",
});

function onPickFont() {
  console.log("[demo] 触发 pick-font-file");
}

// 单词输入框：预填一个示例单词，方便观察字体；可清空看 placeholder
const wordInput = ref("hello");

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
          @pick-font-file="onPickFont"
        />
      </div>
    </section>

    <section class="demo-section">
      <h3>效果预览</h3>
      <div class="preview-area">
        <div class="preview-row">
          <span class="label">UI 字体（element-plus 组件）</span>
          <div class="component-group">
            <el-input
              :model-value="`输入框中的文字 ABC 123`"
              readonly
              style="width: 100%; margin-bottom: 8px;"
            />
            <el-input
              type="textarea"
              :rows="2"
              :model-value="`文本域中的文字 ABC 123`"
              readonly
              style="width: 100%; margin-bottom: 8px;"
            />
            <div class="button-row">
              <el-button type="primary">按钮 Primary</el-button>
              <el-button>按钮 Default</el-button>
              <el-button type="success">成功</el-button>
              <el-button type="warning">警告</el-button>
              <el-button type="danger">危险</el-button>
            </div>
            <el-select
              :model-value="'option1'"
              style="width: 100%; margin-top: 8px;"
            >
              <el-option label="选项一 ABC" value="option1" />
              <el-option label="选项二 DEF" value="option2" />
            </el-select>
          </div>
        </div>
        <div class="preview-row">
          <span class="label">单词字体</span>
          <span class="word-sample" style="font-family: var(--gebinee-word-font)">
            hello / world / vocabulary / 你好世界
          </span>
          <GebineeInput
            v-model="wordInput"
            class="word-input"
            placeholder="请输入单词（placeholder 跟随系统字体）"
            clearable
            style="margin-top: 8px;"
          />
        </div>
        <div class="preview-row">
          <span class="label">注音字体</span>
          <span class="word-sample" style="font-family: var(--gebinee-phonetic-font)">
            /həˈloʊ/ /wɜːrld/ /ˈvæbjəlɛri/
          </span>
        </div>
        <div class="preview-row">
          <span class="label">UI 字体（纯文本）</span>
          <span class="word-sample" style="font-family: var(--gebinee-ui-font)">
            The quick brown fox jumps over the lazy dog. 敏捷的棕色狐狸跳过了懒狗。ABCDEFG 1234567890
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
  /* 演示消费项目如何引用 --gebinee-ui-font 驱动 Element Plus 全局字体 */
  --el-font-family: var(--gebinee-ui-font);
}
/* element-plus 组件内部用 font-family: inherit，需要直接穿透设置 */
.preview-area :deep(.el-input__inner),
.preview-area :deep(.el-textarea__inner),
.preview-area :deep(.el-button) {
  font-family: var(--gebinee-ui-font);
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
.component-group {
  display: flex;
  flex-direction: column;
}
.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.word-sample {
  font-size: var(--gebinee-font-size, 16px);
  line-height: 1.6;
  padding: 4px 0;
}
/* 单词输入框：输入文字用单词字体，placeholder 保持系统字体。
   GebineeInput 根元素带 .gebinee-input 类，外部 class 会合并到同一根元素上，
   这里用 .word-input :deep() 穿透到 el-input__inner。 */
.word-input :deep(.el-input__inner) {
  font-family: var(--gebinee-word-font);
}
.word-input :deep(.el-input__inner::placeholder) {
  font-family: system-ui;
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
