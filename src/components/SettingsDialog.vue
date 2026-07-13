<script setup>
import { ref, computed, watch } from "vue";
import { getVersion } from "@tauri-apps/api/app";
import {
  Check,
  Close,
  InfoFilled,
  Refresh,
} from "@element-plus/icons-vue";
// 显式导入 Element Plus 组件，使包自包含、不依赖消费项目的自动导入配置
import { ElDialog, ElIcon, ElButton } from "element-plus";
import UpdateDialog from "./UpdateDialog.vue";

const props = defineProps({
  visible: { type: Boolean, default: false },
  // 应用名称（显示在"关于"tab）
  appName: { type: String, default: "" },
  // 应用图标组件（Element Plus icon 组件，如 EditPen）
  appIcon: { type: [Object, Function], default: null },
  // 应用版本号。不传则运行时通过 getVersion() 读取 tauri.conf.json
  appVersion: { type: String, default: "" },
  // 对话框标题
  title: { type: String, default: "软件设置" },
  // 对话框宽度
  width: { type: String, default: "640px" },
  // 自定义 tab 列表：[{ name: 'database', label: '数据库', icon: Coin }]
  tabs: { type: Array, default: () => [] },
  // 是否显示内置"关于"tab
  showAboutTab: { type: Boolean, default: true },
  // 是否在"关于"tab 显示"检查更新"按钮
  showUpdateButton: { type: Boolean, default: true },
  // 保存按钮 loading 状态（由父组件控制，因为保存逻辑在父组件中）
  saving: { type: Boolean, default: false },
  // 默认激活的 tab name。空字符串表示自动选中第一个 tab
  activeTabName: { type: String, default: "" },
});

const emit = defineEmits(["update:visible", "save", "cancel"]);

const innerActive = ref("");
const updateDialogVisible = ref(false);
const fetchedVersion = ref("");

// 版本号：优先用 prop 传入，否则运行时读取
const displayVersion = computed(
  () => props.appVersion || fetchedVersion.value || "未知"
);

watch(
  () => props.visible,
  (v) => {
    if (v) {
      // 打开时确定默认激活的 tab
      if (props.activeTabName) {
        innerActive.value = props.activeTabName;
      } else if (props.tabs.length > 0) {
        innerActive.value = props.tabs[0].name;
      } else if (props.showAboutTab) {
        innerActive.value = "__about__";
      }
      // 若未传 appVersion，则运行时获取
      if (!props.appVersion && !fetchedVersion.value) {
        getVersion()
          .then((v) => (fetchedVersion.value = v))
          .catch(() => (fetchedVersion.value = "未知"));
      }
    }
  },
  { immediate: true }
);

// 完整的 tab 列表（自定义 tabs + 内置"关于"tab）
const allTabs = computed(() => {
  const list = [...props.tabs];
  if (props.showAboutTab) {
    list.push({ name: "__about__", label: "关于", icon: InfoFilled, builtin: true });
  }
  return list;
});

function onSave() {
  emit("save");
}

function onCancel() {
  emit("cancel");
  emit("update:visible", false);
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="emit('update:visible', $event)"
    :title="title"
    :width="width"
    align-center
    destroy-on-close
  >
    <div class="settings-layout">
      <aside class="settings-sidebar">
        <div
          v-for="tab in allTabs"
          :key="tab.name"
          class="sidebar-item"
          :class="{ active: innerActive === tab.name }"
          @click="innerActive = tab.name"
        >
          <el-icon v-if="tab.icon"><component :is="tab.icon" /></el-icon>
          <span>{{ tab.label }}</span>
        </div>
        <!-- sidebar 末尾追加项（如额外的链接/按钮） -->
        <slot name="sidebar-extra" />
      </aside>

      <div class="settings-content">
        <!-- 自定义 tab 内容：每个 tab 通过 #tab-{name} 插槽传入 -->
        <div
          v-for="tab in tabs"
          :key="tab.name"
          v-show="innerActive === tab.name"
          class="tab-pane"
        >
          <slot :name="`tab-${tab.name}`" />
        </div>

        <!-- 内置"关于"tab -->
        <div
          v-if="showAboutTab && innerActive === '__about__'"
          class="tab-pane about-pane"
        >
          <div class="about-info">
            <el-icon v-if="appIcon" :size="40" color="#409eff">
              <component :is="appIcon" />
            </el-icon>
            <div class="about-text">
              <div class="app-name">{{ appName }}</div>
              <div class="app-version">版本 {{ displayVersion }}</div>
            </div>
          </div>
          <el-button
            v-if="showUpdateButton"
            class="btn-check-update"
            @click="updateDialogVisible = true"
          >
            <el-icon><Refresh /></el-icon>
            <span>检查更新</span>
          </el-button>
          <!-- 关于 tab 额外内容插槽 -->
          <slot name="about-extra" />
        </div>
      </div>
    </div>

    <template #footer>
      <slot name="footer-extra" />
      <el-button class="btn-side" @click="onCancel">
        <el-icon><Close /></el-icon>
        <span>取消</span>
      </el-button>
      <el-button
        class="btn-green btn-side"
        :loading="saving"
        @click="onSave"
      >
        <el-icon><Check /></el-icon>
        <span>保存</span>
      </el-button>
    </template>

    <!-- 内置检查更新对话框 -->
    <UpdateDialog
      v-if="showUpdateButton"
      v-model:visible="updateDialogVisible"
    />
  </el-dialog>
</template>

<style scoped>
.settings-layout {
  display: flex;
  min-height: 320px;
}
.settings-sidebar {
  width: 140px;
  flex-shrink: 0;
  border-right: 1px solid var(--el-border-color-light, #ebeef5);
  padding: 8px 0;
}
.sidebar-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 15px;
  color: var(--el-text-color-regular);
  transition: all 0.2s;
}
.sidebar-item:hover {
  background: var(--el-fill-color-light, #f5f7fa);
}
.sidebar-item.active {
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  border-right: 2px solid var(--el-color-primary);
}
.settings-content {
  flex: 1;
  padding: 0 20px;
  min-width: 0;
}
.tab-pane {
  min-height: 300px;
}
.about-pane {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding-top: 20px;
}
.about-info {
  display: flex;
  align-items: center;
  gap: 16px;
}
.about-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.app-name {
  font-size: 18px;
  font-weight: 600;
}
.app-version {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}
.btn-check-update {
  height: 38px;
}

/*noinspection CssUnusedSymbol*/
:deep(.el-divider__text) {
  font-size: 15px;
  font-weight: 600;
}
:deep(.btn-side) {
  height: 38px;
}
</style>
