const JWT = require('jsonwebtoken');
const validator = require('validator');

const secret = process.env.AUTH_SECRET_STR;
const jwtMaxAge = process.env.JWT_MAX_AGE || 6;

class Authentication {
    static async getJWT(user) {
        return new Promise((resolve, reject) => {
            JWT.sign(user, secret, {
                expiresIn: String(jwtMaxAge) + 'h',
            }, (err, token) => {
                if (err) reject(err);
                resolve(token);
            });
        });
    }

    static setTokenCookie(res, token) {
        res.cookie('jwt', token, {
            httpOnly: true,
            sameSite: true,
            maxAge: Number(process.env.JWT_MAX_AGE) * 60 * 60 * 1000,
        })
    }

    static async setJWTCookie(user, res) {
        try {
            const token = await Authentication.getJWT(user);
            Authentication.setTokenCookie(res, token);
        } catch (err) {
            throw Error("Can't sign jwt cookie: " + err.message);
        }
    }

    static async verifyJWT(jwt) {
        return new Promise((resolve, reject) => {
            JWT.verify(jwt, secret, (err, user) => {
                if (err) reject(err);
                resolve(user);
            });
        });
    }

    static async authentication(req, res, next) {
        const jwt = req.cookies.jwt;

        if (jwt && validator.isJWT(jwt)) {
            const user = await Authentication.verifyJWT(jwt);
            req.user = user;
        }
        next();
    }
}

module.exports = Authentication;