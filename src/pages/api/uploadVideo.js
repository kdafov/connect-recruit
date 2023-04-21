/**
 * Internal API used for uploading a video to the server
 */

import formidable from "formidable";
import path from 'path';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false,
    }
};

const writeFile = async (req) => {
    let fileName = '';

    const options = {
        uploadDir: path.join(process.cwd(), '/public/docs'),
        filename: (name, ext, path, form) => {
            fileName = Date.now().toString() + '_' + path.originalFilename;
            return Date.now().toString() + '_' + path.originalFilename;
        }
    }

    const form = formidable(options);
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if(err) reject(err);
            resolve({ fields, files, fileName });
        });
    });
}

export default async function handler(req, res) {
    const directoryPath = await path.join(process.cwd() + '/public', '/docs');
    try {
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }
    } catch (e) {
        console.error(err);
    }

    const response = await writeFile(req);

    res.json({ status: 200, data: response.fileName })
}