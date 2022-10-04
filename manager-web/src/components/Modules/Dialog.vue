<script setup>
    import { useDialog } from 'naive-ui';
</script>
<template></template>
<script>
    export default {
        name: 'Message',
        mounted() {
            this.$setup('dialog', useDialog);
        },
    }
</script>