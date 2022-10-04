<template>
    <n-grid :x-gap="12" :y-gap="8" :cols="24">
        <n-grid-item :span="24">
            <n-card title="服务配置" :bordered="true" role="dialog" aria-modal="true">
                <template #header-extra>
                    <n-space v-if="form">
                        <n-button type="primary" @click="showOptionsModal()">设置</n-button>
                        <n-button type="default" quaternary @click="uninstall"> 
                            <template #icon>
                                <IconRender :size="16" name="Trash"></IconRender>
                            </template>
                        </n-button>
                    </n-space>
                </template>
                <n-descriptions :column="4" label-placement="left" v-if="form">
                    <n-descriptions-item label="port">
                        {{form.port}}
                    </n-descriptions-item>
                    <n-descriptions-item label="type">
                        {{form.type}}
                    </n-descriptions-item>
                    <n-descriptions-item label="fallback_timeout">
                        {{form.fallback_timeout}}
                    </n-descriptions-item>
                    <n-descriptions-item label="external_dns">
                        {{form.external_dns}}
                    </n-descriptions-item>
                </n-descriptions>
                <n-skeleton v-else text :repeat="2" />
                <EditForm ref="editFormRef" @refresh="getConfig"></EditForm>
            </n-card>
        </n-grid-item>

        <n-grid-item :span="24">
            <n-card title="服务状态" :bordered="true" role="dialog" aria-modal="true">
                <template #header-extra>
                    <n-space v-if="serveInfoText">
                        <n-button type="default" :disabled="serveInfoText.status === 'online'" :loading="statusLoading" @click="postServeStart()">启动服务</n-button>
                        <n-button type="default" :disabled="serveInfoText.status === 'stopped'" :loading="statusLoading" @click="postServeStop()">停止服务</n-button>
                        <n-button type="default" :disabled="serveInfoText.status !== 'online'" :loading="statusLoading" @click="postServeRestart()">重启服务</n-button>
                        <n-button type="default" :loading="statusLoading" @click="postServeInfo()">刷新服务状态</n-button>
                    </n-space>
                </template>
                <n-descriptions :column="4" label-placement="left" v-if="serveInfoText">
                    <n-descriptions-item label="id">
                        {{serveInfoText.id}}
                    </n-descriptions-item>
                    <n-descriptions-item label="name">
                        {{serveInfoText.name}}
                    </n-descriptions-item>
                    <n-descriptions-item label="namespace">
                        {{serveInfoText.namespace}}
                    </n-descriptions-item>
                    <n-descriptions-item label="version">
                        {{serveInfoText.version}}
                    </n-descriptions-item>
                    <n-descriptions-item label="mode">
                        {{serveInfoText.mode}}
                    </n-descriptions-item>
                    <n-descriptions-item label="pid">
                        {{serveInfoText.pid}}
                    </n-descriptions-item>
                    <n-descriptions-item label="uptime">
                        {{serveInfoText.uptime}}
                    </n-descriptions-item>
                    <n-descriptions-item label="restart">
                        {{serveInfoText.restart}}
                    </n-descriptions-item>
                    <n-descriptions-item label="status">
                        <n-tag type="success" size="small" v-if="serveInfoText.status === 'online'">
                            运行中
                        </n-tag>
                        <n-tag type="error" size="small" v-else>
                            已停止
                        </n-tag>
                    </n-descriptions-item>
                    <n-descriptions-item label="cpu">
                        {{serveInfoText.cpu}}
                    </n-descriptions-item>
                    <n-descriptions-item label="mem">
                        {{serveInfoText.mem}}
                    </n-descriptions-item>
                    <n-descriptions-item label="user">
                        {{serveInfoText.user}}
                    </n-descriptions-item>
                </n-descriptions>
                <n-skeleton v-else text :repeat="5" />
            </n-card>
        </n-grid-item>
        
        <n-grid-item :span="24">
            <n-config-provider :hljs="hljs">
                <n-card title="日志" :bordered="true" role="dialog" aria-modal="true">
                    <template #header-extra>
                        <n-space>
                            <n-button type="default" @click="postServeLogClear()">清空日志</n-button>
                            <n-button type="default" @click="postServeLog()">刷新日志</n-button>
                        </n-space>
                    </template>
                        <n-log
                            :rows="15"
                            ref="logInstRef"
                            :lines="log"
                            :loading="logLoading"
                            trim
                        />
                </n-card>
            </n-config-provider>
        </n-grid-item>
    </n-grid>

</template>
<script>
    import { uninstall } from '../../api/common.js';
    import { defineComponent } from 'vue';
    import hljs from 'highlight.js/lib/core';
    import bash from 'highlight.js/lib/languages/bash';
    import { getConfig, postConfigUpdate, postServeInfo, postServeLog, postServeStop, postServeStart, postServeRestart, postServeLogClear } from '../../api/dns.js';
    import EditForm from './EditForm.vue';
    import IconRender from '../../components/Modules/IconRender.vue';
export default defineComponent({
    name: 'DnsManager',
    setup() {
        hljs.registerLanguage('bash', bash);
        return {
            hljs,
        };
    },
    components: {
        EditForm,
        IconRender
    },
    data() {
        return {
            logLoading: false,
            statusLoading: false,
            submitLoading: false,
            loading: false,
            form: {
                _id: null,
                external_dns: [],
                fallback_timeout: null,
                port: null,
                type: null,
            },
            serveInfoText: null,
            log: [],
        };
    },
    created() {
        this.getConfig();
        this.postServeInfo();
        this.postServeLog();
    },
    methods: {
        uninstall() {
            this.$dialog.error({
                title: '确认要清空数据库吗？',
                content: '将会清空所有数据并停止服务。',
                positiveText: '清空并停止服务',
                negativeText: '取消',
                onPositiveClick: () => {
                    uninstall().then((res) => {
                        if (res.status === 0) {
                            this.$message.success(res.message);
                            setTimeout(() => {
                                window.location.href = '/#/Auth/Login';
                            }, 1500);
                        }
                    });
                },
            });
            
        },
        showOptionsModal(){
            this.$refs.editFormRef.show();
        },
        postServeStart() {
            this.statusLoading = true;
            postServeStart().then(res => {
                this.statusLoading = false;
                this.postServeInfo();
            });
        },
        postServeStop() {
            this.statusLoading = true;
            postServeStop().then(res => {
                this.statusLoading = false;
                this.postServeInfo();
            });
        },
        postServeRestart() {
            this.statusLoading = true;
            postServeRestart().then(res => {
                this.statusLoading = false;
                this.postServeInfo();
            });
        },
        postServeLog() {
            this.logLoading = true;
            postServeLog().then(res => {
                this.logLoading = false;
                this.log = res.message;
                this.$nextTick(() => {
                    this.$refs.logInstRef?.scrollTo({ position: 'bottom', slient: true });
                });
            });
        },
        postServeLogClear() {
            this.logLoading = true;
            postServeLogClear().then(res => {
                this.logLoading = false;
                this.postServeLog();
            });
        },
        postServeInfo() {
            this.statusLoading = true;
            postServeInfo().then(res => {
                this.statusLoading = false;
                this.serveInfoText = res.message;
            });
        },
        getConfig() {
            this.loading = true;
            getConfig().then((res) => {
                this.loading = false;
                this.form._id = res.data._id;
                this.form.external_dns = res.data.external_dns;
                this.form.fallback_timeout = res.data.fallback_timeout;
                this.form.port = res.data.port;
                this.form.type = res.data.type;
            });
        },
        submit() {
            this.submitLoading = true;
            postConfigUpdate(this.form).then((res) => {
                this.submitLoading = false;
                if (res.status === 0) {
                    this.$message.success(res.message);
                    this.getConfig();
                }
            });
        },
    },
});
</script>
