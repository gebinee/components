<script setup lang="ts">
import { Upload } from "@element-plus/icons-vue";
import { ElForm, ElFormItem, ElDivider, ElRadioGroup, ElRadioButton, ElSelect, ElOption, ElIcon } from "element-plus";
import { computed } from "vue";
import GebineeButton from "./GebineeButton.vue";
import { getDefaultFontOptions, getDefaultFontOptionsCn } from "../utils/theme";
import type { AppearanceSettings, FontOption, ThemeMode } from "../types";

const props = withDefaults(
  defineProps<{
    modelValue: AppearanceSettings;
    fontOptions?: FontOption[];
    fontOptionsCn?: FontOption[];
    // 细粒度显隐控制（默认均为 true，保持向后兼容）
    showTheme?: boolean;
    showWordFont?: boolean;
    showPhoneticFont?: boolean;
    showUiFont?: boolean;
    showFontUpload?: boolean;
  }>(),
  {
    fontOptions: () => getDefaultFontOptions(),
    fontOptionsCn: () => getDefaultFontOptionsCn(),
    showTheme: true,
    showWordFont: true,
    showPhoneticFont: true,
    showUiFont: true,
    showFontUpload: true,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: AppearanceSettings];
  "pick-font-file": [];
}>();

const themeOptions: { label: string; value: ThemeMode }[] = [
  { label: "浅色模式", value: "light" },
  { label: "深色模式", value: "dark" },
  { label: "跟随系统", value: "auto" },
];

// 代理单个字段的更新
function updateField<K extends keyof AppearanceSettings>(
  field: K,
  value: AppearanceSettings[K],
): void {
  emit("update:modelValue", { ...props.modelValue, [field]: value });
}

const wordFont = computed({
  get: () => props.modelValue.word_font ?? "system-ui",
  set: (v) => updateField("word_font", v),
});
const phoneticFont = computed({
  get: () => props.modelValue.phonetic_font ?? "system-ui",
  set: (v) => updateField("phonetic_font", v),
});
const uiFont = computed({
  get: () => props.modelValue.ui_font ?? "system-ui",
  set: (v) => updateField("ui_font", v),
});
const uiFontCn = computed({
  get: () => props.modelValue.ui_font_cn ?? "",
  set: (v) => updateField("ui_font_cn", v || undefined),
});
const theme = computed({
  get: () => props.modelValue.theme ?? "auto",
  set: (v) => updateField("theme", v),
});

const showCnFonts = computed(() => props.fontOptionsCn.length > 0);
</script>

<template>
  <el-form label-position="top">
    <template v-if="showTheme">
      <el-divider content-position="left">主题</el-divider>
      <el-form-item label="主题模式">
        <el-radio-group v-model="theme">
          <el-radio-button
            v-for="o in themeOptions"
            :key="o.value"
            :value="o.value"
          >
            {{ o.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
    </template>

    <template v-if="showWordFont || showPhoneticFont || showUiFont || showFontUpload">
      <el-divider content-position="left">字体</el-divider>
      <el-form-item v-if="showWordFont" label="单词字体">
        <el-select v-model="wordFont" style="width: 100%">
          <el-option
            v-for="o in fontOptions"
            :key="o.value"
            :label="o.label"
            :value="o.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="showPhoneticFont" label="注音字体">
        <el-select v-model="phoneticFont" style="width: 100%">
          <el-option
            v-for="o in fontOptions"
            :key="o.value"
            :label="o.label"
            :value="o.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="showUiFont" label="UI 字体">
        <div class="font-row">
          <div class="font-col">
            <span class="font-sub-label">西文</span>
            <el-select v-model="uiFont">
              <el-option
                v-for="o in fontOptions"
                :key="o.value"
                :label="o.label"
                :value="o.value"
              />
            </el-select>
          </div>
          <div v-if="showCnFonts" class="font-col">
            <span class="font-sub-label">中文</span>
            <el-select v-model="uiFontCn" clearable placeholder="系统默认">
              <el-option
                v-for="o in fontOptionsCn"
                :key="o.value"
                :label="o.label"
                :value="o.value"
              />
            </el-select>
          </div>
        </div>
      </el-form-item>
      <el-form-item v-if="showFontUpload">
        <GebineeButton @click="emit('pick-font-file')">
          <el-icon><Upload /></el-icon>
          <span>上传字体文件</span>
        </GebineeButton>
        <span class="hint">支持 ttf/otf/woff/woff2</span>
      </el-form-item>
    </template>

    <!-- 消费项目可在此追加自定义设置项 -->
    <slot />
  </el-form>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-left: 8px;
}

.font-row {
  display: flex;
  gap: 12px;
  width: 100%;
}
.font-col {
  flex: 1;
  min-width: 0;
}
.font-sub-label {
  display: block;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-bottom: 4px;
}

/*noinspection CssUnusedSymbol*/
:deep(.el-divider__text) {
  font-size: 15px;
  font-weight: 600;
}
</style>
