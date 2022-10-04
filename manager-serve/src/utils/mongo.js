import mongodb from 'tingodb';
const Engine = mongodb();
// const ObjectId = mongodb.ObjectId;
import moment from 'moment';
import path from 'path';
import MD5 from 'md5.js';

const conn = () => {
    const url = path.resolve('./') + '/src/db';
    const db = new Engine.Db(url, {});
    const connect = db;
    return { db, connect };
};

export const init_db = async () => {
    const { db, connect } = await conn();
    if (db) {
        try {
            // 创建合集
            await db.createCollection('config');
            await db.createCollection('proxy');

            // 插入数据
            await db.collection('config').insert({
                username: 'admin',
                password: new MD5().update('42').digest('hex'),
                slot: '',
                token: '',
                external_dns: ['119.29.29.29', '223.5.5.5', '8.8.4.4'],
                port: 53,
                type: 'udp4',
                fallback_timeout: 350,
            });
            await db.collection('proxy').insert({
                domain: 'localhost',
                ip: '127.0.0.1',
                remark: '本地服务器',
                status: 1,
                created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            });
            connect.close();
            return {
                success: true,
                message: 'success',
            };
        } catch (e) {
            return {
                success: false,
                message: e.toString(),
            };
        }
    } else {
        return {
            success: false,
            message: '数据库初始化失败 数据库无法连接',
        };
    }
};
export const destroy_db = async () => {
    const { db, connect } = await conn();
    if (db) {
        try {
            db.collection('config').drop(() => {});
            db.collection('proxy').drop(() => {});
            db.collection('user').drop(() => {});
            connect.close();
            return {
                success: true,
                message: 'success',
            };
        } catch (e) {
            return {
                success: false,
                message: e.toString(),
            };
        }
    } else {
        return {
            success: false,
            message: '数据库初始化失败 数据库无法连接',
        };
    }
};

export const find_db = async (collection_name, query = {}) => {
    const { db, connect } = conn();
    return new Promise((resolve) => {
        if (db) {
            return db
                .collection(collection_name)
                .find()
                .toArray((err, res) => {
                    db.close();
                    if (err) {
                        resolve({
                            success: false,
                            message: err.toString(),
                            data: [],
                        });
                    }
                    resolve({
                        success: true,
                        message: '查询成功',
                        data: res,
                    });
                });
        } else {
            resolve({
                success: false,
                message: '数据库初始化失败 数据库无法连接',
            });
        }
    });
};

export const update_collection = async (collection_name, query = {}, newSet = {}) => {
    return new Promise(async (resolve) => {
        const { db, connect } = conn();
        if (db) {
            try {
                if (query._id) {
                    query._id = query._id;
                }
                const collection = db.collection(collection_name);
                collection.findOne(query, (err, findData) => {
                    if (err) {
                        db.close();
                        resolve({
                            success: false,
                            message: err.toString(),
                            data: [],
                        });
                    } else {
                        collection.update(query, Object.assign(findData, newSet), (err, res) => {
                            db.close();
                            if (!err) {
                                resolve({
                                    success: true,
                                    message: 'success',
                                });
                            } else {
                                resolve({
                                    success: false,
                                    message: '数据不存在',
                                });
                            }
                        });
                    }
                });
            } catch (e) {
                resolve({
                    success: false,
                    message: e.toString(),
                });
            }
        } else {
            resolve({
                success: false,
                message: '数据库无法连接',
            });
        }
    });
};

export const delete_collection = async (collection_name, query = {}) => {
    return new Promise(async (resolve) => {
        const { db, connect } = await conn();
        if (db) {
            try {
                if (query._id) {
                    query._id = query._id;
                }
                db.collection(collection_name).remove(query, (err, res) => {
                    db.close();
                    if (!err) {
                        resolve({
                            success: true,
                            message: 'success',
                        });
                    } else {
                        resolve({
                            success: false,
                            message: '数据不存在',
                            data: result,
                        });
                    }
                });
            } catch (e) {
                resolve({
                    success: false,
                    message: e.toString(),
                });
            }
        } else {
            resolve({
                success: false,
                message: '数据库无法连接',
            });
        }
    });
};

export const insert_collection = (collection_name, { domain, ip, remark, status }) => {
    return new Promise(async (resolve) => {
        const { db, connect } = await conn();
        if (db) {
            try {
                db.collection(collection_name).insert(
                    {
                        created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                        domain,
                        ip,
                        remark,
                        status,
                    },
                    (err, res) => {
                        db.close();
                        if (err) {
                            resolve({
                                success: false,
                                message: 'false',
                            });
                        }
                        resolve({
                            success: true,
                            message: 'success',
                        });
                    }
                );
            } catch (e) {
                resolve({
                    success: false,
                    message: e.toString(),
                });
            }
        } else {
            resolve({
                success: false,
                message: '数据库无法连接',
            });
        }
    });
};

export default mongodb;
