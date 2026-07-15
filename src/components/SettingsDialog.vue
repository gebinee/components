<script setup lang="ts">
import { Brush, Check, Close, Coin, InfoFilled, Refresh } from "@element-plus/icons-vue";
import { getVersion } from "@tauri-apps/api/app";
import { ElDialog, ElIcon } from "element-plus";
import { ref, computed, watch, type Component } from "vue";
import AppearanceTab from "./AppearanceTab.vue";
import DatabaseTab from "./DatabaseTab.vue";
import GebineeButton from "./GebineeButton.vue";
import UpdateDialog from "./UpdateDialog.vue";
import type {
  AppearanceSettings,
  DatabaseConfig,
  FontOption,
  SettingsTab,
} from "../types";

const props = withDefaults(
  defineProps<{
    visible?: boolean;
    // 应用名称（显示在"关于"tab）
    appName?: string;
    // 应用图标组件（Element Plus icon 组件，如 EditPen）
    appIcon?: Component | null;
    // 应用版本号。不传则运行时通过 getVersion() 读取 tauri.conf.json
    appVersion?: string;
    // 对话框标题
    title?: string;
    // 对话框宽度
    width?: string;
    // 自定义 tab 列表：[{ name: 'database', label: '数据库', icon: Coin }]
    tabs?: SettingsTab[];
    // 是否显示内置"关于"tab
    showAboutTab?: boolean;
    // 是否在"关于"tab 显示"检查更新"按钮
    showUpdateButton?: boolean;
    // 保存按钮 loading 状态（由父组件控制，因为保存逻辑在父组件中）
    saving?: boolean;
    // 默认激活的 tab name。空字符串表示自动选中第一个 tab
    activeTabName?: string;
    // 是否显示内置"外观"tab
    showAppearanceTab?: boolean;
    // 是否显示内置"数据库"tab
    showDatabaseTab?: boolean;
    // 外观配置（v-model:appearance）
    appearance?: AppearanceSettings;
    // 数据库配置（v-model:database）
    database?: DatabaseConfig;
    // 字体选项：[{ label, value }]
    fontOptions?: FontOption[];
  }>(),
  {
    visible: false,
    appName: "",
    appIcon: null,
    appVersion: "",
    title: "软件设置",
    width: "640px",
    tabs: () => [],
    showAboutTab: true,
    showUpdateButton: true,
    saving: false,
    activeTabName: "",
    showAppearanceTab: false,
    showDatabaseTab: false,
    appearance: () => ({}),
    database: () => ({}),
    fontOptions: () => [],
  },
);

const emit = defineEmits<{
  "update:visible": [value: boolean];
  "update:appearance": [value: AppearanceSettings];
  "update:database": [value: DatabaseConfig];
  "pick-database-file": [];
  "pick-font-file": [];
  save: [];
  cancel: [];
}>();

const innerActive = ref("");
const updateDialogVisible = ref(false);
const fetchedVersion = ref("");

// 版本号：优先用 prop 传入，否则运行时读取
const displayVersion = computed(
  () => props.appVersion || fetchedVersion.value || "未知",
);

// 完整的 tab 列表（内置 database → 内置 appearance → 自定义 tabs → 内置"关于"tab）
const allTabs = computed<SettingsTab[]>(() => {
  const list: SettingsTab[] = [];
  if (props.showDatabaseTab) {
    list.push({ name: "__database__", label: "数据库", icon: Coin, builtin: true });
  }
  if (props.showAppearanceTab) {
    list.push({ name: "__appearance__", label: "外观", icon: Brush, builtin: true });
  }
  list.push(...props.tabs);
  if (props.showAboutTab) {
    list.push({ name: "__about__", label: "关于", icon: InfoFilled, builtin: true });
  }
  return list;
});

watch(
  () => props.visible,
  (v) => {
    if (v) {
      // 打开时确定默认激活的 tab（按 allTabs 顺序取第一个）
      if (props.activeTabName) {
        innerActive.value = props.activeTabName;
      } else if (allTabs.value.length > 0) {
        innerActive.value = allTabs.value[0].name;
      }
      // 若未传 appVersion，则运行时获取
      if (!props.appVersion && !fetchedVersion.value) {
        getVersion()
          .then((ver) => (fetchedVersion.value = ver))
          .catch(() => (fetchedVersion.value = "未知"));
      }
    }
  },
  { immediate: true },
);

// 外观配置双向代理
const appearanceProxy = computed({
  get: () => props.appearance,
  set: (v) => emit("update:appearance", v),
});

// 数据库配置双向代理
const databaseProxy = computed({
  get: () => props.database,
  set: (v) => emit("update:database", v),
});

function onSave(): void {
  emit("save");
}

function onCancel(): void {
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
        <!-- 内置"数据库"tab -->
        <div
          v-if="showDatabaseTab"
          v-show="innerActive === '__database__'"
          class="tab-pane"
        >
          <DatabaseTab
            v-model="databaseProxy"
            @pick-database-file="emit('pick-database-file')"
          />
        </div>

        <!-- 内置"外观"tab -->
        <div
          v-if="showAppearanceTab"
          v-show="innerActive === '__appearance__'"
          class="tab-pane"
        >
          <AppearanceTab
            v-model="appearanceProxy"
            :font-options="fontOptions"
            @pick-font-file="emit('pick-font-file')"
          />
        </div>

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
          <GebineeButton
            v-if="showUpdateButton"
            @click="updateDialogVisible = true"
          >
            <el-icon><Refresh /></el-icon>
            <span>检查更新</span>
          </GebineeButton>
          <!-- 关于 tab 额外内容插槽 -->
          <slot name="about-extra" />
        </div>
      </div>
    </div>

    <template #footer>
      <slot name="footer-extra" />
      <GebineeButton @click="onCancel">
        <el-icon><Close /></el-icon>
        <span>取消</span>
      </GebineeButton>
      <GebineeButton
        class="btn-green"
        :loading="saving"
        @click="onSave"
      >
        <el-icon><Check /></el-icon>
        <span>保存</span>
      </GebineeButton>
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

/*noinspection CssUnusedSymbol*/
:deep(.el-divider__text) {
  font-size: 15px;
  font-weight: 600;
}
</style>
