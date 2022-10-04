import Router from 'koa-router';
import MD5 from 'md5';
import runCmd from '../utils/runCmd.js';
import JWT from '../utils/jwt.js';
import path from 'path';

import {
    init_db,
    destroy_db,
    find_db,
    update_collection,
    insert_collection,
    delete_collection,
} from '../utils/mongo.js';
import multer from '@koa/multer';
import fs from 'fs-extra';
import moment from 'moment';
const pm2ProcessName = 'DnsProxyServe';

const upload = multer();
// 路由
const router = new Router();

router.get('/check', async (ctx) => {
    const loginData = await find_db('config', {});
    if (Array.isArray(loginData.data) && loginData.data.length > 0) {
        ctx.body = {
            code: 200,
            message: '已初始化数据库',
            status: 0,
        };
    } else {
        ctx.body = {
            code: 200,
            message: '未初始化数据库',
            status: 1,
        };
    }
});

router.post('/install', async (ctx) => {
    const loginData = await find_db('config', {});
    if (Array.isArray(loginData.data) && loginData.data.length > 0) {
        ctx.body = {
            code: 200,
            message: '已初始化数据库',
            status: 0,
        };
    } else {
        const params = ctx.request.body;
        const res = await init_db();
        console.log('createCollection', res);
        const pm2ProcessName = 'DnsProxyServe';
        const file = path.resolve('.') + '/src/services/dns.js';
        await runCmd(`pm2 start ${file} --name ${pm2ProcessName}`);
        if (res.success === true) {
            ctx.body = {
                code: 200,
                message: '安装成功',
                status: 0,
            };
        } else {
            ctx.body = {
                code: 200,
                message: res.message.toString(),
                status: 0,
            };
        }
    }
});
router.post('/uninstall', async (ctx) => {
    const params = ctx.request.body;

    const res = await destroy_db();
    await runCmd(`pm2 stop ${pm2ProcessName}`);
    await runCmd(`pm2 delete ${pm2ProcessName}`);
    if (res.success === true) {
        ctx.body = {
            code: 200,
            message: '卸载成功',
            status: 0,
        };
    } else {
        ctx.body = {
            code: 200,
            message: res.message.toString(),
            status: 0,
        };
    }
});
router.post('/admin/login', async (ctx) => {
    const params = ctx.request.body;
    const username = params.phone;
    const password = MD5(params.password);

    console.log('username', username);
    console.log('password', password);
    const loginData = await find_db('config', { username, password });
    if (Array.isArray(loginData.data) && loginData.data.length > 0) {
        const uname = loginData.data[0].username;
        const passwd = loginData.data[0].password;
        const id = loginData.data[0]._id.id;
        const newData = loginData.data[0];
        delete newData.token;
        const token = JWT.createToken(newData);
        newData.token = token;
        delete newData._id;
        // console.log(loginData.data[0]);
        if (uname === username && password === passwd) {
            const updateResult = await update_collection('config', { _id: id }, newData);
            if(updateResult.success === true) {
                ctx.body = {
                    code: 200,
                    message: '登录成功',
                    status: 0,
                    data: {
                        token,
                    },
                };
            } else {
                ctx.body = {
                    code: 200,
                    message: '登录失败',
                    status: 1,
                };
            }
        } else {
            ctx.body = {
                code: 200,
                message: '登录失败',
                status: 1,
            };
        }
    } else {
        ctx.body = {
            code: 200,
            message: '登录失败',
            status: 1,
        };
    }
});
// 重启服务
router.post('/admin/restart', async (ctx) => {
    // await runCmd(`pm2 stop ${pm2ProcessName}`);
    const res = await runCmd(`pm2 restart ${pm2ProcessName}`);
    if (res.status === 0) {
        ctx.body = res;
    } else {
        ctx.body = {
            code: 200,
            message: '重启失败',
            status: 1,
            data: res,
        };
    }
});
// 重启服务
router.post('/admin/stop', async (ctx) => {
    // await runCmd(`pm2 stop ${pm2ProcessName}`);
    const res = await runCmd(`pm2 stop ${pm2ProcessName}`);
    if (res.status === 0) {
        ctx.body = res;
    } else {
        ctx.body = {
            code: 200,
            message: '重启失败',
            status: 1,
            data: res,
        };
    }
});
// 重启服务
router.post('/admin/start', async (ctx) => {
    // await runCmd(`pm2 stop ${pm2ProcessName}`);
    const res = await runCmd(`pm2 start ${pm2ProcessName}`);
    if (res.status === 0) {
        ctx.body = res;
    } else {
        ctx.body = {
            code: 200,
            message: '重启失败',
            status: 1,
            data: res,
        };
    }
});
// 服务信息
router.post('/admin/serveInfo', async (ctx) => {
    const res = await runCmd(`pm2 ls ${pm2ProcessName}`);
    // const res = await runCmd(`pm2 show ${pm2ProcessName}`);
    // const res = await runCmd(`pm2 log dns --nostream`);
    if (res.status === 0) {
        const arr = res.message.split(/\r?\n|(?<!\n)\r/);
        const result = arr.find(item => {
            return item.indexOf('DnsProxyServe') > -1
        });
        const data = result.split('│').map(item => {
            return typeof item === 'string' ? item.trim() : item;
        });
        res.message = {
            id: data[1],
            name: data[2],
            namespace: data[3],
            version: data[4],
            mode: data[5],
            pid: data[6],
            uptime: data[7],
            restart: data[8],
            status: data[9],
            cpu: data[10],
            mem: data[11],
            user: data[12],
        };
        ctx.body = res;
    } else {
        ctx.body = {
            code: 200,
            message: '查询失败',
            status: 1,
            data: res,
        };
    }
});
router.post('/admin/log', async (ctx) => {
    const res = await runCmd(`pm2 log ${pm2ProcessName} --nostream --timestamp YYYY-MM-DD-HH:mm:ss --lines 100`);
    if (res.status === 0) {
        res.message = res.message.split(/\r?\n|(?<!\n)\r/);
        ctx.body = res;
    } else {
        ctx.body = {
            code: 200,
            message: '查询失败',
            status: 1,
            data: res,
        };
    }
});
router.post('/admin/log/clear', async (ctx) => {
    const res = await runCmd(`pm2 flush`);
    if (res.status === 0) {
        res.message = res.message.split(/\r?\n|(?<!\n)\r/);
        ctx.body = res;
    } else {
        ctx.body = {
            code: 200,
            message: '查询失败',
            status: 1,
            data: res,
        };
    }
});

router.get('/admin/config', async (ctx) => {
    const config = await find_db('config', {});
    if (Array.isArray(config.data) && config.data.length > 0) {
        const data = config.data[0];
        delete data.username;
        delete data.password;
        delete data.slot;
        delete data.token;
        ctx.body = {
            code: 200,
            message: '查询成功',
            status: 0,
            data: config.data[0],
        };
    } else {
        ctx.body = {
            code: 200,
            message: '查询失败',
            status: 1,
        };
    }
});

router.post('/admin/config/update', async (ctx) => {
    const params = ctx.request.body;

    delete params.username;
    delete params.slot;
    delete params.token;

    if(params.password) {
        params.password = MD5(params.password);
        params.token = '';
    } else {
        delete params.password;
    }

    const updateResult = await update_collection('config', { _id: params._id }, params);
    if (updateResult.success) {
        ctx.body = {
            code: 200,
            message: '修改成功',
            status: 0,
        };
    } else {
        ctx.body = {
            code: 200,
            message: updateResult.message,
            status: 1,
            data: updateResult,
        };
    }
});
// 代理管理

// 添加代理
router.post('/admin/proxy', async (ctx) => {
    const params = ctx.request.body;
    const res = await insert_collection('proxy', params);
    if (res.success) {
        ctx.body = {
            code: 200,
            message: '修改成功',
            status: 0,
        };
    } else {
        ctx.body = {
            code: 200,
            message: res.message,
            status: 1,
            data: res,
        };
    }
});
// 启用禁用代理
router.post('/admin/proxy/status', async (ctx) => {
    const params = ctx.request.body;
    const updateResult = await update_collection('proxy', { _id: params._id }, { status: params.status });
    if (updateResult.success) {
        ctx.body = {
            code: 200,
            message: '修改成功',
            status: 0,
            data: updateResult,
        };
    } else {
        ctx.body = {
            code: 200,
            message: updateResult.message,
            status: 1,
            data: updateResult,
        };
    }
});
router.post('/admin/proxy/edit', async (ctx) => {
    const params = ctx.request.body;
    const updateData = { ...params };
    delete updateData._id;
    delete updateData.created_at;
    const updateResult = await update_collection('proxy', { _id: params._id }, updateData);
    if (updateResult.success) {
        ctx.body = {
            code: 200,
            message: '修改成功',
            status: 0,
            data: updateResult,
        };
    } else {
        ctx.body = {
            code: 200,
            message: updateResult.message,
            status: 1,
        };
    }
});
// 删除代理
router.post('/admin/proxy/delete', async (ctx) => {
    const params = ctx.request.body;
    const res = await delete_collection('proxy', { _id: params._id });
    if (res.success) {
        ctx.body = {
            code: 200,
            message: '删除成功',
            status: 0,
        };
    } else {
        ctx.body = {
            code: 200,
            message: res.message,
            status: 1,
        };
    }
});

router.get(
    '/admin/proxy',

    async (ctx) => {
        const params = ctx.request.body;
        const result = await find_db('proxy');
        if (result) {
            ctx.body = {
                code: 200,
                message: '请求成功',
                status: 0,
                data: {
                    data: result.data,
                },
            };
        } else {
            ctx.body = {
                code: 200,
                message: '查询失败',
                status: 1,
            };
        }
    }
);
router.post(
    '/admin/proxy/insert/json',
    async (ctx) => {
        try {
            const files = ctx.request.files;
            const json = fs.readJsonSync(files.file.filepath);
            const insertData = Object.keys(json.domains).map((item) => {
                return {
                    domain: item,
                    ip: json.domains[item],
                    status: 1,
                    remark: '',
                    created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                };
            });
            const importAction = async () => {
                return new Promise((resolve) => {
                    const loop = async (i) => {
                        await insert_collection('proxy', insertData[i]);
                        if (i < insertData.length - 1) {
                            i++;
                            loop(i);
                        } else {
                            resolve({
                                code: 200,
                                message: '导入成功',
                                status: 0,
                                data: insertData,
                            });
                        }
                    };
                    loop(0);
                });
            };
            ctx.body = await importAction();
        } catch (e) {
            ctx.body = {
                code: 200,
                message: e.toString(),
                status: 1,
            };
        }
    },
    upload.single('file')
);
export default router;
