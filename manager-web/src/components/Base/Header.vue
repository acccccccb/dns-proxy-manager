<script setup>
    import IconRender from '../Modules/IconRender.vue';
</script>
<template>
    <n-page-header style="height: 28px; overflow: hidden; box-sizing: border-box">
        <template #avatar>
            <IconRender :name="icon"></IconRender>
        </template>
        <template #title>{{ $route.meta.title || $route.name }}</template>
        <template #subtitle v-if="$route.name !== 'Home'">
            <n-breadcrumb>
                <n-breadcrumb-item v-for="item in matched" :key="item.name">
                    <router-link :to="item.path">{{ item.meta.title || item.name }}</router-link>
                </n-breadcrumb-item>
            </n-breadcrumb>
        </template>
        <template #extra>
            <n-space>
                <n-button @click="toggleDarkMode" type="default" size="small" round>
                    <template #icon>
                        <IconRender v-if="$store.state.darkMode" :size="16" name="Sunny"></IconRender>
                        <IconRender v-else :size="16" name="Moon"></IconRender>
                    </template>
                </n-button>
                <n-button @click="logout" type="default" size="small" round>
                    <template #icon>
                        <IconRender :size="18" name="LogInOutline"></IconRender>
                    </template>
                </n-button>
            </n-space>
        </template>
    </n-page-header>
</template>
<script>
    import { restart } from '../../api/common.js';
    export default {
        name: 'Header',
        data() {
            return {
                matched: [],
                name: '',
                icon: 'HomeFilled',
            };
        },
        created() {
            this.matched = this.$route.matched;
            this.name = this.$route.name;
            this.icon = this.$route.meta.icon;
            console.log('this.$route', this.$route);
        },
        methods: {
            logout() {
                this.$dialog.warning({
                    title: '确认要退出登录吗？',
                    // content: '确认要退出登录吗？',
                    positiveText: '退出',
                    negativeText: '取消',
                    onPositiveClick: () => {
                        // this.$router.push({ name: 'Login' });
                        window.localStorage.removeItem('Access-Token');
                        window.location.href = '/';
                    },
                });
            },
            toggleDarkMode() {
                this.$store.commit('toggleDarkMode');
            },
            restartServe() {
                this.$dialog.warning({
                    title: '确认要重启服务吗？',
                    // content: '确认要重启服务吗？',
                    positiveText: '重启',
                    negativeText: '取消',
                    onPositiveClick: () => {
                        restart().then((res) => {
                            if (res.status === 0) {
                                this.$message.loading('正在重启服务...');
                            }
                        });
                    },
                });
            },
        },
        watch: {
            $route(to, from) {
                this.matched = to.matched;
                this.name = to.name;
                this.icon = this.$route.meta.icon;
            },
        },
    };
</script>
