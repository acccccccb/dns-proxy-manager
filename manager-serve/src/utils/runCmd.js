import { exec } from 'child_process';
// import buffer from 'buffer';
import iconv from 'iconv-lite';

export default function (cmd) {
    return new Promise((resolve) => {
        let binaryEncoding = 'binary';
        let encoding = 'utf8'; // utf8  cp936
        let options = {
            encoding: binaryEncoding,
            windowsHide: false,
        };
        exec(cmd, options, (error, stdout, stderr) => {
            if (error) {
                console.log('restart', error);
                resolve({
                    code: 200,
                    message: '重启失败',
                    status: 1,
                });
            } else {
                let result = iconv.decode(Buffer.from(stdout, binaryEncoding), encoding);
                resolve({
                    code: 200,
                    message: result,
                    status: 0,
                });
            }
        });
    });
}
