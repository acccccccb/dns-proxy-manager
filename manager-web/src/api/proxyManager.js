import request from '../http/axios';
export const getProxy = (params) => {
    return request({
        url: '/admin/proxy',
        method: 'get',
        params,
        noToken: false,
    });
};
export const postProxyDelete = (data) => {
    return request({
        url: '/admin/proxy/delete',
        method: 'post',
        data,
        noToken: false,
    });
};
export const postProxy = (data) => {
    return request({
        url: '/admin/proxy',
        method: 'post',
        data,
        noToken: false,
    });
};
export const postProxyEdit = (data) => {
    return request({
        url: '/admin/proxy/edit',
        method: 'post',
        data,
        noToken: false,
    });
};
export const postProxyStatus = (data) => {
    return request({
        url: '/admin/proxy/status',
        method: 'post',
        data,
        noToken: false,
    });
};
export const postProxyInsertJson = (data) => {
    return request({
        url: '/admin/proxy/insert/json',
        method: 'post',
        data,
        noToken: false,
    });
};
export default {
    getProxy,
};
