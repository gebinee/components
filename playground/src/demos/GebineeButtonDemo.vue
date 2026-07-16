<script setup lang="ts">
import { Download, Loading, Search } from "@element-plus/icons-vue";
import { GebineeButton } from "@gebinee/components";
</script>

<template>
  <div class="demo">
    <section class="demo-section">
      <h3>颜色变体</h3>
      <div class="row">
        <GebineeButton class="btn-green">保存</GebineeButton>
        <GebineeButton type="success" plain class="btn-success-hover">
          <span>编辑</span>
        </GebineeButton>
      </div>
    </section>

    <section class="demo-section">
      <h3>带图标</h3>
      <div class="row">
        <GebineeButton class="btn-green">
          <el-icon><Download /></el-icon>
          <span>下载</span>
        </GebineeButton>
      </div>
    </section>

    <section class="demo-section">
      <h3>状态</h3>
      <div class="row">
        <GebineeButton class="btn-green" disabled>禁用</GebineeButton>
        <GebineeButton class="btn-green" :loading="true">加载中</GebineeButton>
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
