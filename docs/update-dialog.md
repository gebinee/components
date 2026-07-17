# UpdateDialog

基于 `@tauri-apps/plugin-updater` 的自动更新对话框。状态机驱动，支持检查更新、下载安装、Markdown 更新日志渲染、错误重试。

## 基本用法

```vue
<script setup lang="ts">
import { ref } from "vue";
import { UpdateDialog } from "@gebinee/components";

const visible = ref(false);
</script>

<template>
  <GebineeButton class="gebinee--btn-green" @click="visible = true">检查更新</GebineeButton>
  <UpdateDialog v-model:visible="visible" :timeout="20000" />
</template>
```

对话框打开时会自动触发检查更新。

## 状态机

```
┌──────────┐  check()   ┌───────────┐
│ checking │ ─────────► │ available │ ── 点击"立即更新" ──► downloading ──► installing ──► relaunch
└──────────┘            └───────────┘
     │                       │
     │ check() null          │ check() error / download error
     ▼                       ▼
┌──────────┐            ┌───────┐
│ noUpdate │            │ error │ ── 点击"重试" ──► checking
└──────────┘            └───────┘
```

| 状态 | 说明 | 底部按钮 |
|---|---|---|
| `checking` | 正在检查更新 | "请稍候"（disabled + loading） |
| `available` | 发现新版本 | "稀后再说" + "立即更新" |
| `noUpdate` | 已是最新版本 | "关闭" |
| `downloading` | 正在下载更新 | "请稍候"（disabled + loading） |
| `installing` | 安装完成，正在重启 | "请稍候"（disabled + loading） |
| `error` | 检查/下载失败 | "关闭" + "重试" |

## Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `visible` | `boolean` | `false` | 对话框显隐（支持 `v-model:visible`） |
| `errorMessageFn` | `ErrorMessageFn \| null` | `null` | 自定义错误信息提取函数。不传则使用包内默认 `errorMessage` |
| `timeout` | `number` | `20000` | 检查更新超时时间（毫秒） |

### ErrorMessageFn 类型

```ts
type ErrorMessageFn = (e: unknown) => string;
```

```vue
<script setup lang="ts">
import { UpdateDialog, type ErrorMessageFn } from "@gebinee/components";

const customErrorFn: ErrorMessageFn = (e) => {
  // 自定义错误信息提取逻辑
  if (e instanceof Error) return e.message;
  return "更新失败，请稍后重试";
};
</script>

<template>
  <UpdateDialog v-model:visible="visible" :error-message-fn="customErrorFn" />
</template>
```

## Events

| 事件名 | 参数 | 说明 |
|---|---|---|
| `update:visible` | `(value: boolean)` | 对话框显隐变化时触发 |

## 更新日志渲染

更新说明使用 `marked` 解析为 HTML，启用 GFM（表格、删除线、任务列表）和换行符转换。

渲染样式通过 scoped 深度选择器控制，支持以下 Markdown 元素：

- 标题（h1-h4）
- 段落、列表（ul/ol）
- 代码块（pre/code）
- 链接（a）
- 引用块（blockquote）
- 表格（table/th/td）
- 分割线（hr）
- 图片（img）

> **注意**：组件使用 `marked.parse(body, { gfm: true, breaks: true })` 传参方式解析，**不会**修改 `marked` 的全局配置，不影响消费项目的 `marked` 使用。

## 竞态保护

对话框每次打开都会触发 `onCheck()`。若用户快速关闭再打开，组件通过序号（`checkSeq`）机制确保仅处理最新一次检查的结果，避免竞态条件导致的状态不一致。

## 自定义错误信息

默认的 `errorMessage` 函数兼容以下错误格式：

- `string`：直接返回
- `{ kind, message }`（Tauri AppError 风格）：返回 `kind：message` 或 `message`
- `Error` 对象：返回 `e.message`
- 其他：`String(e)`

若消费项目有特殊的错误格式，可传入 `errorMessageFn` 覆盖默认行为。

## 完整示例

```vue
<script setup lang="ts">
import { ref } from "vue";
import { UpdateDialog, type ErrorMessageFn } from "@gebinee/components";

const visible = ref(false);

const onError: ErrorMessageFn = (e: unknown): string => {
  const err = e as { code?: number; message?: string };
  if (err?.code === 404) return "更新服务器不可用（404）";
  if (err?.message) return err.message;
  return "未知错误";
};
</script>

<template>
  <UpdateDialog
    v-model:visible="visible"
    :timeout="15000"
    :error-message-fn="onError"
  />
</template>
```

## 注意事项

- 对话框使用 `destroy-on-close`，关闭时销毁内容
- `Update` 对象使用 `shallowRef` 存储（避免 Vue 响应式代理破坏其内部 private 字段）
- 下载进度通过 `el-progress` 展示，基于 `contentLength` 和 `chunkLength` 计算
- 安装完成后会调用 `relaunch()` 重启应用
