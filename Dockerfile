FROM alpine:3.14 as build
RUN echo http://mirrors.aliyun.com/alpine/v3.14/main/ > /etc/apk/repositories && \
    echo http://mirrors.aliyun.com/alpine/v3.14/community/ >> /etc/apk/repositories && \
    echo 'http://dl-cdn.alpinelinux.org/alpine/v3.9/main' >> /etc/apk/repositories && \
    echo 'http://dl-cdn.alpinelinux.org/alpine/v3.9/community' >> /etc/apk/repositories && \
    echo 'Asia/Shanghai' >/etc/timezone && \
    apk add --update --no-cache nodejs=14.20.0-r0 npm=7.17.0-r0

COPY ./manager-web/ /app/manager-web/
WORKDIR /app/manager-web
RUN npm config set registry https://mirrors.cloud.tencent.com/npm/ && \
    npm i && \
    npm run build
# pord
FROM alpine:3.14 as prod
EXPOSE 3000 3001 53/udp
RUN echo http://mirrors.aliyun.com/alpine/v3.14/main/ > /etc/apk/repositories && \
    echo http://mirrors.aliyun.com/alpine/v3.14/community/ >> /etc/apk/repositories && \
    echo 'http://dl-cdn.alpinelinux.org/alpine/v3.9/main' >> /etc/apk/repositories && \
    echo 'http://dl-cdn.alpinelinux.org/alpine/v3.9/community' >> /etc/apk/repositories && \
    echo 'Asia/Shanghai' >/etc/timezone && \
    apk add --update --no-cache nodejs=14.20.0-r0 npm=7.17.0-r0

COPY ./manager-serve /app/manager-serve/
COPY ./start.sh /app/start.sh
COPY --from=0 /app/manager-web/dist/ /app/manager-web/dist
WORKDIR /app/manager-serve
RUN npm config set registry https://mirrors.cloud.tencent.com/npm/ && \
    npm i -g pm2 serve && \
    npm i
CMD ["/bin/sh", "/app/start.sh"]