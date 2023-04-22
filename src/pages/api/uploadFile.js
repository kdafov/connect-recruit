/**
 * Internal API used for uploading files to the public folder
 */
import formidable from "formidable";
import fs from 'fs';
import axios from "axios";
import FormData from 'form-data';
import db from "@/utils/db";
import { Storage } from '@google-cloud/storage';

export const config = {
    api: {
        bodyParser: false,
    }
};

const apiKey = process.env.SUPERPARSER_API_KEY;
const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    keyFilename: 'gcp-cloud-key.json',
});
const parseConfig = {
    headers: {
        'Content-Type': 'multipart/form-data',
        'X-API-Key': apiKey,
    }
};

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
            const readStream = fs.createReadStream(filepath);

            try {
                const fileName = `${newFilename}_${originalFilename}`;
                const bucketName = process.env.GCP_BUCKET_NAME;
                const bucket = storage.bucket(bucketName);
                const destination = `cv/${fileName}`;
                await bucket.upload(filepath, { destination });
   

                console.log('--- cv parsing ---')
                const formData = new FormData();
                formData.append('cv', readStream, originalFilename);   

                axios.post('https://api.superparser.com/parse', formData, parseConfig)
                .then(cvparserResponse => {
                    if (cvparserResponse.data.status === 'success') {
                        const phone = cvparserResponse.data.data.phone[0].phone || '';
                        const summary = cvparserResponse.data.data.profile_summary || '';
                        const skills = cvparserResponse.data.data.skills.overall_skills.join(', ') || '';
                        const experience = cvparserResponse.data.data.total_experience.years ? `${cvparserResponse.data.data.total_experience.years} years and ${cvparserResponse.data.data.total_experience.months} months` : `${cvparserResponse.data.data.total_experience.months} months`;
                        const educationString = cvparserResponse.data.data.education.map(e => 
                            `${(e.institute || '').replace(/[^a-zA-Z0-9\s.]/g, '').trim()}, 
                            ${(e.degree || '').replace(/[^a-zA-Z0-9\s.]/g, '').trim()}, 
                            ${(e.course || '').replace(/[^a-zA-Z0-9\s.]/g, '').trim()}`
                        ).join(', ');
                        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                        const employerString = cvparserResponse.data.data.employer.map(e => [
                            e.company_name, 
                            `${months[e.from_month - 1]} ${e.from_year}`, 
                            `${months[e.to_month - 1]} ${e.to_year}`, 
                            e.role, 
                            (e.description || '').replace(/[^a-zA-Z0-9\s.]/g, '').trim()
                        ].join(', ')).join(', ');
                        const cert = (cvparserResponse.data.data.certifications) ? cvparserResponse.data.data.certifications.join(', ') : '';

                        const query = `IF EXISTS (SELECT * FROM cv WHERE user_id = ${req.query.uid}) THEN UPDATE cv SET phone = '${phone}', summary = '${summary}', skills = '${skills}', total_experience = '${experience}', education = '${educationString}', work_experience = '${employerString}', certifications = '${cert}' WHERE user_id = ${req.query.uid}; ELSE INSERT INTO cv(phone, summary, skills, total_experience, education, work_experience, certifications, user_id) VALUES('${phone}', '${summary}', '${skills}', '${experience}', '${educationString}', '${employerString}', '${cert}', ${req.query.uid}); END IF;`;

                        db.RunQuery(query).then(() => {
                            db.RunQuery(`UPDATE users SET cv_ref = 'https://storage.cloud.google.com/${process.env.GCP_BUCKET_NAME}/cv/${fileName}', requires_setup = 0 WHERE user_id = ${req.query.uid}`).then(() => {
                                res.json({ status: 200, data: `https://storage.cloud.google.com/${process.env.GCP_BUCKET_NAME}/cv/${fileName}` })
                            })
                        });

                    } else {
                        res.json({ status: 500 });
                    }
                })
                .catch(error => {
                    console.log(error);
                });
            } catch (err) {
                console.error(err);
                console.log('Internal Server Error');
            }
        }
    });
}