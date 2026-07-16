<script setup lang="ts">
import { ref } from "vue";
import { GebineeInput } from "@gebinee/components";

const text = ref("hello world");
const textarea = ref("多行文本输入\n第二行");
const empty = ref("");
</script>

<template>
  <div class="demo">
    <section class="demo-section">
      <h3>基础输入</h3>
      <div class="col">
        <GebineeInput v-model="text" placeholder="请输入内容" />
        <div class="value-preview">值：{{ text }}</div>
      </div>
    </section>

    <section class="demo-section">
      <h3>占位符</h3>
      <GebineeInput v-model="empty" placeholder="这是 placeholder 文字" />
    </section>

    <section class="demo-section">
      <h3>文本域</h3>
      <div class="col">
        <GebineeInput v-model="textarea" type="textarea" :rows="3" placeholder="多行输入" />
        <div class="value-preview">值：{{ textarea }}</div>
      </div>
    </section>

    <section class="demo-section">
      <h3>禁用状态</h3>
      <GebineeInput model-value="禁用内容" disabled />
    </section>

    <section class="demo-section">
      <h3>可清空</h3>
      <GebineeInput v-model="text" clearable placeholder="可清空" />
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
.col { display: flex; flex-direction: column; gap: 8px; }
.value-preview {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  padding: 6px 10px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
}
</style>
