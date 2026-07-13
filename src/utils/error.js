// 通用错误信息提取：兼容 Tauri 命令返回的字符串、Error 对象、{kind,message} 结构
// 项目方可传入自定义 errorMessage 函数覆盖此实现
export function errorMessage(e) {
  if (e == null) return "未知错误";
  if (typeof e === "string") return e;
  // Tauri AppError 风格：{ kind, message }
  const kind = e.kind;
  const msg = e.message;
  if (kind === "Other" && typeof msg === "string") return msg;
  if (kind && typeof msg === "string") return `${kind}：${msg}`;
  if (kind) return String(kind);
  if (typeof msg === "string") return msg;
  if (e instanceof Error) return e.message || String(e);
  return String(e);
}
