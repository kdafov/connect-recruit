/**
 * Internal API used for uploading an image to the public folder
 */

import formidable from "formidable";
import path from 'path';
import fs from 'fs/promises';

export const config = {
    api: {
        bodyParser: false,
    }
};

const writeFile = async (req) => {
    let fileName = '';

    const options = {
        uploadDir: path.join(process.cwd(), '/public/logos'),
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
    try {
        await fs.readdir(path.join(process.cwd() + '/public', '/logos'));
    } catch (e) {
        await fs.mkdir(path.join(process.cwd() + '/public', '/logos'));
    }

    const response = await writeFile(req);
    res.json({ status: 200, data: response.fileName });
}