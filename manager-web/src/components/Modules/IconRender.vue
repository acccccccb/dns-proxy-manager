<script setup>
    import { h, defineComponent } from 'vue';
    import * as ionicons5 from '@vicons/ionicons5';
</script>
<template><n-icon :size="size" :component="ionicons5[name]" /></template>

<script>
    export default {
        name: 'IconRender',
        props: {
            name: {
                type: String,
                require: true,
                default: '',
            },
            size: {
                type: Number,
                default: 18,
                require: true,
            },
        },
        methods: {
            renderIcon() {
                return h(AbcFilled, {}, { default: () => null });
            },
        },
    };
</script>

<style scoped></style>
