import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

const JWT_SECRET_KEY = config.JWT_SECRET_KEY;

const genertateToken = (user) => {
    return jwt.sign(user, JWT_SECRET_KEY, {expiresIn: '24h'});
}

const generateTokenWith = (user, time) => {
    return jwt.sign(user, JWT_SECRET_KEY, {expiresIn: time});
}

const authTokenMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if(!authHeader) return res.status(401).send({status: 'error', message: 'no token'})

    const token = authHeader.split(' ')[1]

    jwt.verify(token, JWT_SECRET_KEY, (error, decodeUser) => {
        if(error) return res.status(400).send({status: 'error', message: 'not authorized'})

        req.user = decodeUser;
        next();
    });
}

export {genertateToken, generateTokenWith, authTokenMiddleware}