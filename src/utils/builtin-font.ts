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
