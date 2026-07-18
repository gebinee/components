# 工具函数

组件库导出以下工具函数，供消费项目使用。

## errorMessage

通用错误信息提取函数，兼容 Tauri AppError 风格、Error 对象、字符串等多种格式。

```ts
import { errorMessage } from "@gebinee/components";

try {
  await someTauriCommand();
} catch (e) {
  const msg = errorMessage(e);
  ElMessage.error(msg);
}
```

### 处理规则

| 输入类型 | 返回值 |
|---|---|
| `null` / `undefined` | `"未知错误"` |
| `string` | 原值 |
| `{ kind: "Other", message: "xxx" }` | `"xxx"` |
| `{ kind: "SomeKind", message: "xxx" }` | `"SomeKind：xxx"` |
| `{ kind: "SomeKind" }`（无 message） | `"SomeKind"` |
| `{ message: "xxx" }`（无 kind） | `"xxx"` |
| `Error` 对象 | `e.message` |
| 其他 | `String(e)` |

### 类型

```ts
type ErrorMessageFn = (e: unknown) => string;
```

> 可通过 `UpdateDialog` 的 `errorMessageFn` prop 传入自定义实现覆盖默认行为。

---

## applyAppearance

将 `AppearanceSettings` 应用到 `document.documentElement` 的 CSS 变量和 `.dark` 主题类。

```ts
import { applyAppearance, type AppearanceSettings } from "@gebinee/components";

const settings: AppearanceSettings = {
  word_font: "gebinee",
  phonetic_font: "gebinee",
  ui_font: "system-ui",
  ui_font_cn: "微软雅黑",
  theme: "dark",
};

applyAppearance(settings);
```

### 设置的 CSS 变量

| CSS 变量 | 来源字段 | 默认值 | 作用范围 |
|---|---|---|---|
| `--gebinee-word-font` | `word_font` | `gebinee` | 由消费项目引用 |
| `--gebinee-phonetic-font` | `phonetic_font` | `gebinee` | 由消费项目引用 |
| `--gebinee-ui-font` | `ui_font` + `ui_font_cn` | `system-ui` | 由消费项目引用 |

> `--gebinee-ui-font` 会合并 `ui_font`（西文）和 `ui_font_cn`（中文），构建 `"西文字体", "中文字体", sans-serif` 的 CSS font-family 回退链。当 `ui_font` 为 `system-ui` 时，自动替换为 `Arial, Helvetica, sans-serif` 以避免 `system-ui` 的 CJK 字形阻止中文字体回退。

### 主题应用

| `theme` 值 | 行为 |
|---|---|
| `"light"` | 移除 `.dark` 类 |
| `"dark"` | 添加 `.dark` 类 |
| `"auto"` | 根据 `prefers-color-scheme` 媒体查询决定 |

`auto` 模式下会监听系统主题变化，自动切换 `.dark` 类。监听器仅绑定一次（模块级 `mediaListenerBound` 标志）。

### 注意事项

- 字体变量加 `--gebinee` 前缀，避免与消费项目的 `--word-font` 等变量冲突
- `--gebinee-ui-font` 仅设置变量值，由消费项目自行引用（如 `--el-font-family: var(--gebinee-ui-font)`）
- 即使不调用 `applyAppearance()`，`:root` 也有默认变量声明（见 `base.css`），`var(--gebinee-xxx)` 可正常解析

---

## isSystemFontName

判断字体名是否为系统字体或内置字体。

```ts
import { isSystemFontName } from "@gebinee/components";

isSystemFontName("system-ui");    // true
isSystemFontName("gebinee");      // true
isSystemFontName("");             // true
isSystemFontName(null);           // true
isSystemFontName("微软雅黑");      // true（平台字体）
isSystemFontName("MyCustomFont"); // false
```

### 判断规则

以下值视为"系统/内置字体"：
- `null` / `undefined` / 空字符串
- `"system-ui"`、`"gebinee"`（组件库内置字体）
- 跨平台通用字体：`"arial"`、`"georgia"`、`"verdana"`、`"trebuchet ms"`、`"courier new"`
- Windows 平台字体：`"consolas"`、`"times new roman"`、`"segoe ui"`、`"微软雅黑"`、`"宋体"`、`"楷体"`、`"仿宋"`、`"黑体"`
- macOS 平台字体：`"helvetica"`、`"monaco"`、`"menlo"`、`"pingfang sc"`、`"heiti sc"`、`"stkaiti"`、`"stsong"`
- Linux 平台字体：`"dejavu sans"`、`"dejavu sans mono"`、`"liberation sans"`、`"liberation serif"`、`"noto sans cjk sc"`、`"noto serif cjk sc"`

### 用途

消费项目可根据此函数决定是否需要通过 `registerCustomFont` 注册字体：

```ts
if (!isSystemFontName(settings.word_font)) {
  await registerCustomFont({ name: settings.word_font, file_path: "..." });
}
```

---

## registerFontLoader

注册字体文件加载器函数。消费项目需提供读取字体文件并返回 data URL 的能力。

```ts
import { registerFontLoader } from "@gebinee/components";

registerFontLoader(async (filePath: string): Promise<string> => {
  // 通过 Tauri fs 插件读取字体文件
  const bytes = await readFile(filePath);
  const base64 = bytesToBase64(bytes);
  return `data:font/ttf;base64,${base64}`;
});
```

### 类型

```ts
type FontLoaderFn = (filePath: string) => Promise<string>;
```

返回值应为字体文件的 data URL（`data:font/...;base64,...`），供 `@font-face` 的 `src` 使用。

### 注意事项

- 必须在调用 `registerCustomFont` / `registerCustomFonts` 之前注册加载器
- 若未注册加载器，`registerCustomFont` 会输出 `console.warn` 并返回
- 加载器只需注册一次，全局生效

---

## registerCustomFont

注册单个自定义字体，注入 `@font-face` 规则到 `document.head`。

```ts
import { registerCustomFont, type CustomFont } from "@gebinee/components";

const font: CustomFont = {
  name: "MyFont",
  file_path: "/path/to/my-font.ttf",
};

await registerCustomFont(font);
```

### CustomFont 类型

```ts
interface CustomFont {
  name: string;       // 字体名（CSS font-family 名称）
  file_path: string;  // 字体文件路径（传给 fontLoaderFn）
}
```

### 字体格式推断

根据 `file_path` 的扩展名自动推断字体格式：

| 扩展名 | format |
|---|---|
| `.woff2` | `woff2` |
| `.woff` | `woff` |
| `.otf` | `opentype` |
| `.ttf` 或其他 | `truetype` |

### 注意事项

- 幂等：同名字体只注册一次（通过 `injectedFonts` Set 去重）
- 若 `fontLoaderFn` 未注册，输出 `console.warn` 并返回
- 注册后无法更新或移除（需刷新页面）

---

## registerCustomFonts

批量注册自定义字体，内部逐个调用 `registerCustomFont`，单个失败不影响其他字体。

```ts
import { registerCustomFonts, type CustomFont } from "@gebinee/components";

const fonts: CustomFont[] = [
  { name: "FontA", file_path: "/path/to/a.ttf" },
  { name: "FontB", file_path: "/path/to/b.woff2" },
  { name: "FontC", file_path: "/path/to/c.otf" },
];

await registerCustomFonts(fonts);
```

### 错误处理

单个字体注册失败时，输出 `console.error` 并继续注册下一个：

```ts
for (const f of fonts) {
  try {
    await registerCustomFont(f);
  } catch (e) {
    console.error("注册字体失败:", f.name, e);
  }
}
```

### 注意事项

- 串行注册（非并行），确保 `@font-face` 注入顺序
- 空数组或 `null` / `undefined` 直接返回

---

## getDefaultFontOptions

获取当前平台的默认西文字体选项列表。

```ts
import { getDefaultFontOptions } from "@gebinee/components";

const options = getDefaultFontOptions();
// 返回：FontOption[]，包含跨平台通用字体 + 当前平台专属字体
// 例如 Windows 上返回：[{ label: "跟随系统", value: "system-ui" }, { label: "Gebinee", ... }, ... { label: "Consolas", ... }, ...]
```

### 返回值

`FontOption[]`，包含以下字体（按平台不同）：

| 分类 | 字体 |
|---|---|
| 跨平台通用 | system-ui, gebinee, Arial, Georgia, Verdana, Trebuchet MS, Courier New |
| Windows | Consolas, Times New Roman, Segoe UI |
| macOS | Helvetica, Monaco, Menlo |
| Linux | DejaVu Sans, DejaVu Sans Mono, Liberation Sans, Liberation Serif |

> 该函数是 `AppearanceTab` 的 `fontOptions` 默认值来源。不包含"跟随系统"选项（该选项仅在 `fontOptionsCn` 中出现）。

---

## getDefaultFontOptionsCn

获取当前平台的中文字体选项列表。

```ts
import { getDefaultFontOptionsCn } from "@gebinee/components";

const options = getDefaultFontOptionsCn();
// 返回：FontOption[]，第一项为"跟随系统"（value 为空字符串），后续为当前平台中文字体
```

### 返回值

`FontOption[]`，第一项固定为 `{ label: "跟随系统", value: "" }`，后续按平台：

| 平台 | 字体 |
|---|---|
| Windows | 微软雅黑, 宋体, 楷体, 仿宋, 黑体 |
| macOS | PingFang SC, Heiti SC, STKaiti, STSong |
| Linux | Noto Sans CJK SC, Noto Serif CJK SC |

> 该函数是 `AppearanceTab` 的 `fontOptionsCn` 默认值来源。

---

## detectOS

检测当前操作系统类型。

```ts
import { detectOS, type OSType } from "@gebinee/components";

const os: OSType = detectOS();
// 返回 "windows" | "macos" | "linux"
```

### 检测方式

通过 `navigator.platform` 判断。在非浏览器环境（SSR）中默认返回 `"windows"`。

### OSType 类型

```ts
type OSType = "windows" | "macos" | "linux";
```

> 消费项目可根据此函数实现平台特定的逻辑（如加载不同平台的字体文件）。
