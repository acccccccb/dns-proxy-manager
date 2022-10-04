<script setup>
    import { useMessage } from 'naive-ui';
</script>
<template></template>
<script>
    export default {
        name: 'Message',
        mounted() {
            this.$setup('message', useMessage);
        },
    }
</script>