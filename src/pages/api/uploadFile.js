/**
 * Internal API used for uploading files to the public folder
 */

import formidable from "formidable";
import path from 'path';
import fs from 'fs';
import axios from "axios";
import FormData from 'form-data';
import db from "@/utils/db";

const apiKey = 'cjFhtm3Gux6uCFYPN4GtI6DOSef8UkCz2oIGWsAf';

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

    if (req.query.mode) {
        if (req.query.mode === 'cv') {
            console.log('cv parsing')
            const parseConfig = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-API-Key': apiKey,
                }
            };

            const readStream = await fs.createReadStream(
                path.join(process.cwd(), '/public/docs', response.fileName)
            );
            const formData = new FormData();
            formData.append('cv', readStream);
            
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

                    //const query = `INSERT INTO cv(phone, summary, skills, total_experience, education, work_experience, certifications, user_id) VALUES('${phone}', '${summary}', '${skills}', '${experience}', '${educationString}', '${employerString}', '${cert}', ${req.query.uid})`;

                    const query = `IF EXISTS (SELECT * FROM cv WHERE user_id = ${req.query.uid}) THEN UPDATE cv SET phone = '${phone}', summary = '${summary}', skills = '${skills}', total_experience = '${experience}', education = '${educationString}', work_experience = '${employerString}', certifications = '${cert}' WHERE user_id = ${req.query.uid}; ELSE INSERT INTO cv(phone, summary, skills, total_experience, education, work_experience, certifications, user_id) VALUES('${phone}', '${summary}', '${skills}', '${experience}', '${educationString}', '${employerString}', '${cert}', ${req.query.uid}); END IF;`;

                    db.RunQuery(query).then(() => {
                        db.RunQuery(`UPDATE users SET cv_ref = '${response.fileName}', requires_setup = 0 WHERE user_id = ${req.query.uid}`).then(() => {
                            res.json({ status: 200, data: response.fileName })
                        })
                    });

                } else {
                    res.json({ status: 500 });
                }
            })
            .catch(error => {
                console.log(error);
            });
        }
    } else {
        res.json({ status: 200, data: response.fileName });
    }
}