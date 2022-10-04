<template>
    <n-modal title="编辑用户" v-model:show="visible" :mask-closable="false">
        <n-card style="width: 600px" :bordered="true" role="dialog" aria-modal="true">
            <div>
                <n-form ref="formRef" label-align="left" :model="form" autocomplete="off">
                    <n-form-item
                        path="domain"
                        label="domain"
                        :rule="{
                            required: true,
                            trigger: ['input', 'blur'],
                        }"
                    >
                        <n-input v-model:value="form.domain" />
                    </n-form-item>
                    <n-form-item
                        path="ip"
                        label="ip"
                        :rule="{
                            required: true,
                            trigger: ['input', 'blur'],
                        }"
                    >
                        <n-input v-model:value="form.ip" />
                    </n-form-item>
                    <n-form-item
                        path="remark"
                        label="remark"
                        :rule="{
                            required: true,
                            trigger: ['input', 'blur'],
                        }"
                    >
                        <n-input v-model:value="form.remark" />
                    </n-form-item>
                    <n-form-item
                        path="status"
                        label="status"
                        :rule="{
                            type: 'number',
                            required: true,
                            trigger: ['input', 'blur'],
                        }"
                    >
                        <n-radio-group v-model:value="form.status" name="status">
                            <n-radio-button :value="1" label="启用" />
                            <n-radio-button :value="2" label="禁用" />
                        </n-radio-group>
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

    export default {
        data() {
            return {
                loading: false,
                visible: false,
                form: {
                    ip: null,
                    domain: null,
                    remark: null,
                    status: null,
                },
            };
        },
        methods: {
            restore() {
                this.form = {
                    ip: null,
                    domain: null,
                    remark: null,
                    status: null,
                };
            },
            show() {
                this.visible = true;
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
            hide() {
                this.restore();
                this.visible = false;
            },
            submit() {
                this.$refs.formRef.validate((error) => {
                    if (!error) {
                        this.loading = true;
                        const $api = this.form._id ? postProxyEdit : postProxy;
                        $api(this.form).then((res) => {
                            this.loading = false;
                            if (res.status === 0) {
                                this.$message.success(res.message);
                                this.hide();
                                this.$emit('refresh');
                            }
                        });
                    }
                });
            },
        },
    };
</script>

<style scoped></style>
