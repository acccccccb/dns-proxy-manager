import request from '../http/axios';
export const getConfig = (params) => {
    return request({
        url: '/admin/config',
        method: 'get',
        params,
        noToken: false,
    });
};
export const postConfigUpdate = (data) => {
    return request({
        url: '/admin/config/update',
        method: 'post',
        data,
        noToken: false,
    });
};
export const postServeInfo = (data) => {
    return request({
        url: '/admin/serveInfo',
        method: 'post',
        data,
        noToken: false,
    });
};
export const postServeLog = (data) => {
    return request({
        url: '/admin/log',
        method: 'post',
        data,
        noToken: false,
    });
};
export const postServeLogClear = (data) => {
    return request({
        url: '/admin/log/clear',
        method: 'post',
        data,
        noToken: false,
    });
};
export const postServeRestart = (data) => {
    return request({
        url: '/admin/restart',
        method: 'post',
        data,
        noToken: false,
    });
};
export const postServeStart = (data) => {
    return request({
        url: '/admin/start',
        method: 'post',
        data,
        noToken: false,
    });
};
export const postServeStop = (data) => {
    return request({
        url: '/admin/stop',
        method: 'post',
        data,
        noToken: false,
    });
};

export default {
    getConfig,
};
