import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const storageIn = (folder) => {
    const dir = path.join(__dirname, 'public', folder);
    // Ensure directory exists
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `${__dirname}/public/${folder}`);
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    });
}

export const storageDestinationFolder = (
    folder) => {
    const storage = storageIn(folder);
    return multer({ 
        storage: storage
    });
}

export default __dirname;