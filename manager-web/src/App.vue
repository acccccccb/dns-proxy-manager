<script setup>
    // This starter template is using Vue 3 <script setup> SFCs
    // Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
    import Message from './components/Modules/Message.vue';
    import Dialog from './components/Modules/Dialog.vue';
    import { darkTheme, lightTheme } from 'naive-ui';
</script>

<template>
    <n-config-provider
        :theme="$store.state.darkMode === true ? darkTheme : lightTheme"
        style="width: 100vw; height: 100vh"
        :theme-overrides="{ common: { fontWeightStrong: '600' } }"
    >
        <n-message-provider>
            <n-dialog-provider>
                <Message></Message>
                <Dialog></Dialog>
                <router-view></router-view>
            </n-dialog-provider>
        </n-message-provider>
    </n-config-provider>
</template>
<style scoped></style>
