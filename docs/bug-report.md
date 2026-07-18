# BUG 报告与修复说明

本文档记录组件库代码审查中发现的问题及修复方案。

---

## BUG-1：按钮样式无效 CSS 变量与遗留调试注释

**严重程度**：低  
**状态**：已修复

### 问题

按钮样式（原 `src/styles/button.css`，已迁入 `GebineeButton.vue` 的 `<style scoped>`）中存在 3 个无效或不确定的 CSS 变量和调试注释：

```css
--el-button-outline-color: #b3e19d; /* 干嘛的这个 */
--el-button-hover-link-text-color: #b3e19d; /* 干嘛的这个 */
--el-button-active-color: #298e46; /* 干嘛的这个 */
```

- `--el-button-active-color` 不是 Element Plus Button 的有效 CSS 变量（有效的是 `-text-color` / `-bg-color` / `-border-color`，均已存在）
- `--el-button-outline-color` 和 `--el-button-hover-link-text-color` 对 ElButton 无实际效果
- `/* 干嘛的这个 */` 注释表明开发时对变量作用不确定

### 修复

删除以上 3 行无效 CSS 变量及调试注释，并将按钮样式从 `src/styles/button.css` 迁入 [GebineeButton.vue](file:///d:/workspace/gebinee/components/src/components/GebineeButton.vue) 的 `<style scoped>` 内，提升内聚性。`src/styles/button.css` 文件已删除，`index.css` 中对应导入已移除。

---

## BUG-2：`UpdateDialog.vue` 模块加载时修改全局 `marked` 配置

**严重程度**：中  
**状态**：已修复

### 问题

```ts
// 模块顶层（import 时即执行）
marked.setOptions({
  gfm: true,
  breaks: true,
});
```

`marked.setOptions()` 修改的是 `marked` 单例的全局配置。若消费项目也使用 `marked` 且需要不同配置（如不启用 `breaks`），会被组件库覆盖。

### 修复

删除 `marked.setOptions()` 调用，改为在 `releaseNotesHtml` computed 内通过 `marked.parse()` 第二参数传参：

```ts
const markedOptions = { gfm: true, breaks: true } as const;

const releaseNotesHtml = computed(() => {
  if (!updateInfo.value || !updateInfo.value.body) return "";
  return marked.parse(updateInfo.value.body, markedOptions) as string;
});
```

---

## BUG-3：`UpdateDialog.vue` 的 `onCheck()` 竞态条件

**严重程度**：中  
**状态**：已修复

### 问题

对话框每次 `@open` 都调用 `onCheck()`。若用户快速关闭再打开对话框：

1. 第一次 `onCheck()` 发起 `check()` 请求，等待响应
2. 第二次 `onCheck()` 再次发起 `check()` 请求
3. 第一次请求 resolve，设置 `status = "available"`
4. 第二次请求 resolve，覆盖状态

两次并发请求的结果可能不一致，导致状态闪烁或错误。

### 修复

引入 `checkSeq` 序号机制，每次 `onCheck` 递增并捕获当前序号，异步回调比对序号后处理：

```ts
const checkSeq = ref(0);

async function onCheck(): Promise<void> {
  const seq = ++checkSeq.value;
  status.value = "checking";
  // ...
  try {
    const update = await check({ timeout: props.timeout });
    if (seq !== checkSeq.value) return; // 丢弃过期结果
    // ...
  } catch (e) {
    if (seq !== checkSeq.value) return; // 丢弃过期错误
    // ...
  }
}
```

---

## BUG-4：`base.css` 全局 reset 侵入消费项目

**严重程度**：中  
**状态**：已修复

### 问题

```css
/* 注释写"非侵入性"，但实际是全局规则 */
* { box-sizing: border-box; }
html, body, #app { height: 100%; margin: 0; padding: 0; }
```

这些全局规则会覆盖消费项目自身的 reset / layout，与"组件样式 scoped 无全局侵入"的设计目标矛盾。

### 修复

- 删除 `* {}` 和 `html, body, #app {}` 全局规则
- 保留 `:root` 变量声明（CSS 自定义属性天然全局，但不影响渲染）
- 保留 `.gebinee` 作用域样式
- 在文档中说明：消费项目需自行添加全高度布局的 reset

---

## BUG-5：`SettingsDialog.vue` 关于 tab 图标颜色硬编码为蓝色

**严重程度**：低  
**状态**：已修复

### 问题

```vue
<el-icon v-if="appIcon" :size="40" color="#409eff">
```

使用 Element Plus 默认蓝色 `#409eff`，与项目 GitHub 绿色主题（`#2da44e`）不一致。`UpdateDialog` 内的成功图标已统一使用 `#2da44e`，此处遗漏。

### 修复

新增 `iconColor` prop（默认 `#2da44e`），替换硬编码：

```vue
<el-icon v-if="appIcon" :size="40" :color="iconColor">
```

---

## BUG-6：`font.ts` 加载器未注册时静默失败

**严重程度**：低  
**状态**：已修复

### 问题

```ts
if (!font || injectedFonts.has(font.name) || !fontLoaderFn) return;
```

当 `fontLoaderFn` 为 `null`（加载器未注册）时，函数静默返回，调用方无法感知注册失败，难以排查问题。

### 修复

分离判断，加载器未注册时输出 `console.warn`：

```ts
if (!font || injectedFonts.has(font.name)) return;
if (!fontLoaderFn) {
  console.warn("[gebinee] 字体加载器未注册，请先调用 registerFontLoader() 注册");
  return;
}
```

---

## BUG-7：`AppearanceSettings.font_size` 在 AppearanceTab 中无对应 UI

**严重程度**：低（功能缺口）  
**状态**：已过时（`AppearanceSettings` 类型已移除 `font_size` 字段）

### 问题

~~`AppearanceSettings` 类型包含 `font_size` 字段，`applyAppearance()` 会应用它，但 `AppearanceTab` 没有任何 UI 控件来设置它。消费项目需通过其他方式设置字号。~~

### 处理

`AppearanceSettings` 类型已移除 `font_size` 字段。`applyAppearance()` 也不再设置 `--gebinee-font-size` 变量。消费项目如需控制字号，可直接在 CSS 中通过 `--gebinee-font-size` 变量设置（该变量在 `base.css` 的 `:root` 中预声明为 `14px`）。

---

## 设计改进：SettingsDialog 可定制性增强

**状态**：已实现

### 背景

内置 tab（外观、数据库）的设置项完全写死，消费项目无法控制单个设置项的显隐，也无法在内置 tab 中追加自定义设置项。

### 改动

1. **AppearanceTab** 新增 5 个 `showXxx` props（`showTheme` / `showWordFont` / `showPhoneticFont` / `showUiFont` / `showFontUpload`），均默认 `true`
2. **DatabaseTab** 新增 `showPath` prop，默认 `true`
3. **AppearanceTab** 和 **DatabaseTab** 新增默认插槽，渲染在表单末尾
4. **SettingsDialog** 透传以上 props 到内置 tab，并新增 `appearance-extra` / `database-extra` 插槽
5. **SettingsDialog** 新增 `dbPlaceholder` prop 透传给 DatabaseTab

所有新增 props 默认值与原行为一致，完全向后兼容。
