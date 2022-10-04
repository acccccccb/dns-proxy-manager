console.log('service start');
// import http from './utils/require.js';
import koa from 'koa';
import cors from 'koa-cors';
import koaBody from 'koa-body';
import { find_db } from './utils/mongo.js';
import JWT from './utils/jwt.js';
import runCmd from './utils/runCmd.js';
import path from 'path';
// import './services/dns.js';
// 路由
import router from './router/index.js';

const pm2ProcessName = 'DnsProxyServe';
const file = path.resolve('.') + '/src/services/dns.js';

// 判断是否已初始化数据库
const loginData = await find_db('config', {});
if (Array.isArray(loginData.data) && loginData.data.length > 0) {
    await runCmd(`pm2 stop ${pm2ProcessName}`);
    await runCmd(`pm2 start ${file} --name ${pm2ProcessName}`);
} else {
    await runCmd(`pm2 start ${file} --name ${pm2ProcessName}`);
}


const app = new koa({
    proxy: true,
    proxyIpHeader: 'X-Real-IP',
});
app.use(
    koaBody({
        multipart: true,
    })
);
app.use(
    cors({
        origin: '*',
    })
);
app.use(async (ctx, next) => {
    console.log(ctx.method, ctx.url, ctx.request.body);
    const whiteList = ['/check', '/install', '/admin/login'];
    // 不在白名单的都要验证token
    if (whiteList.indexOf(ctx.path) === -1) {
        const token = ctx.header?.authorization?.replace('Bearer ', '') || null;
        const checkData = await JWT.checkToken(token);
        if(!checkData) {
            ctx.body = {
                code: 200,
                message: '你还没登陆',
                status: 401,
            };
        } else {
            const auth = await find_db('config', { token: checkData.data.token });
            if (Array.isArray(auth.data) && auth.data.length > 0) {
                const authToken = auth.data[0].token;
                if (token === authToken && token && authToken) {
                    await next();
                } else {
                    ctx.body = {
                        code: 200,
                        message: '你还没登陆',
                        status: 401,
                    };
                }
            } else {
                ctx.body = {
                    code: 200,
                    message: '你还没登陆',
                    status: 401,
                };
            }
        }

    } else {
        await next();
    }
});
app.use(router.routes());
app.use(
    router.allowedMethods({
        throw: false, // 抛出错误，代替设置响应头状态
        notImplemented: () => '不支持当前请求所需要的功能',
        methodNotAllowed: () => '不支持的请求方式',
    })
);

app.listen(8053);
