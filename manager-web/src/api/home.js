import request from '../http/axios';
export const getList = (sub) => {
    return request({
        url: '/admin/login',
        method: 'post',
        data: sub,
        noToken: true,
    });
};
export default {
    getList,
};
