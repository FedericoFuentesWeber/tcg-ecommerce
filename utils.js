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

const fileFilter = (allowedFiles) => {
    return (req, file, cb) => {

        const fileName = file.originalname.split(".").slice(0, -1).join(".");
        if(allowedFiles && allowedFiles.length >0 && allowedFiles.includes(fileName)) {
            return cb(new Error(`File not allowed`, false));
        }

        cb(null, true);
    }
}

export const storageDestinationFolder = (
    folder, 
    allowedFiles = []) => {
    const storage = storageIn(folder);
    return multer({ 
        storage: storage,
        fileFilter: fileFilter(allowedFiles) 
    });
}

export default __dirname;