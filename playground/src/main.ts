import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// 引入组件库自身样式（gebinee--btn-green 等类）
import "../../src/styles/index.css";
import App from "./App.vue";

const app = createApp(App);
app.use(ElementPlus);
app.mount("#app");
