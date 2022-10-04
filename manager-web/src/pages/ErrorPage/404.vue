<template>
    <n-layout style="width: 100vw; height: 100vh">
        <n-space vertical size="large" justify="center" style="width: 100vw; height: 100vh; text-align: center">
            <n-result status="404" title="404 资源不存在" description="生活总归带点荒谬">
                <template #footer>
                    <n-button @click="$router.push({ path: '/' })">回到首页</n-button>
                </template>
            </n-result>
        </n-space>
    </n-layout>
</template>
<script>
    export default {
        name: '404',
    };
</script>
