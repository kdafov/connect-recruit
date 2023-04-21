/**
 * Internal API used for loading data used on the recruiter's page
 */

import db from "@/utils/db";

export default function handler(req, res) {
    const id = db.escapeChar(req.body.id);
    const mode = db.escapeChar(req.body.mode);
    const addParam = db.escapeChar(req.body.addParam);
    let query;
    let priorityJobs;
    let restOfJobs;

    if (mode === 'basic') {
        // Return name of a recruiter
        query = `SELECT name FROM users WHERE user_id = ${id}`;

    } else if (mode === 'resolve-company-name') {
        // Return the name of a company given the recruiter working for it
        query = `SELECT name FROM users WHERE user_id = (SELECT user_id FROM company WHERE id = (SELECT company_id FROM company_staff WHERE user_id = ${id}))`;

    } else if (mode === 'list-active-jobs-newest') {
        // Return list of active jobs for a company (newest first)
        priorityJobs = `SELECT id, title, date_posted, expiring, exp_date, applications, views FROM jobs WHERE id IN (SELECT job_id FROM messages WHERE to_user = (SELECT user_id FROM company WHERE id = (SELECT company_id FROM company_staff WHERE user_id = ${id})) AND last_seen NOT IN (SELECT user_id FROM company_staff WHERE company_id = (SELECT company_id FROM company_staff WHERE user_id = ${id})) UNION SELECT job_id FROM applications WHERE job_id IN (SELECT id FROM jobs WHERE company_id = (SELECT company_id FROM company_staff WHERE user_id = ${id})) AND status = 'pending' AND seen = 'no') ORDER BY date_posted DESC;`;
        restOfJobs = `SELECT id, title, date_posted, expiring, exp_date, applications, views FROM jobs WHERE id NOT IN (SELECT job_id FROM messages WHERE to_user = (SELECT user_id FROM company WHERE id = (SELECT company_id FROM company_staff WHERE user_id = ${id})) AND last_seen NOT IN (SELECT user_id FROM company_staff WHERE company_id = (SELECT company_id FROM company_staff WHERE user_id = ${id})) UNION SELECT job_id FROM applications WHERE job_id IN (SELECT id FROM jobs WHERE company_id = (SELECT company_id FROM company_staff WHERE user_id = ${id})) AND status = 'pending' AND seen = 'no') AND company_id = (SELECT company_id FROM company_staff WHERE user_id = ${id}) ORDER BY date_posted DESC;`;

    } else if (mode === 'list-active-jobs-oldest') {
        // Return list of active jobs for a company (oldest first)
        priorityJobs = `SELECT id, title, date_posted, expiring, exp_date, applications, views FROM jobs WHERE id IN (SELECT job_id FROM messages WHERE to_user = (SELECT user_id FROM company WHERE id = (SELECT company_id FROM company_staff WHERE user_id = ${id})) AND last_seen NOT IN (SELECT user_id FROM company_staff WHERE company_id = (SELECT company_id FROM company_staff WHERE user_id = ${id})) UNION SELECT job_id FROM applications WHERE job_id IN (SELECT id FROM jobs WHERE company_id = (SELECT company_id FROM company_staff WHERE user_id = ${id})) AND status = 'pending' AND seen = 'no') ORDER BY date_posted ASC;`;
        restOfJobs = `SELECT id, title, date_posted, expiring, exp_date, applications, views FROM jobs WHERE id NOT IN (SELECT job_id FROM messages WHERE to_user = (SELECT user_id FROM company WHERE id = (SELECT company_id FROM company_staff WHERE user_id = ${id})) AND last_seen NOT IN (SELECT user_id FROM company_staff WHERE company_id = (SELECT company_id FROM company_staff WHERE user_id = ${id})) UNION SELECT job_id FROM applications WHERE job_id IN (SELECT id FROM jobs WHERE company_id = (SELECT company_id FROM company_staff WHERE user_id = ${id})) AND status = 'pending' AND seen = 'no') AND company_id = (SELECT company_id FROM company_staff WHERE user_id = ${id}) ORDER BY date_posted ASC;`;

    } else if (mode === 'list-active-jobs-applications') {
        priorityJobs = `SELECT id, title, date_posted, expiring, exp_date, applications, views FROM jobs WHERE id IN (SELECT job_id FROM messages WHERE to_user = (SELECT user_id FROM company WHERE id = (SELECT company_id FROM company_staff WHERE user_id = ${id})) AND last_seen NOT IN (SELECT user_id FROM company_staff WHERE company_id = (SELECT company_id FROM company_staff WHERE user_id = ${id})) UNION SELECT job_id FROM applications WHERE job_id IN (SELECT id FROM jobs WHERE company_id = (SELECT company_id FROM company_staff WHERE user_id = ${id})) AND status = 'pending' AND seen = 'no') ORDER BY applications DESC;`;
        restOfJobs = `SELECT id, title, date_posted, expiring, exp_date, applications, views FROM jobs WHERE id NOT IN (SELECT job_id FROM messages WHERE to_user = (SELECT user_id FROM company WHERE id = (SELECT company_id FROM company_staff WHERE user_id = ${id})) AND last_seen NOT IN (SELECT user_id FROM company_staff WHERE company_id = (SELECT company_id FROM company_staff WHERE user_id = ${id})) UNION SELECT job_id FROM applications WHERE job_id IN (SELECT id FROM jobs WHERE company_id = (SELECT company_id FROM company_staff WHERE user_id = ${id})) AND status = 'pending' AND seen = 'no') AND company_id = (SELECT company_id FROM company_staff WHERE user_id = ${id}) ORDER BY applications DESC;`;

    } else if (mode === 'list-active-jobs-views') {
        priorityJobs = `SELECT id, title, date_posted, expiring, exp_date, applications, views FROM jobs WHERE id IN (SELECT job_id FROM messages WHERE to_user = (SELECT user_id FROM company WHERE id = (SELECT company_id FROM company_staff WHERE user_id = ${id})) AND last_seen NOT IN (SELECT user_id FROM company_staff WHERE company_id = (SELECT company_id FROM company_staff WHERE user_id = ${id})) UNION SELECT job_id FROM applications WHERE job_id IN (SELECT id FROM jobs WHERE company_id = (SELECT company_id FROM company_staff WHERE user_id = ${id})) AND status = 'pending' AND seen = 'no') ORDER BY views DESC;`;
        restOfJobs = `SELECT id, title, date_posted, expiring, exp_date, applications, views FROM jobs WHERE id NOT IN (SELECT job_id FROM messages WHERE to_user = (SELECT user_id FROM company WHERE id = (SELECT company_id FROM company_staff WHERE user_id = ${id})) AND last_seen NOT IN (SELECT user_id FROM company_staff WHERE company_id = (SELECT company_id FROM company_staff WHERE user_id = ${id})) UNION SELECT job_id FROM applications WHERE job_id IN (SELECT id FROM jobs WHERE company_id = (SELECT company_id FROM company_staff WHERE user_id = ${id})) AND status = 'pending' AND seen = 'no') AND company_id = (SELECT company_id FROM company_staff WHERE user_id = ${id}) ORDER BY views DESC;`;

    } else if (mode === 'simple-job-advert-data') {
        // Return basic information for given job advert
        query = `SELECT title, date_posted, expiring, exp_date, views, applications FROM jobs WHERE id = ${id}`;
    } else if (mode === 'load-notifications-settings') {
        // Return notification settings for user
        query = `SELECT notifications FROM users WHERE user_id = ${id}`;
    } else if (mode === 'load-edit-job-info') {
        // Return information when recruiter editing jobs
        query = `SELECT title, job_type, job_level, mode, location, salary, description, requirements, benefits, add_info, fast_apply, screening, date_posted, expiring, exp_date FROM jobs WHERE id = ${id}`;
    } else if (mode === 'load-job-candidates') {
        // Return list of all candidates related to a particular job advert
        query = `SELECT id, (SELECT name FROM users WHERE users.user_id = applications.user_id) AS name, date, seen FROM applications WHERE job_id = ${id} AND status = 'pending';`;
    } else if (mode === 'load-job-msg') {
        // Return list of all messages related to a particular job advert
        query = `SELECT id, content, last_seen FROM messages WHERE job_id = ${id};`
    } else if (mode === 'load-application-data') {
        query = `SELECT applications.id, users.user_id AS user, users.name, users.email, users.cv_ref, cv.phone, cv.summary, cv.skills, cv.total_experience, cv.education, cv.work_experience, cv.certifications FROM applications JOIN users ON applications.user_id = users.user_id JOIN cv ON applications.user_id = cv.user_id WHERE applications.id = ${id};`;
    } else if (mode === 'load-screening-data') {
        query = `SELECT id, type, ref, title FROM supporting_docs WHERE application_id = ${id} AND user_id = ${addParam}`;
    } else if (mode === 'acknowledge-application') {
        query = `UPDATE applications SET seen = 'yes' WHERE id = ${id}`;
    } else if (mode === 'respond-to-application') {
        query = `UPDATE applications SET status = '${addParam}', seen = 'no' WHERE id = ${id}`;
    } else if (mode === 'check-recruiter-access') {
        query = `SELECT full_access FROM company_staff WHERE user_id = ${id}`;
    } else if (mode === 'load-cv-base') {
        query = `SELECT cv.*, u.name, u.email FROM cv JOIN users u ON u.user_id = cv.user_id WHERE u.global_cv = 1;`;
    } else if (mode === 'modify-status-applications') {
        query = `UPDATE applications SET status = '${addParam}', seen = 'no' WHERE job_id = ${id}`;
    }

    if(mode === 'list-active-jobs-newest' || mode === 'list-active-jobs-oldest' || mode === 'list-active-jobs-applications' || mode === 'list-active-jobs-views') {
        db.RunQuery(priorityJobs).then((priorityData) => {
            priorityData = priorityData.map(item => ({...item, notify: 1}));
            db.RunQuery(restOfJobs).then((otherData) => {
                otherData = otherData.map(item => ({...item, notify: 0}));
                const combinedData = priorityData.concat(otherData);
                res.json({
                    status: 200,
                    data: combinedData
                });
            });
        });
    } else {
        db.RunQuery(query).then((data) => {
            res.json({
                status: 200,
                data
            });
        });
    }
}