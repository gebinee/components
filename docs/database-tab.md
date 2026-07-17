# DatabaseTab

数据库路径设置表单，包含路径输入框和"选择"按钮。支持 `v-model` 双向绑定，可控制路径输入项的显隐，并可通过默认插槽追加自定义设置项。

## 基本用法

```vue
<script setup lang="ts">
import { ref } from "vue";
import { DatabaseTab, type DatabaseConfig } from "@gebinee/components";

const db = ref<DatabaseConfig>({ db_path: "C:/Users/data/words.db" });

function onPick() {
  // 调用 Tauri 文件选择对话框
  // const selected = await open({ filters: [{ name: 'SQLite', extensions: ['db'] }] });
  // db.value = { db_path: selected };
}
</script>

<template>
  <DatabaseTab
    v-model="db"
    placeholder="选择数据库文件路径"
    @pick-database-file="onPick"
  />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | `DatabaseConfig` | — | 数据库配置（v-model 绑定） |
| `placeholder` | `string` | `"数据库文件路径"` | 路径输入框 placeholder |
| `showPath` | `boolean` | `true` | 是否显示数据库路径输入行 |

### DatabaseConfig 类型

```ts
interface DatabaseConfig {
  db_path?: string;
}
```

## Events

| 事件名 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `(value: DatabaseConfig)` | 配置变化时触发 |
| `pick-database-file` | — | 点击"选择"按钮时触发，消费项目应在此事件中调用文件选择对话框 |

## Slots

| 插槽 | 说明 |
|---|---|
| 默认插槽 | 渲染在路径输入项之后，供消费项目追加自定义设置项 |

```vue
<DatabaseTab v-model="db" @pick-database-file="onPick">
  <el-form-item label="自动备份">
    <el-switch v-model="autoBackup" />
  </el-form-item>
</DatabaseTab>
```

## 细粒度控制

通过 `showPath` 控制路径输入项的显隐：

```vue
<!-- 只显示自定义设置项，不显示路径输入 -->
<DatabaseTab
  v-model="db"
  :show-path="false"
  @pick-database-file="onPick"
>
  <el-form-item label="备份路径">
    <GebineeInput v-model="backupPath" />
  </el-form-item>
</DatabaseTab>
```

## 注意事项

- 组件内部使用 `GebineeInput` 和 `GebineeButton`，样式统一
- 路径输入和选择按钮在同一行（flex 布局）
- `pick-database-file` 事件仅通知消费项目，实际的文件选择逻辑由消费项目实现
