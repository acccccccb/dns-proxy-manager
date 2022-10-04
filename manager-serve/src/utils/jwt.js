import jwt from 'jsonwebtoken';

const _JWTKEY = 'jh9r9ef9gbd8fujn9e0h0e09f0g9d0jfihj03rj3jrohj2';


const JWT = {
    createToken(data) {
        return jwt.sign({
            data,
            exp: Math.floor(Date.now() / 1000) + (60 * 60), // 过期时间 1 小时
        }, _JWTKEY);
    },
    checkToken(token) {
        return new Promise(resolve => {
            jwt.verify(token, _JWTKEY, async function(err, decoded) {
                if(!err) {
                    resolve(decoded);
                } else {
                    resolve(false);
                }
            });
        });
    },
};
export default JWT;