<script setup>
    // This starter template is using Vue 3 <script setup> SFCs
    // Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
    import Header from '../components/Base/Header.vue';
    import SideMenu from '../components/Base/SideMenu.vue';
    import Footer from '../components/Base/Footer.vue';
</script>

<template>
    <n-space vertical size="large" style="width: 100vw; height: 100vh">
        <n-layout style="width: 100vw; height: 100vh">
            <n-layout has-sider>
                <n-layout-sider
                    content-style="padding: 0;"
                    bordered
                    collapse-mode="width"
                    :collapsed-width="48"
                    :width="180"
                    show-trigger
                    :inverted="$store.state.darkMode"
                    :collapsed="$store.state.collapsed"
                    @collapse="$store.commit('setCollapsed', true)"
                    @expand="$store.commit('setCollapsed', false)"
                >
                    <SideMenu></SideMenu>
                </n-layout-sider>
                <n-layout>
                    <n-layout-header style="padding: 11px 24px; box-shadow: 0 1px 1px 0px rgba(255, 255, 255, 0.1)">
                        <Header></Header>
                    </n-layout-header>
                    <n-layout-content content-style="padding: 12px;height: calc(100vh - 100px);overflow: hidden;">
                        <n-scrollbar style="height: calc(100vh - 130px)">
                            <router-view></router-view>
                        </n-scrollbar>
                    </n-layout-content>
                    <n-layout-footer style="height: 50px; padding: 0"> <Footer></Footer> </n-layout-footer>
                </n-layout>
            </n-layout>
        </n-layout>
    </n-space>
</template>
<script>
    export default {
        name: 'DefaultLayout',
        data() {
            return {
                collapsed: window.localStorage.getItem('collapsed') === 'true',
            };
        },
        watch: {
            collapsed(val) {
                window.localStorage.setItem('collapsed', val);
            },
        },
    };
</script>
<style scoped></style>
