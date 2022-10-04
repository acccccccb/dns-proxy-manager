import axios from 'axios';

const request = (config) => {
    const $axios = axios.create({
        // API 请求的默认前缀
        baseURL: 'http://localhost:3001',
        timeout: 30000, // 请求超时时间
        validateStatus: (status) => {
            return status < 500; // 处理状态码小于500的情况
        },
    });
    // 请求拦截器
    $axios.interceptors.request.use((axiosConfig) => {
        if (config.data) {
            axiosConfig.data = config.data;
        }
        if (config.params) {
            axiosConfig.params = config.params;
        }
        if (config.noToken) {
            return axiosConfig;
        } else {
            const token = window.localStorage.getItem('Access-Token');
            if (token) {
                axiosConfig.headers['Authorization'] = `Bearer ${token}`;
                return axiosConfig;
            } else {
                return Promise.reject('未登录');
            }
        }
    });

    // 添加响应拦截器
    $axios.interceptors.response.use(
        function (response) {
            // 2xx 范围内的状态码都会触发该函数。
            // 对响应数据做点什么
            return response;
        },
        function (error) {
            // 超出 2xx 范围的状态码都会触发该函数。
            // 对响应错误做点什么
            return Promise.reject(error);
        }
    );

    return new Promise((resolve, reject) => {
        $axios[config.method](config.url)
            .then((res) => {
                if (res.data.status === 401) {
                    window.localStorage.removeItem('Access-Token');
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                    return Promise.reject('TOKEN过期，即将返回登录页');
                }
                if (res.data.status !== 0) {
                    window.$message.warning(res?.data?.message || '未知错误');
                }
                resolve(res.data);
            })
            .catch((e) => {
                console.log(e);
                window.$message.error(e.toString());
            });
    });
};
export default request;
