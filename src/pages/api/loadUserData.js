/**
 * Internal API used for loading data on the user's page
 */

import db from "@/utils/db";

export default function handler(req, res) {
    const mode = db.escapeChar(req.body.mode);    

    if (mode === 'load-jobs-simple') {
        let query = `SELECT id, title, (SELECT name FROM users WHERE user_id = (SELECT user_id FROM company WHERE id = company_id )) as name, (SELECT logo_url FROM company WHERE id = company_id) as logo, location, job_type as type, job_level as level, mode, salary, date_posted, CASE WHEN expiring = 1 AND exp_date > NOW() THEN exp_date ELSE '' END as exp_date FROM jobs WHERE expiring = 0 OR (expiring = 1 AND exp_date > NOW());`;
        db.RunQuery(query).then((response) => {
            res.json({'status': 200, 'data': response});
        })
    } else if (mode === 'profile-simple') {
        const id = db.escapeChar(req.body.id);
        let query = `SELECT name, email, notifications, requires_setup, global_cv, cv_ref FROM users WHERE user_id = ${id}`;
        db.RunQuery(query).then((response) => {
            res.json({'status': 200, 'data': response[0]});
        })
    } else if (mode === 'update-user-details') {
        const id = db.escapeChar(req.body.id);
        const email = db.escapeChar(req.body.email);
        const name = db.escapeChar(req.body.name);
        let query = `UPDATE users SET name = '${name}', email = '${email}' WHERE user_id = ${id}`;
        db.RunQuery(query).then(() => {
            res.json({'status': 200});
        })
    } else if (mode === 'job-advert-info') {
        const jobid = db.escapeChar(req.body.jobid);
        let query = `SELECT title AS job_title, job_type, job_level, mode, location, salary, description, requirements, benefits, add_info, fast_apply, screening, date_posted, expiring, exp_date, views, applications, (SELECT name from users WHERE user_id = (SELECT user_id FROM company WHERE id = (SELECT company_id FROM jobs WHERE id = ${jobid}))) AS company_name, (SELECT logo_url FROM company WHERE id = (SELECT company_id FROM jobs WHERE id = ${jobid})) AS logo, (SELECT company_description FROM company WHERE id = (SELECT company_id FROM jobs WHERE id = ${jobid})) AS company_description, (SELECT direct_messages FROM company WHERE id = (SELECT company_id FROM jobs WHERE id = ${jobid})) AS dmAccess FROM jobs WHERE id = ${jobid};`;
        db.RunQuery(query).then((response) => {
            db.RunQuery(`UPDATE jobs SET views = views + 1 WHERE id = ${jobid};`);
            res.json({'status': 200, 'data': response[0]});
        })
    } else if (mode === 'check-screening') {
        const jobid = db.escapeChar(req.body.jobid);
        const id = db.escapeChar(req.body.id);
        let query = `SELECT j.screening, CONCAT(c.summary, c.skills, c.certifications) AS keywords FROM jobs j JOIN cv c ON c.user_id = ${id} AND j.id = ${jobid};`
        db.RunQuery(query).then((response) => {
            res.json({'status': 200, 'data': response[0]});
        });
    } else if (mode === 'load-jobs-panel-data') {
        const userid = db.escapeChar(req.body.userid);
        let jobsQuery = `SELECT app.id, app.status, app.seen, app.date, jobs.title, users.name AS company_name FROM applications AS app JOIN jobs ON jobs.id = app.job_id JOIN company ON company.id = jobs.company_id JOIN users ON users.user_id = company.user_id WHERE app.user_id = ${userid};`;
        db.RunQuery(jobsQuery).then((jobsResponse) => {
            let savedQuery = `SELECT jobs.id, jobs.title, users.name AS company_name FROM saved_jobs AS saved JOIN jobs ON jobs.id = saved.job JOIN company ON company.id = jobs.company_id JOIN users ON users.user_id = company.user_id WHERE saved.user = ${userid};`;
            db.RunQuery(savedQuery).then((savedResponse) => {
                let msgQuery = `SELECT m.id, CASE WHEN m.from_user = ${userid} THEN ut.name ELSE uf.name END as other_user_name, m.content, m.last_seen, m.reply, (SELECT title FROM jobs WHERE id = m.job_id) as job_title FROM messages m JOIN users uf ON (m.from_user = uf.user_id) JOIN users ut ON (m.to_user = ut.user_id) WHERE m.from_user = ${userid} OR m.to_user = ${userid};`;
                db.RunQuery(msgQuery).then((msgResponse) => {
                    let responseData = {
                        jobs: jobsResponse,
                        saved: savedResponse,
                        messages: msgResponse
                    };
                    res.json({status: 200, data: responseData})
                    
                    db.RunQuery(`UPDATE applications SET seen = 'yes' WHERE user_id = ${userid} AND status != 'pending'`);
                });                
            });
        });
    } else if (mode === 'return-user-notifications') {
        const userId = db.escapeChar(req.body.id);
        let query = `SELECT 0 FROM applications WHERE user_id = ${userId} AND status != 'pending' AND seen = 'no' UNION SELECT 0 FROM messages WHERE from_user = ${userId} AND last_seen != ${userId} AND reply = 1 UNION SELECT 0 FROM messages WHERE to_user = ${userId} AND last_seen != ${userId} AND reply = 1;`;
        db.RunQuery(query).then((response) => {
            res.json({status: 200, data: [false, false, response.length > 0 ? true : false]})
        })
    } else if (mode === 'api-key-check') {
        const userId = db.escapeChar(req.body.id);
        let query = `SELECT access_key FROM devaccess WHERE user = ${userId}`;
        db.RunQuery(query).then((response) => {
            if (response.length > 0) {
                // user already got api key
                res.json({status: 200, key: response[0].access_key});
            } else {
                res.json({status: 200, key: ''});
            }
        })
    } else if (mode === 'create-api-key') {
        // user doesnt have access key :. create one
        const userId = db.escapeChar(req.body.id);
        const accessKey = Math.random().toString(36).substring(2, 22);
        db.RunQuery(`INSERT INTO devaccess(user, access_key) VALUES(${userId},'${accessKey}')`).then((insertResponse) => {
            let insertId = insertResponse.insertId
            db.RunQuery(`SELECT access_key FROM devaccess WHERE id = ${insertId}`).then((lookupResponse) => {
                res.json({status: 200, key: lookupResponse[0].access_key});
            })
        })
    } else if (mode === 'check-job-application-rights') {
        const userId = db.escapeChar(req.body.user);
        const jobId = db.escapeChar(req.body.job);
        db.RunQuery(`SELECT 0 FROM applications WHERE user_id = ${userId} AND job_id = ${jobId} AND status = 'pending'`).then((response) => {
            res.json({status: 200, data: response.length});
        });
    }
}