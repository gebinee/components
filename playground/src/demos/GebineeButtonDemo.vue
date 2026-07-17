<script setup lang="ts">
import { Download } from "@element-plus/icons-vue";
import { GebineeButton } from "@gebinee/components";
</script>

<template>
  <div class="demo">
    <section class="demo-section">
      <h3>颜色变体</h3>
      <div class="row">
        <GebineeButton class="gebinee--btn-green">保存</GebineeButton>
        <!-- 以下两种写法等价：手动加 class / 自动应用 -->
        <GebineeButton type="success" plain class="gebinee--btn-success-hover">
          <span>编辑（手动 class）</span>
        </GebineeButton>
        <GebineeButton type="success" plain>
          <span>编辑（自动应用）</span>
        </GebineeButton>
      </div>
    </section>

    <section class="demo-section">
      <h3>带图标</h3>
      <div class="row">
        <GebineeButton class="gebinee--btn-green">
          <el-icon><Download /></el-icon>
          <span>下载</span>
        </GebineeButton>
      </div>
    </section>

    <section class="demo-section">
      <h3>状态</h3>
      <div class="row">
        <GebineeButton class="gebinee--btn-green" disabled>禁用</GebineeButton>
        <GebineeButton class="gebinee--btn-green" :loading="true">加载中</GebineeButton>
      </div>
    </section>
  </div>
</template>

<style scoped>
.demo { display: flex; flex-direction: column; gap: 28px; }
.demo-section h3 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 14px;
  color: var(--el-text-color-primary);
}
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
</style>
