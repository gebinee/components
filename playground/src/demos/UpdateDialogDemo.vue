<script setup lang="ts">
import { ref } from "vue";
import { UpdateDialog } from "@gebinee/components";

const visible = ref(false);

type MockMode = "available" | "noUpdate" | "error";

const mockMode = ref<MockMode>("available");

function open(mode: MockMode) {
  mockMode.value = mode;
  // 通过全局变量控制 mock 返回
  (globalThis as { __updateMock: { mode: MockMode } }).__updateMock.mode = mode;
  visible.value = true;
}
</script>

<template>
  <div class="demo">
    <section class="demo-section">
      <h3>预览不同状态</h3>
      <p class="desc">UpdateDialog 内部会自动检查更新。通过下面按钮切换 mock 状态后打开对话框。</p>
      <div class="row">
        <button class="open-btn" @click="open('available')">有新版本</button>
        <button class="open-btn outline" @click="open('noUpdate')">已是最新</button>
        <button class="open-btn outline" @click="open('error')">检查失败</button>
      </div>
    </section>

    <section class="demo-section">
      <h3>说明</h3>
      <ul class="notes">
        <li>「有新版本」：可点击"立即更新"，mock 会模拟下载进度（约 2.5 秒）</li>
        <li>「已是最新」：显示绿色对勾</li>
        <li>「检查失败」：显示错误信息与"重试"按钮</li>
        <li>所有 tauri 调用均已被 mock，不会真实访问网络或重启</li>
      </ul>
    </section>

    <UpdateDialog v-model:visible="visible" :timeout="5000" />
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
.row { display: flex; gap: 12px; flex-wrap: wrap; }
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
.open-btn.outline {
  background: #fff;
  color: #1a7f37;
  border: 1px solid #2da44e;
}
.open-btn.outline:hover { background: #e3f4e9; }
.notes {
  font-size: 13px;
  color: var(--el-text-color-regular);
  line-height: 1.8;
  padding-left: 20px;
}
</style>
