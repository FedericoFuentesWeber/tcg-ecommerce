import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

const JWT_SECERET_KEY = config.JWT_SECERET_KEY;

const genertateToken = (user) => {
    return jwt.sign(user, JWT_SECERET_KEY, {expiresIn: '24h'});
}

const authTokenMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if(!authHeader) return res.status(401).send({status: 'error', message: 'no token'})

    const token = authHeader.split(' ')[1]

    jwt.verify(token, JWT_SECERET_KEY, (error, decodeUser) => {
        if(error) return res.status(400).send({status: 'error', message: 'not authorized'})

        req.user = decodeUser;
        next();
    });
}

export {genertateToken, authTokenMiddleware}