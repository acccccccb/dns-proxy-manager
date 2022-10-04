# DPM(dns proxy manager) v1.0.0

## DNS代理管理器

vite + vue3

图形化DNS代理管理器，告别修改host文件的繁琐，支持通配符

- 运行环境：nodejs v14.20 npm v7.17
- Web服务：node-serve
- Dns代理：dns2
- 数据库：tingodb
- 进程管理：pm2
- 仓库地址： [https://github.com/acccccccb/dns-proxy-manager](https://github.com/acccccccb/dns-proxy-manager)

# Docker

## docker build

```bash
docker build --pull --rm -f "Dockerfile" -t tabzhang001/dnsproxymanager:latest "."
```

or

## docker pull

```bash
docker pull tabzhang001/dnsproxymanager:latest"
```

## docker run

```bash
docker run --name dnsproxymanager -d  \
    -p 3000:3000 \
    -p 8053:8053 \
    -p 53:53/udp \
    -v /path/to/db:/app/manager-serve/src/db \
    tabzhang001/dnsproxymanager:latest
```

# 开发

## web端

```bash
cd ./manager-web
npm i
npm run dev
```

## serve端

```bash
cd ./manager-serve
npm i
npm run dev
```

# 预览

![alt](/readmedist/1.png)
![alt](/readmedist/2.png)
![alt](/readmedist/3.png)
![alt](/readmedist/4.png)