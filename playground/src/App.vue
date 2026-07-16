<script setup lang="ts">
import { ref, shallowRef, markRaw } from "vue";
import {
  Setting as IconSettings,
  EditPen as IconEdit,
  Document as IconDoc,
  Grid as IconGrid,
  Box as IconBox,
  Refresh as IconUpdate,
} from "@element-plus/icons-vue";
import GebineeButtonDemo from "./demos/GebineeButtonDemo.vue";
import GebineeInputDemo from "./demos/GebineeInputDemo.vue";
import AppearanceTabDemo from "./demos/AppearanceTabDemo.vue";
import DatabaseTabDemo from "./demos/DatabaseTabDemo.vue";
import SettingsDialogDemo from "./demos/SettingsDialogDemo.vue";
import UpdateDialogDemo from "./demos/UpdateDialogDemo.vue";

interface DemoEntry {
  name: string;
  label: string;
  icon: typeof IconSettings;
  component: typeof GebineeButtonDemo;
}

const demos: DemoEntry[] = [
  { name: "button", label: "GebineeButton", icon: markRaw(IconBox), component: markRaw(GebineeButtonDemo) },
  { name: "input", label: "GebineeInput", icon: markRaw(IconEdit), component: markRaw(GebineeInputDemo) },
  { name: "appearance", label: "AppearanceTab", icon: markRaw(IconGrid), component: markRaw(AppearanceTabDemo) },
  { name: "database", label: "DatabaseTab", icon: markRaw(IconDoc), component: markRaw(DatabaseTabDemo) },
  { name: "settings", label: "SettingsDialog", icon: markRaw(IconSettings), component: markRaw(SettingsDialogDemo) },
  { name: "update", label: "UpdateDialog", icon: markRaw(IconUpdate), component: markRaw(UpdateDialogDemo) },
];

const current = shallowRef<DemoEntry>(demos[0]);
</script>

<template>
  <div class="pg-layout">
    <aside class="pg-sidebar">
      <div class="pg-logo">组件预览</div>
      <nav class="pg-nav">
        <button
          v-for="d in demos"
          :key="d.name"
          class="pg-nav-item"
          :class="{ active: current.name === d.name }"
          @click="current = d"
        >
          <el-icon><component :is="d.icon" /></el-icon>
          <span>{{ d.label }}</span>
        </button>
      </nav>
    </aside>
    <main class="pg-main">
      <header class="pg-header">
        <h1>{{ current.label }}</h1>
      </header>
      <div class="pg-content">
        <component :is="current.component" />
      </div>
    </main>
  </div>
</template>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #app { height: 100%; }
body {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: var(--el-text-color-primary);
  background: var(--el-bg-color-page);
}
</style>

<style scoped>
.pg-layout {
  display: flex;
  height: 100vh;
}
.pg-sidebar {
  width: 220px;
  flex-shrink: 0;
  background: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color-light);
  display: flex;
  flex-direction: column;
}
.pg-logo {
  padding: 16px 20px;
  font-size: 16px;
  font-weight: 600;
  color: #2da44e;
  border-bottom: 1px solid var(--el-border-color-lighter);
}
.pg-nav {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}
.pg-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border: none;
  background: transparent;
  color: var(--el-text-color-regular);
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}
.pg-nav-item:hover {
  background: var(--el-fill-color-light);
}
.pg-nav-item.active {
  background: #2da44e;
  color: #fff;
}
.pg-nav-item.active :deep(.el-icon) {
  color: #fff;
}
.pg-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.pg-header {
  height: 56px;
  flex-shrink: 0;
  padding: 0 24px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  display: flex;
  align-items: center;
}
.pg-header h1 {
  font-size: 18px;
  font-weight: 600;
}
.pg-content {
  flex: 1;
  overflow: auto;
  padding: 24px;
}
</style>
