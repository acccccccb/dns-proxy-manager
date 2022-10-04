<script setup>
    import { h, defineComponent } from 'vue';
    import { RouterLink } from 'vue-router';
    import IconRender from '../Modules/IconRender.vue';
</script>
<template>
    <div class="sider-logo-main" @click="$router.push({ path: '/' })">
        <div
            class="sider-logo"
            :style="{
                width: $store.state.collapsed ? 48 + 'px' : 68 + 'px',
            }"
        >
            <img src="/vite.svg" />
        </div>
        <div v-show="!$store.state.collapsed" class="sider-title">DPM</div>
    </div>
    <n-menu :options="menuOptions" :value="name" :inverted="$store.state.darkMode" />
</template>
<script>
    export default {
        name: 'SideMenu',
        data() {
            return {
                menuOptions: [],
                name: '',
            };
        },
        created() {
            this.name = this.$route.name;
            const menuRouters = this.$router.options?.routes[0]?.children || [];
            const menuOptions = menuRouters.map((item) => {
                return {
                    label: () =>
                        h(
                            RouterLink,
                            {
                                to: {
                                    name: item.name,
                                },
                            },
                            { default: () => item.meta.title || item.name }
                        ),
                    key: item.name,
                    icon: () => h(IconRender, { name: item.meta.icon }),
                };
            });
            this.menuOptions = menuOptions;
        },
        watch: {
            $route(to, from) {
                this.name = to.name;
            },
        },
    };
</script>
<style lang="scss">
    .sider-logo-main {
        display: flex;
        justify-content: flex-start;
        height: 50px;
        line-height: 50px;
        cursor: pointer;
        box-shadow: 0 1px 1px 0px rgba(255, 255, 255, 0.1);

        .sider-logo {
            transition: all 0.5s;
            text-align: center;
            width: 48px;
            padding: 12px 8px;
            box-sizing: border-box;

            img {
                width: 26px;
                height: 26px;
            }
        }
        .sider-title {
            text-align: center;
        }
    }
</style>
