import { defineAsyncComponent } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import store from '../store/index.js';
let modules = import.meta.glob('../pages/**/*.vue');

const routeGenerater = () => {
    const routerList = store.state.menus;
    return routerList.map((item) => {
        return {
            path: item.path,
            name: item.name,
            component: modules[`../pages/${item.component}.vue`],
            meta: {
                title: item.title,
                icon: item.icon,
            },
        };
    });
};
const routes = [
    {
        path: '/',
        name: 'Index',
        redirect: '/Home',
        component: () => import('../layout/DefaultLayout.vue'),
        meta: {
            title: '首页',
        },
        children: [
            {
                path: 'Home',
                name: 'Home',
                component: () => import('../pages/Home.vue'),
                meta: {
                    title: '首页',
                    icon: 'Home',
                },
            },
            ...routeGenerater(),
        ],
    },
    {
        path: '/Auth',
        name: 'Auth',
        component: () => import('../layout/SingelPage.vue'),
        children: [
            {
                path: 'Login',
                name: 'Login',
                component: () => import('../pages/Login.vue'),
            },
        ],
    },
    {
        path: '/:pathMatch(.*)',
        name: 'Error',
        component: () => import('../pages/ErrorPage/404.vue'),
    },
];
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});
router.beforeEach((to, from, next) => {
    const noAuth = ['Login'];
    // 如果在不需要验证的页面中 直接跳转
    if (noAuth.indexOf(to.name) > -1) {
        next();
    } else {
        // 否则 判断是否拥有token
        if (window.localStorage.getItem('Access-Token')) {
            next();
        } else {
            next({ name: 'Login' });
        }
    }
});
export default router;
