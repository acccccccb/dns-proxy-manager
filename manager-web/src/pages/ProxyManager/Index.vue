<script setup>
    import { h, defineComponent } from 'vue';
    import { NButton, NTag, NSpace } from 'naive-ui';
    import EditForm from './EditForm.vue';
    import IconRender from '../../components/Modules/IconRender.vue';
</script>
<template>
    <div>
        <n-space style="margin-bottom: 10px">
            <n-button type="default" @click="getList()">
                <template #icon>
                    <IconRender name="Refresh"></IconRender>
                </template>
            </n-button>
            <n-button type="primary" @click="editFormShow()">添加</n-button>
            <n-button type="info" secondary v-if="false">导入HOST文件</n-button>
            <n-button type="info" secondary v-if="false">导出HOST文件</n-button>
            <n-button type="warning" @click="proxyInsertJson" secondary>导入JSON文件</n-button>
            <input type="file" v-show="false" ref="insertJsonFileInputRef" @change="insertJsonFileInputOnChange" />
            <n-button type="warning" secondary v-if="false">导出JSON文件</n-button>
        </n-space>
        <n-space vertical>
            <n-data-table
                :loading="loading"
                striped
                :columns="columns"
                :data="tableData"
                :pagination="false"
                :bordered="true"
            />
            <n-pagination
                v-show="false"
                v-model:page="params.page"
                v-model:page-size="params.pageSize"
                :page-sizes="[10, 20, 50, 100]"
                show-size-picker
                :on-update="
                    (page) => {
                        params.page = page;
                        getList();
                    }
                "
                :on-update:page-size="
                    (pageSize) => {
                        params.pageSize = pageSize;
                        getList();
                    }
                "
            />
        </n-space>
        <EditForm ref="editFormRef" @refresh="getList"></EditForm>
    </div>
</template>

<script>
    import { getProxy, postProxyDelete, postProxyStatus, postProxyInsertJson } from '../../api/proxyManager.js';
    export default {
        name: 'ServerManager',
        data() {
            return {
                loading: false,
                columns: [
                    // {
                    //     title: '_id',
                    //     key: '_id',
                    //     align: 'center',
                    //     width: 60,
                    // },
                    {
                        title: 'domain',
                        key: 'domain',
                        align: 'center',
                    },
                    {
                        title: 'ip',
                        key: 'ip',
                        align: 'center',
                    },
                    {
                        title: 'remark',
                        key: 'remark',
                        align: 'center',
                        ellipsis: {
                            tooltip: true,
                        },
                    },
                    {
                        title: 'status',
                        key: 'status',
                        align: 'center',
                        render(row) {
                            return h(
                                NTag,
                                {
                                    bordered: false,
                                    size: 'small',
                                    type: row.status === 1 ? 'success' : 'error',
                                },
                                { default: () => (row.status === 1 ? '已启用' : '已禁用') }
                            );
                        },
                    },

                    {
                        title: 'created_at',
                        key: 'created_at',
                        align: 'center',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        width: 200,
                        render: (row) => {
                            return h(
                                NSpace,
                                {
                                    justify: 'center',
                                    default: () => 'default',
                                },
                                () => [
                                    h(
                                        NButton,
                                        {
                                            type: 'warning',
                                            tertiary: true,
                                            size: 'small',
                                            onclick: () => this.toggleStatus({ ...row }),
                                        },
                                        { default: () => (row.status === 1 ? '禁用' : '启用') }
                                    ),
                                    h(
                                        NButton,
                                        {
                                            type: 'primary',
                                            tertiary: true,
                                            size: 'small',
                                            onclick: () => this.editFormEdit({ ...row }),
                                        },
                                        { default: () => '修改' }
                                    ),
                                    h(
                                        NButton,
                                        {
                                            type: 'error',
                                            tertiary: true,
                                            size: 'small',
                                            onclick: () => this.delItem({ ...row }),
                                        },
                                        { default: () => '删除' }
                                    ),
                                ]
                            );
                        },
                    },
                ],
                tableData: [],
                params: {
                    page: 1,
                    pageSize: 10,
                },
            };
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                this.loading = true;
                getProxy(this.params).then((res) => {
                    this.loading = false;
                    if (res.code === 200) {
                        this.tableData = res.data.data;
                    }
                });
            },
            editFormShow() {
                this.$refs.editFormRef.show();
            },
            editFormEdit(data) {
                console.log(data);
                this.$refs.editFormRef.edit(data);
            },
            toggleStatus(row) {
                postProxyStatus({
                    _id: row._id,
                    status: row.status === 1 ? 2 : 1,
                }).then((res) => {
                    if (res.status === 0) {
                        this.$message.success(res.message);
                        this.getList();
                    }
                });
            },
            delItem(row) {
                this.$dialog.warning({
                    title: '删除代理',
                    content: `确定要删除【${row.domain}】吗？该操作无法撤销。`,
                    positiveText: '删除',
                    negativeText: '取消',
                    onPositiveClick: () => {
                        postProxyDelete({ _id: row._id }).then((res) => {
                            if (res.status === 0) {
                                this.$message.success(res.message);
                                this.getList();
                            }
                        });
                    },
                });
            },
            proxyInsertJson() {
                this.$refs.insertJsonFileInputRef.click();
                // postProxyInsertJson
            },
            insertJsonFileInputOnChange(e) {
                const loading = this.$message.loading('正在导入文件...',{ duration: 0});
                if (e.target?.files[0]) {
                    const file = e.target.files[0];
                    const formData = new FormData();
                    formData.append('file', file);
                    postProxyInsertJson(formData).then((res) => {
                        loading.destroy();
                        if (res.status === 0) {
                            this.getList();
                            this.$message.success(res.message);
                        }
                    });
                    this.$refs.insertJsonFileInputRef.value = '';
                }
            },
        },
    };
</script>

<style scoped></style>
