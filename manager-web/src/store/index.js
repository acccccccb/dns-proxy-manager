import { createStore } from 'vuex';

const darkMode = window.localStorage.getItem('darkMode') === 'true' ? true : false;
const collapsed = window.localStorage.getItem('collapsed') === 'true' ? true : false;
// 创建一个新的 store 实例
const store = createStore({
    state() {
        return {
            darkMode,
            collapsed,
            menus: [
                {
                    path: 'DnsManager',
                    name: 'DnsManager',
                    component: 'DnsManager/Index',
                    title: 'DNS服务管理',
                    icon: 'Cloud',
                },
                {
                    path: 'ProxyManager',
                    name: 'ProxyManager',
                    component: 'ProxyManager/Index',
                    title: '代理管理',
                    icon: 'Server',
                },
            ],
        };
    },
    mutations: {
        setCollapsed(state, status) {
            state.collapsed = status;
            window.localStorage.setItem('collapsed', status);
        },
        toggleCollapsed(state) {
            state.collapsed = !state.collapsed;
            window.localStorage.setItem('collapsed', state.collapsed);
        },
        toggleDarkMode(state) {
            state.darkMode = !state.darkMode;
            window.localStorage.setItem('darkMode', state.darkMode);
        },
        toggleDarkMode(state) {
            state.darkMode = !state.darkMode;
            window.localStorage.setItem('darkMode', state.darkMode);
        },
    },
});
export default store;
