import request from '../http/axios';
export const login = (data) => {
    return request({
        url: '/admin/login',
        method: 'post',
        data,
        noToken: true,
    });
};
export const check = () => {
    return request({
        url: '/check',
        method: 'get',
        noToken: true,
    });
};
export const install = () => {
    return request({
        url: '/install',
        method: 'post',
        noToken: true,
    });
};
export const uninstall = () => {
    return request({
        url: '/uninstall',
        method: 'post',
        noToken: false,
    });
};
export const restart = () => {
    return request({
        url: '/admin/restart',
        method: 'post',
        noToken: false,
    });
};
export default {
    login,
};
