<template>
    <n-config-provider :hljs="hljs">
        <n-space vertical>
            <n-card size="medium" embedded>
                <n-thing content-indented>
                    <template #avatar>
                        <img src="/vite.svg" />
                    </template>
                    <template #header> DPM(dns proxy manager) v1.0.0 </template>
                    <template #description> vite + vue3 </template>
                        图形化DNS代理管理器，告别修改host文件的繁琐，支持通配符 <br>

                        <ul>
                            <li>运行环境：nodejs v14.20 npm v7.17</li>
                            <li>Web服务：node-serve</li>
                            <li>Dns代理：dns2</li>
                            <li>数据库：tingodb</li>
                            <li>进程管理：pm2</li>
                        </ul>
                    <template #footer>
                        仓库地址：
                        <n-button
                            text
                            type="primary"
                            tag="a"
                            href="https://github.com/acccccccb/dns-proxy-manager"
                            target="_blank"
                        >
                            https://github.com/acccccccb/dns-proxy-manager
                        </n-button>
                    </template>
                </n-thing>
            </n-card>
            <n-card title="start.sh" size="medium">
                <n-code :code="getCode(startSh)" language="bash" show-line-numbers></n-code>
            </n-card>
        </n-space>
    </n-config-provider>
</template>
<script>
    import { defineComponent } from 'vue';
    import hljs from 'highlight.js/lib/core';
    // import javascript from 'highlight.js/lib/languages/javascript';
    import bash from 'highlight.js/lib/languages/bash';
    // hljs.registerLanguage('javascript', javascript);
    hljs.registerLanguage('bash', bash);

    import { getList } from '../api/home.js';

    export default defineComponent({
        setup() {
            return {
                hljs,
            };
        },
        name: 'Home',
        data() {
            return {
                startSh: [
                    'cd /app/manager-serve && pm2 start npm -- run start',
                    'serve /app/manager-web/dist -n'
                ],
            };
        },
        methods: {
            getData() {
                getList().then((res) => {
                    console.log(res);
                });
            },
            showMessage() {
                this.$message.success('showMessage');
            },
            getCode(code) {
                return code.join('\r\n');
            },
        },
    });
</script>
