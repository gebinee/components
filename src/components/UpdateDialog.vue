<script setup>
import { ref, shallowRef, computed } from "vue";
import { marked } from "marked";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { errorMessage as defaultErrorMessage } from "../utils/error.js";
import {
  CircleCheck,
  CircleCheckFilled,
  CircleCloseFilled,
  Download,
  Loading,
  Refresh,
} from "@element-plus/icons-vue";
// 显式导入 Element Plus 组件，使包自包含、不依赖消费项目的自动导入配置
import { ElDialog, ElIcon, ElButton, ElProgress } from "element-plus";

const props = defineProps({
  visible: { type: Boolean, default: false },
  // 自定义错误信息提取函数（可选）。不传则使用包内默认实现
  errorMessageFn: { type: Function, default: null },
  // 检查更新超时时间（毫秒），默认 20 秒
  timeout: { type: Number, default: 20000 },
});

const emit = defineEmits(["update:visible"]);

// 配置 marked：启用 GFM（表格、删除线、任务列表等）
marked.setOptions({
  gfm: true,
  breaks: true,
});

function errMsg(e) {
  const fn = props.errorMessageFn || defaultErrorMessage;
  return fn(e);
}

// 状态机：checking -> available -> noUpdate -> error
// available 下点击"立即更新" -> downloading -> installing
const status = ref("checking");
// Update 对象内部含 private 字段，必须用 shallowRef 避免 Vue 响应式代理破坏其访问
const updateInfo = shallowRef(null);
const errorMsg = ref("");
const percent = ref(0);

// 将更新说明 markdown 解析为 HTML
const releaseNotesHtml = computed(() => {
  if (!updateInfo.value || !updateInfo.value.body) return "";
  return marked.parse(updateInfo.value.body);
});

async function onCheck() {
  status.value = "checking";
  errorMsg.value = "";
  updateInfo.value = null;
  percent.value = 0;
  try {
    const update = await check({ timeout: props.timeout });
    if (update) {
      updateInfo.value = update;
      status.value = "available";
    } else {
      status.value = "noUpdate";
    }
  } catch (e) {
    errorMsg.value = errMsg(e);
    status.value = "error";
  }
}

async function onInstall() {
  status.value = "downloading";
  percent.value = 0;
  try {
    let downloaded = 0;
    let contentLength = 0;
    await updateInfo.value.downloadAndInstall((event) => {
      switch (event.event) {
        case "Started":
          contentLength = event.data.contentLength || 0;
          break;
        case "Progress":
          downloaded += event.data.chunkLength;
          if (contentLength > 0) {
            percent.value = Math.min(
              100,
              Math.round((downloaded / contentLength) * 100)
            );
          }
          break;
        case "Finished":
          percent.value = 100;
          break;
      }
    });
    status.value = "installing";
    await relaunch();
  } catch (e) {
    errorMsg.value = errMsg(e);
    status.value = "error";
  }
}

function onClose() {
  emit("update:visible", false);
}

// 对话框打开时自动检查
function onOpen() {
  onCheck();
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="emit('update:visible', $event)"
    @open="onOpen"
    title="检查更新"
    width="480px"
    align-center
    destroy-on-close
  >
    <div class="update-body">
      <!-- 检查中 -->
      <div v-if="status === 'checking'" class="state">
        <el-icon class="is-loading" :size="32"><Loading /></el-icon>
        <p>正在检查更新...</p>
      </div>

      <!-- 有新版本 -->
      <div v-else-if="status === 'available'" class="state">
        <el-icon :size="36" color="#2da44e"><CircleCheckFilled /></el-icon>
        <p class="new-version">
          发现新版本 <strong>v{{ updateInfo.version }}</strong>
        </p>
        <div v-if="updateInfo.body" class="release-notes">
          <div class="notes-title">更新说明：</div>
          <div class="markdown-body" v-html="releaseNotesHtml"></div>
        </div>
        <p v-if="updateInfo.date" class="pub-date">
          发布日期：{{ new Date(updateInfo.date).toLocaleDateString() }}
        </p>
      </div>

      <!-- 已是最新 -->
      <div v-else-if="status === 'noUpdate'" class="state">
        <el-icon :size="36" color="#409eff"><CircleCheck /></el-icon>
        <p>当前已是最新版本</p>
      </div>

      <!-- 下载安装中 -->
      <div v-else-if="status === 'downloading'" class="state">
        <el-icon class="is-loading" :size="32"><Download /></el-icon>
        <p>正在下载更新...</p>
        <el-progress :percentage="percent" :stroke-width="8" />
      </div>

      <div v-else-if="status === 'installing'" class="state">
        <el-icon class="is-loading" :size="32"><Loading /></el-icon>
        <p>安装完成，正在重启应用...</p>
      </div>

      <!-- 出错 -->
      <div v-else-if="status === 'error'" class="state">
        <el-icon :size="36" color="#f56c6c"><CircleCloseFilled /></el-icon>
        <p class="error-text">检查更新失败</p>
        <p class="error-detail">{{ errorMsg }}</p>
      </div>
    </div>

    <template #footer>
      <template v-if="status === 'available'">
        <el-button class="btn-side" @click="onClose">稍后再说</el-button>
        <el-button class="btn-green btn-side" @click="onInstall">
          <el-icon><Download /></el-icon>
          <span>立即更新</span>
        </el-button>
      </template>
      <template v-else-if="status === 'error'">
        <el-button class="btn-side" @click="onClose">关闭</el-button>
        <el-button class="btn-side" @click="onCheck">
          <el-icon><Refresh /></el-icon>
          <span>重试</span>
        </el-button>
      </template>
      <template v-else-if="status === 'noUpdate'">
        <el-button class="btn-side" @click="onClose">关闭</el-button>
      </template>
      <template v-else>
        <el-button class="btn-side" disabled :loading="true">请稍候</el-button>
      </template>
    </template>
  </el-dialog>
</template>

<style scoped>
.update-body {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
}
.state p {
  margin: 0;
  font-size: 16px;
  text-align: center;
}
.new-version {
  font-size: 18px;
}
.new-version strong {
  color: #2da44e;
}
.release-notes {
  width: 100%;
  max-height: 180px;
  overflow-y: auto;
  background: var(--el-fill-color-light, #f5f7fa);
  border-radius: 6px;
  padding: 10px 12px;
  margin-top: 4px;
}
.notes-title {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-bottom: 6px;
}
/* Markdown 渲染样式 */
.markdown-body {
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
}
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4) {
  margin: 10px 0 6px;
  font-weight: 600;
  line-height: 1.3;
}
.markdown-body :deep(h1) { font-size: 18px; }
.markdown-body :deep(h2) { font-size: 16px; }
.markdown-body :deep(h3),
.markdown-body :deep(h4) { font-size: 15px; }
.markdown-body :deep(p) {
  margin: 6px 0;
}
.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 6px 0;
  padding-left: 22px;
}
.markdown-body :deep(li) {
  margin: 3px 0;
}
.markdown-body :deep(code) {
  padding: 2px 5px;
  background: var(--el-fill-color-dark, rgba(0,0,0,0.08));
  border-radius: 3px;
  font-family: Consolas, Monaco, "Courier New", monospace;
  font-size: 13px;
}
.markdown-body :deep(pre) {
  margin: 6px 0;
  padding: 8px 10px;
  background: var(--el-fill-color-dark, rgba(0,0,0,0.08));
  border-radius: 4px;
  overflow-x: auto;
}
.markdown-body :deep(pre code) {
  padding: 0;
  background: transparent;
  font-size: 13px;
}
.markdown-body :deep(a) {
  color: var(--el-color-primary, #409eff);
  text-decoration: none;
}
.markdown-body :deep(a:hover) {
  text-decoration: underline;
}
.markdown-body :deep(blockquote) {
  margin: 6px 0;
  padding: 4px 10px;
  border-left: 3px solid var(--el-border-color, #dcdfe6);
  color: var(--el-text-color-secondary, #909399);
}
.markdown-body :deep(table) {
  border-collapse: collapse;
  margin: 6px 0;
  width: 100%;
}
.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid var(--el-border-color, #dcdfe6);
  padding: 4px 8px;
  text-align: left;
}
.markdown-body :deep(th) {
  background: var(--el-fill-color, #f5f7fa);
  font-weight: 600;
}
.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid var(--el-border-color, #dcdfe6);
  margin: 10px 0;
}
.markdown-body :deep(img) {
  max-width: 100%;
}
.pub-date {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
.error-text {
  font-size: 17px;
  color: #f56c6c;
}
.error-detail {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  max-width: 400px;
  word-break: break-word;
}
:deep(.btn-side) {
  height: 38px;
}
</style>
