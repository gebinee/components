// 内置 gebinee 字体：运行时注入 @font-face
// 开发模式：new URL 指向源码中的字体文件，vite dev server 正确处理
// 库模式：vite 插件（emit-builtin-font）会把路径改写为 ./assets/aaae.ttf 并 emit 字体文件
const fontUrl = new URL("../assets/fonts/aaae.ttf", import.meta.url).href;

let injected = false;

/** 注入内置 gebinee 字体（幂等，重复调用安全） */
export function injectBuiltinFont(): void {
  if (injected) return;
  if (document.getElementById("gebinee-builtin-font")) return;
  const style = document.createElement("style");
  style.id = "gebinee-builtin-font";
  style.textContent = `@font-face { font-family: 'gebinee'; src: url('${fontUrl}') format('truetype'); font-display: swap; }`;
  document.head.appendChild(style);
  injected = true;
}

// 模块加载时自动注入
injectBuiltinFont();
