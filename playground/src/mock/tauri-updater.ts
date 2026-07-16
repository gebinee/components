// mock @tauri-apps/plugin-updater
// 通过 __updateMock 控制返回的 Update 状态，便于预览 UpdateDialog 各分支

export interface DownloadEvent {
  event: "Started" | "Progress" | "Finished";
  data: { contentLength?: number; chunkLength?: number };
}

export interface Update {
  available: boolean;
  currentVersion: string;
  version: string;
  date?: string;
  body?: string;
  downloadAndInstall(onEvent?: (e: DownloadEvent) => void): Promise<void>;
}

export interface CheckOptions {
  timeout?: number;
}

// 全局 mock 状态：由 demo 控制切换
declare global {
  // eslint-disable-next-line no-var
  var __updateMock: {
    mode: "available" | "noUpdate" | "error";
    version?: string;
    body?: string;
    date?: string;
  };
}

globalThis.__updateMock = {
  mode: "available",
  version: "1.3.0",
  date: new Date().toISOString(),
  body: `## v1.3.0 更新内容\n\n- 新增**字体管理**功能\n- 优化深色模式切换\n- 修复若干已知问题\n\n### 完整日志\n\n- \`feat\`: 支持自定义字体上传\n- \`fix\`: 修复主题切换闪烁\n- \`refactor\`: 重构设置对话框`,
};

export async function check(_options?: CheckOptions): Promise<Update | null> {
  // 模拟网络延迟
  await new Promise((r) => setTimeout(r, 800));

  const m = globalThis.__updateMock;
  if (m.mode === "error") {
    throw new Error("模拟网络错误：无法连接到更新服务器");
  }
  if (m.mode === "noUpdate") {
    return null;
  }

  return {
    available: true,
    currentVersion: "1.2.0",
    version: m.version || "1.3.0",
    date: m.date,
    body: m.body,
    async downloadAndInstall(onEvent?: (e: DownloadEvent) => void): Promise<void> {
      const total = 1024 * 1024 * 8; // 8MB
      onEvent?.({ event: "Started", data: { contentLength: total } });
      // 模拟分块下载
      const chunkSize = total / 10;
      for (let i = 0; i < 10; i++) {
        await new Promise((r) => setTimeout(r, 250));
        onEvent?.({ event: "Progress", data: { chunkLength: chunkSize } });
      }
      onEvent?.({ event: "Finished" });
      // 不真正重启
      console.log("[mock] 更新下载安装完成，跳过重启");
    },
  };
}

export { Update };
