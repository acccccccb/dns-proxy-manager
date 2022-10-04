<template>
    <div class="login-main">
        <div class="login-form">
            <n-card :bordered="true" style="box-shadow: 0 10px 25px 0 rgba(100, 100, 100, 0.1)">
                <div class="login-logo"><img src="/vite.svg" /></div>
                <div class="login-title">DNS PROXY MANAGER</div>
                <n-space vertical>

                    <n-form autocomplete="off" ref="formRef" :model="model" :show-label="false">
                        <template v-if="!showInstall">
                            <n-form-item path="phone" label="用户名">
                                <n-input
                                    require
                                    v-model:value="model.phone"
                                    placeholder="用户名"
                                    :input-props="{
                                        autocomplete: 'new-password',
                                    }"
                                />
                            </n-form-item>
                            <n-form-item path="password" label="密码">
                                <n-input
                                    v-model:value="model.password"
                                    placeholder="密码"
                                    type="password"
                                    :input-props="{
                                        autocomplete: 'new-password',
                                    }"
                                />
                            </n-form-item>
                            <n-form-item path="code" label="code" v-if="false">
                                <n-input-group>
                                    <n-input v-model:value="model.code" placeholder="验证码" />
                                    <n-input-group-label>
                                        <img :src="codeSrc" width="100" height="34" />
                                    </n-input-group-label>
                                </n-input-group>
                            </n-form-item>
                        </template>
                        <n-alert style="margin-bottom: 20px;" v-else type="info">
                            未找到配置信息，需要先初始化数据库，<br> 初始账号：admin 密码：123456
                        </n-alert>
                        <n-space vertical>
                            <n-button v-if="showInstall" :loading="installLoading" block type="warning" @click="install"> 初始化数据库 </n-button>
                            <n-button
                                v-else
                                :loading="loading"
                                :disabled="!model.phone || !model.password"
                                block
                                type="primary"
                                @click="doLogin"
                            >
                                {{ btnText }}
                            </n-button>
                        </n-space>
                    </n-form>
                    <n-space justify="space-between" style="margin-top: 12px">
                        <n-checkbox v-if="!showInstall" v-model:checked="savePassword"> 记住密码 </n-checkbox>
                        <span v-else></span>
                        <n-button @click="$store.commit('toggleDarkMode')" type="default" text size="small" round>
                            <template #icon>
                                <IconRender v-if="$store.state.darkMode" :size="18" name="Sunny"></IconRender>
                                <IconRender v-else :size="18" name="Moon"></IconRender>
                            </template>
                        </n-button>
                    </n-space>
                </n-space>
            </n-card>
        </div>
    </div>
</template>
<script>
    import { login, install, check } from '../api/common.js';

    export default {
        name: 'Login',
        data() {
            const savePassword = window.localStorage.getItem('savePassword') === 'true';
            return {
                model: {
                    phone: '',
                    password: '',
                    code: '',
                },
                codeSrc: 'https://fakeimg.pl/250x100/',
                savePassword,
                loading: false,
                installLoading: false,
                btnText: '登录',
                showInstall: false,
            };
        },
        created() {
            window.localStorage.removeItem('Access-Token');
            this.check();
        },
        mounted() {
            if (this.savePassword) {
                try {
                    const data = JSON.parse(this.decodeData(window.localStorage.getItem('cache')));
                    this.model.phone = data.phone;
                    this.model.password = data.password;
                } catch (e) {}
            }
        },
        methods: {
            install() {
                this.installLoading = true;
                install().then((res) => {
                    this.installLoading = false;
                    if (res.status === 0) {
                        this.$message.success(res.message);
                        this.check();
                    }
                });
            },
            check() {
                check().then((res) => {
                    this.showInstall = res.status !== 0;
                });
            },
            encodeData(string, count = 5) {
                let encodeStr = string;
                for (let i = 0; i < count; i++) {
                    encodeStr = window.btoa(encodeStr);
                }
                return encodeStr;
            },
            decodeData(string, count = 5) {
                let decodeStr = string;
                for (let i = 0; i < count; i++) {
                    decodeStr = window.atob(decodeStr);
                }
                return decodeStr;
            },
            doLogin() {
                if (this.savePassword) {
                    window.localStorage.setItem('cache', this.encodeData(JSON.stringify(this.model)));
                } else {
                    window.localStorage.removeItem('cache');
                }
                this.loading = true;
                login(this.model).then((res) => {
                    if (res.status === 0) {
                        this.btnText = '登录成功, 即将跳转到首页...';
                        window.localStorage.setItem('Access-Token', res.data.token);

                        setTimeout(() => {
                            this.loading = false;
                            this.$router.push({
                                path: '/',
                            });
                        }, 1000);
                    } else {
                        this.loading = false;
                    }
                });
            },
        },
        watch: {
            savePassword(val) {
                window.localStorage.setItem('savePassword', val);
            },
        },
    };
</script>
<style scoped lang="scss">
    .login-main {
        transform: translateY(-10%);
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: 100vh;

        .login-title {
            text-align: center;
            margin-bottom: 20px;
            font-weight: bold;
            font-size: 1.4em;
        }
        .login-logo {
            text-align: center;
            margin-bottom: 5px;
            margin-top: 5px;

            img {
                width: 40px;
            }
        }
        .login-form {
            width: 400px;
        }
    }
    :deep .n-input-group-label {
        padding-left: 0;
        padding-right: 0;
    }
</style>
