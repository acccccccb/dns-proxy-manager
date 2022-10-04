import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router/index';
import store from './store/index';
// 通用字体
import 'vfonts/Lato.css';
// 等宽字体
import 'vfonts/FiraCode.css';

const app = createApp(App);
app.config.globalProperties.$setup = (name, func) => {
    app.config.globalProperties[`$${name}`] = func();
    window[`$${name}`] = func();
};
app.use(router);
app.use(store);
app.mount('#app');
