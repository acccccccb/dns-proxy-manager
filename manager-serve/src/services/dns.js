import dns2 from 'dns2';
import wildcard from 'wildcard';
import { find_db } from '../utils/mongo.js';
const { Packet, UDPClient } = dns2;

// 默认参数
let _PORT = 53;
let _FALLBACK_TIMEOUT = 350;
let _TYPE = 'udp4'; // IPv4 or IPv6 (Must be either "udp4" or "udp6")
let _ADDRESS = '0.0.0.0';
let _DNS_SERVER = ['223.5.5.5', '1.1.1.1', '114.114.114.114', '8.8.8.8', '8.8.4.4'];

(async () => {
    // 从数据库读取配置文件
    const config = await find_db('config', {});
    if (Array.isArray(config.data) && config.data.length > 0) {
        const data = config.data[0];
        _PORT = data.port;
        _FALLBACK_TIMEOUT = data.fallback_timeout;
        _TYPE = data.type;
        _DNS_SERVER = data.external_dns.filter((item) => !!item);
    }
    const searchOnDns = (name, dns_index = 0) => {
        const options = {
            dns: _DNS_SERVER[dns_index],
            port: _PORT,
            recursive: true,
        };
        return new Promise(async (resolve) => {
            const dns = new dns2(options);
            const result = await dns.resolveA(name);
            resolve(result.answers.filter((item) => item.address));
        });
    };
    // 读取代理列表
    let proxyList = await find_db('proxy', { status: 1 });
    if (proxyList?.success === true) {
        proxyList = proxyList.data.map((item) => {
            return {
                name: item.domain,
                address: item.ip,
            };
        });
    } else {
        proxyList = [];
    }
    const server = dns2.createServer({
        udp: true,
        handle: (request, send, rinfo) => {
            const response = Packet.createResponseFromRequest(request);
            const [question] = request.questions;
            const { name, type } = question;
            console.log(`DNS query: ${name} - ${type}`);
            const filter = proxyList
                .filter((item) => {
                    return wildcard(item.name, name);
                })
                .map((item) => ({
                    name: name,
                    address: item.address,
                    type: Packet.TYPE.A,
                    class: Packet.CLASS.IN,
                    ttl: 300,
                }));
            if (filter && filter.length > 0) {
                console.log('Match local proxy', filter[0].name, filter[0].address);
                response.answers = filter;
                send(response);
            } else {
                // 本地文件为空时 去服务器查询
                const loop = async (i) => {
                    const answers = await searchOnDns(name, 0);
                    if (answers.length === 0 && i < _DNS_SERVER.length - 1) {
                        i++;
                        loop(i);
                    } else {
                        response.answers = response.answers.concat(
                            answers.map((item) => {
                                return {
                                    name: item.name,
                                    address: item.address,
                                    type: type,
                                    class: item.class,
                                    ttl: item.ttl,
                                };
                            })
                        );
                        console.log(
                            'DNS response',
                            response.answers.map((item) => item.address)
                        );
                        send(response);
                    }
                };
                loop(0);
            }
        },
    });

    server.on('request', (request, response, rinfo) => {
        // console.log('DNS query', request.questions[0]);
    });

    server.on('requestError', (error) => {
        console.log('Client sent an invalid request', error);
    });

    server.on('listening', () => {
        const serverInfo = server.addresses();
        console.log('DNS server start');
        console.log('_PORT', _PORT);
        console.log('_TYPE', _TYPE);
        console.log('_ADDRESS', _ADDRESS);
        console.log(serverInfo);
    });

    server.on('close', () => {
        console.log('DNS server closed');
    });

    server.listen({
        // Optionally specify port, address and/or the family of socket() for udp server:
        udp: {
            port: _PORT,
            address: _ADDRESS,
            type: _TYPE, // IPv4 or IPv6 (Must be either "udp4" or "udp6")
        },
        // Optionally specify port and/or address for tcp server:
        tcp: {
            port: _PORT,
            address: _ADDRESS,
        },
    });
})();

// eventually
// server.close();
