import got from 'got';
import queryString from 'query-string';

// const got = require('got');
// const queryString = require('query-string');

const post = (options) => {
    console.log('http-headers', options);
    return new Promise((reslove, reject) => {
        got(options?.url ?? '', {
            headers: options.headers ?? {},
            method: 'post',
            body: options?.body ?? {},
            timeout: {
                request: options?.timeout ?? 2000,
            },
        })
            .then((res) => {
                reslove(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
};

const get = (options) => {
    return new Promise((reslove, reject) => {
        got(options?.url ?? '', {
            headers: options.headers ?? {},
            method: 'get',
            searchParams: options?.searchParams ?? {},
            timeout: {
                request: options?.timeout ?? 2000,
            },
        })
            .then((res) => {
                reslove(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
};

const http = { get, post };
export default http;
