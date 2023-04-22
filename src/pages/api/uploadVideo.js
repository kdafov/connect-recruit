/**
 * Internal API used for uploading a video to the server
 */

import formidable from "formidable";
import path from 'path';
import fs from 'fs';
import { Storage } from '@google-cloud/storage';

export const config = {
    api: {
        bodyParser: false,
    }
};

const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    keyFilename: 'gcp-cloud-key.json',
});

export default async function handler(req, res) {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        const uploadedFile = Object.values(files)[0];
        const { filepath, newFilename, originalFilename } = uploadedFile;
        if (!uploadedFile) {
            console.log('No file was uploaded');
            return;
        } else {
            try {
                const fileName = `${newFilename}_${originalFilename}`;
                const bucketName = process.env.GCP_BUCKET_NAME;
                const bucket = storage.bucket(bucketName);
                const destination = `videos/${fileName}`;
                await bucket.upload(filepath, { destination });

                res.json({ status: 200, data: `https://storage.cloud.google.com/${process.env.GCP_BUCKET_NAME}/videos/${fileName}` });
            } catch (err) {
                console.error(err);
                console.log('Internal Server Error');
            }
        }
    });
}