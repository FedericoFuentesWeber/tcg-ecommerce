import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import multer from 'multer';
import bcrypt from 'bcrypt';

const __dirname = dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/public/images`);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const uploader = multer({ storage });

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (passwordToValidate, userPassword) => {
    return bcrypt.compareSync(passwordToValidate, userPassword);
};

export default __dirname;