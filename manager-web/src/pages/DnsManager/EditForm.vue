<template>
    <n-modal title="编辑用户" v-model:show="visible" :mask-closable="false">
        <n-card style="width: 600px" :bordered="true" role="dialog" aria-modal="true">
            <div>
                <n-form ref="formRef" label-align="left" :model="form" autocomplete="off">
                    <n-form-item v-show="false" path="_id" label="_id" :rule="{
                        type: 'number',
                        required: true,
                        trigger: ['input', 'blur'],
                    }">
                        <n-input-number v-model:value="form._id" />
                    </n-form-item>
                    <n-form-item path="port" label="port" :rule="{
                        type: 'number',
                        required: true,
                        trigger: ['input', 'blur'],
                    }">
                        <n-input-number v-model:value="form.port" :min="0" :max="65535" />
                    </n-form-item>
                    <n-form-item path="type" label="type" :rule="{
                        required: true,
                        trigger: ['input', 'blur'],
                    }">
                        <n-radio-group v-model:value="form.type" name="type">
                            <n-radio-button value="udp4" label="udp4" />
                            <n-radio-button value="udp6" label="udp6" />
                        </n-radio-group>
                    </n-form-item>
                    <n-form-item path="fallback_timeout" label="fallback_timeout" :rule="{
                        type: 'number',
                        required: true,
                        trigger: ['input', 'blur'],
                    }">
                        <n-input-number v-model:value="form.fallback_timeout" :min="0" :max="30000" />
                    </n-form-item>
                    <n-form-item path="password" label="password" >
                        <n-input v-model:value="form.password" placeholder="不修改请留空"/>
                    </n-form-item>
                    <n-form-item path="external_dns" label="external_dns" :rule="{
                        type: 'any',
                        required: true,
                        trigger: ['input', 'blur'],
                    }">
                        <n-space vertical>
                            <div v-for="(item, index) in form.external_dns" :key="index">
                                <n-space>
                                    <n-input v-model:value="form.external_dns[index]" />
                                    <n-button @click="form.external_dns.splice(index, 1)">删除</n-button>
                                </n-space>
                            </div>
                            <n-button @click="form.external_dns.push('')">添加</n-button>
                        </n-space>
                    </n-form-item>
                </n-form>
            </div>
            <template #footer>
                <n-space>
                    <n-button :loading="loading" type="primary" @click="submit()">{{
                        form._id ? '修改' : '添加'
                    }}</n-button>
                    <n-button type="default" @click="hide()">关闭</n-button>
                </n-space>
            </template>
        </n-card>
    </n-modal>
</template>

<script>
    import { postProxy, postProxyEdit } from '../../api/proxyManager.js';
    import { getConfig, postConfigUpdate, postServeInfo, postServeLog, postServeStop, postServeStart, postServeRestart } from '../../api/dns.js';
    export default {
        data() {
            return {
                loading: false,
                visible: false,
                submitLoading: false,
                form: {
                    _id: null,
                    external_dns: [],
                    fallback_timeout: null,
                    port: null,
                    type: null,
                    password: null,
                },
            };
        },
        methods: {
            restore() {
                this.form = {
                    _id: null,
                    external_dns: [],
                    fallback_timeout: null,
                    port: null,
                    type: null,
                    password: null,
                };
            },
            show() {
                this.visible = true;
                this.$nextTick(() => {
                    this.getConfig();
                });
            },
            edit(data) {
                this.visible = true;
                this.$nextTick(() => {
                    const arr = Object.keys(data);
                    arr.forEach((item) => {
                        this.form[item] = data[item] || null;
                    });
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
                        this.hide();
                        this.$emit('refresh');
                    }
                });
            },
            hide() {
                this.restore();
                this.visible = false;
            },
        },
    };
</script>

<style scoped></style>
