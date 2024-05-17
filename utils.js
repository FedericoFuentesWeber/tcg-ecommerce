import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import multer from 'multer';

const __dirname = dirname(fileURLToPath(import.meta.url));

const storageIn = (folder) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `${__dirname}/public/${folder}`);
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    });
}

export const storageDestinationFolder = (folder) => {
    const storage = storageIn(folder);
    return multer({ storage });
}

export default __dirname;