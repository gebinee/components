// mock @tauri-apps/plugin-process
export async function relaunch(): Promise<void> {
  console.log("[mock] relaunch() 被调用，跳过真实重启");
}
