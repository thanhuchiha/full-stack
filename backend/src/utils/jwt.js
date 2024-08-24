import jwt from 'jsonwebtoken';
import { jsonError, jsonSuccess } from './system';
import { errors } from './constants/message';

class Jwt {
    static sign(data, expired = getEnv('ACCESS_TOKEN_EXPIRE_TIME')) {
        return new Promise((resolve, reject) => {
            jwt.sign(data, getEnv('ACCESS_TOKEN_SECRET'), { expiresIn: expired }, (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    }

    static signRefreshToken(data, expired = getEnv('REFRESH_TOKEN_EXPIRE_TIME')) {
        return new Promise((resolve, reject) => {
            jwt.sign(data, getEnv('REFRESH_TOKEN_SECRET'), { expiresIn: expired }, (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    }

    static verify(bearer) {
        return new Promise(resolve => {
            let token;
            const [scheme, credential] = bearer.split(' ');

            if (/^Bearer$/i.test(scheme) && credential) {
                token = credential;
            } else {
                return resolve(jsonError(errors.INVALID_TOKEN));
            }

            jwt.verify(token, getEnv('ACCESS_TOKEN_SECRET'), (error, decode) => {
                if (error) {
                    switch (error.message) {
                        case 'jwt expired':
                            error = errors.TOKEN_EXPIRED_ERROR;
                            break;

                        default:
                            error = errors.INVALID_TOKEN;
                    }

                    return resolve(jsonError(error));
                }
                return resolve(jsonSuccess(decode));
            });
        });
    }

    static verifyRefreshToken(token) {
        return new Promise(resolve => {
            jwt.verify(token, getEnv('REFRESH_TOKEN_SECRET'), (error, decode) => {
                if (error) {
                    switch (error.message) {
                        case 'jwt expired':
                            error = errors.TOKEN_EXPIRED_ERROR;
                            break;

                        default:
                            error = errors.INVALID_TOKEN;
                    }

                    return resolve(jsonError(error));
                }
                return resolve(jsonSuccess(decode));
            });
        });
    }

    static decode(token) {
        return new Promise(resolve => {
            jwt.verify(token, getEnv('JWT_SECRET'), (error, decode) => {
                if (error) {
                    switch (error.message) {
                        case 'token expired':
                            error = errors.TOKEN_EXPIRED_ERROR;
                            break;

                        default:
                            error = errors.INVALID_TOKEN;
                    }

                    return resolve(jsonError(error));
                }
                return resolve(jsonSuccess(decode));
            });
        });
    }

    static async refreshToken(refreshToken) {
        try {
            const decoded = await this.verifyRefreshToken(`Bearer ${refreshToken}`);
            if (decoded.success) {
                const newAccessToken = await this.sign({ userId: decoded.data.userId });
                return jsonSuccess({ accessToken: newAccessToken });
            } else {
                return jsonError(errors.INVALID_TOKEN);
            }
        } catch (error) {
            return jsonError(errors.INVALID_TOKEN);
        }
    }


}

export { Jwt };
