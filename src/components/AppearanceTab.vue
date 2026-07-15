<script setup>
import { computed } from "vue";
import { ElForm, ElFormItem, ElDivider, ElRadioGroup, ElRadioButton, ElSelect, ElOption, ElButton, ElIcon } from "element-plus";
import { Upload } from "@element-plus/icons-vue";

const props = defineProps({
  modelValue: { type: Object, required: true },
  fontOptions: { type: Array, default: () => [] },
});

const emit = defineEmits(["update:modelValue", "pick-font-file"]);

const themeOptions = [
  { label: "浅色模式", value: "light" },
  { label: "深色模式", value: "dark" },
  { label: "跟随系统", value: "auto" },
];

// 代理单个字段的更新
function updateField(field, value) {
  emit("update:modelValue", { ...props.modelValue, [field]: value });
}

const fontSize = computed({
  get: () => props.modelValue.font_size ?? 14,
  set: (v) => updateField("font_size", v),
});
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
const theme = computed({
  get: () => props.modelValue.theme ?? "auto",
  set: (v) => updateField("theme", v),
});
</script>

<template>
  <el-form label-position="top">
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

    <el-divider content-position="left">字体</el-divider>
    <el-form-item label="单词字体">
      <el-select v-model="wordFont" style="width: 100%">
        <el-option
          v-for="o in fontOptions"
          :key="o.value"
          :label="o.label"
          :value="o.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="注音字体">
      <el-select v-model="phoneticFont" style="width: 100%">
        <el-option
          v-for="o in fontOptions"
          :key="o.value"
          :label="o.label"
          :value="o.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="UI 字体">
      <el-select v-model="uiFont" style="width: 100%">
        <el-option
          v-for="o in fontOptions"
          :key="o.value"
          :label="o.label"
          :value="o.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button @click="emit('pick-font-file')">
        <el-icon><Upload /></el-icon>
        <span>上传字体文件</span>
      </el-button>
      <span class="hint">支持 ttf/otf/woff/woff2</span>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-left: 8px;
}
:deep(.el-divider__text) {
  font-size: 15px;
  font-weight: 600;
}
</style>