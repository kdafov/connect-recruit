/**
 * Internal API used for deleting users including
 * users, recruiters, and administrators thus companies
 */

import db from '@/utils/db';

export default function handler(req, res) {
    const id = db.escapeChar(req.body.id);
    const mode = db.escapeChar(req.body.mode);

    if (mode === 'user') {
        const dl1 = `DELETE FROM supporting_docs WHERE user_id = ${id}`;
        const dl2 = `DELETE FROM saved_jobs WHERE user = ${id}`;
        const dl3 = `DELETE FROM messages WHERE from_user = ${id} OR to_user = ${id}`;
        const dl4 = `DELETE FROM devaccess WHERE user = ${id}`;
        const dl5 = `DELETE FROM cv WHERE user_id = ${id}`;
        const dl6 = `DELETE FROM applications WHERE user_id = ${id}`;
        const dl7 = `DELETE FROM users WHERE user_id = ${id}`;

        db.RunQuery(dl1)
        .then(() => db.RunQuery(dl2))
        .then(() => db.RunQuery(dl3))
        .then(() => db.RunQuery(dl4))
        .then(() => db.RunQuery(dl5))
        .then(() => db.RunQuery(dl6))
        .then(() => db.RunQuery(dl7))
        .then(() => { res.json({status: 200}); })
        .catch((error) => console.error(error));

    } else if (mode === 'recruiter') {
        const rl1 = `UPDATE jobs SET posted_by = (SELECT user_id FROM company WHERE id = (SELECT company_id FROM company_staff WHERE user_id = ${id})) WHERE posted_by = ${id}`;
        const rl2 = `DELETE FROM messages WHERE from_user = ${id} OR to_user = ${id}`;
        const rl3 = `DELETE FROM company_staff WHERE user_id = ${id}`;
        const rl4 = `DELETE FROM users WHERE user_id = ${id}`;

        db.RunQuery(rl1)
        .then(() => db.RunQuery(rl2))
        .then(() => db.RunQuery(rl3))
        .then(() => db.RunQuery(rl4))
        .then(() => { res.json({status: 200}); })
        .catch((error) => console.error(error));

    } else if (mode === 'company') {
        const am1 = `DELETE FROM supporting_docs WHERE application_id IN (SELECT id FROM applications WHERE job_id IN (SELECT id FROM jobs WHERE company_id = (SELECT id FROM company WHERE user_id = ${id})))`;
        const am2 = `DELETE FROM saved_jobs WHERE job IN (SELECT id FROM jobs WHERE company_id = (SELECT id FROM company WHERE user_id = ${id}))`;
        const am3 = `DELETE FROM messages WHERE job_id IN (SELECT id FROM jobs WHERE company_id = (SELECT id FROM company WHERE user_id = ${id}))`;
        const am6 = `DELETE FROM jobs WHERE company_id = (SELECT id FROM company WHERE user_id = ${id})`;
        const am5 = `DELETE FROM company_staff WHERE company_id = (SELECT id FROM company WHERE user_id = ${id})`;
        const am4 = `DELETE FROM applications WHERE id IN (SELECT id FROM applications WHERE job_id IN (SELECT id FROM jobs WHERE company_id = (SELECT id FROM company WHERE user_id = ${id})))`;
        const am7 = `DELETE FROM company WHERE user_id = ${id}`;
        const am8 = `DELETE FROM users WHERE user_id = ${id}`;

        db.RunQuery(am1)
        .then(() => db.RunQuery(am2))
        .then(() => db.RunQuery(am3))
        .then(() => db.RunQuery(am4))
        .then(() => db.RunQuery(am5))
        .then(() => db.RunQuery(am6))
        .then(() => db.RunQuery(am7))
        .then(() => db.RunQuery(am8))
        .then(() => { res.json({status: 200}); })
        .catch((error) => console.error(error));
    }
}