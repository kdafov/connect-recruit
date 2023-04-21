/**
 * Internal API used for returning different metrics used
 * for data visualization across different pages.
 */

import db from "@/utils/db";

export default function handler(req, res) {
    const mode = db.escapeChar(req.body.mode);
    const id = db.escapeChar(req.body.id);

    if (mode === 'admin-metrics') {
        const recruitersCountGroupedQuery = `SELECT COUNT(record_id) AS metrics FROM company_staff WHERE company_id = (SELECT id FROM company WHERE user_id = ${id}) GROUP BY date_created;`;
        const recruitersCountQuery = `SELECT COUNT(record_id) AS metrics FROM company_staff WHERE company_id = (SELECT id FROM company WHERE user_id = ${id})`;
        const applicationsCountQuery = `SELECT COUNT(id) AS metrics FROM applications WHERE job_id IN (SELECT id FROM jobs WHERE company_id = (SELECT id FROM company WHERE user_id = ${id}))`;
        const applicationsCountGroupedQuery = `SELECT COUNT(id) AS metrics FROM applications WHERE job_id IN (SELECT id FROM jobs WHERE company_id = (SELECT id FROM company WHERE user_id = ${id})) GROUP BY date`;
        const jobsCountQuery = `SELECT COUNT(id) AS metrics FROM jobs WHERE company_id = (SELECT id FROM company WHERE user_id = ${id})`;
        const jobsCountGroupedQuery = `SELECT COUNT(id) AS metrics FROM jobs WHERE company_id = (SELECT id FROM company WHERE user_id = ${id}) GROUP BY date_posted`;
        const messagesCountPerDay = `SELECT DATE_FORMAT(date_table.date, '%d/%m') AS x, IFNULL(COUNT(messages.job_id), 0) AS y FROM (SELECT CURDATE() - INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY AS date FROM (SELECT 0 AS a UNION SELECT 1 AS a UNION SELECT 2 AS a UNION SELECT 3 AS a UNION SELECT 4 AS a UNION SELECT 5 AS a UNION SELECT 6 AS a UNION SELECT 7 AS a UNION SELECT 8 AS a UNION SELECT 9 AS a) AS a CROSS JOIN (SELECT 0 AS a UNION SELECT 1 AS a UNION SELECT 2 AS a UNION SELECT 3 AS a UNION SELECT 4 AS a UNION SELECT 5 AS a UNION SELECT 6 AS a UNION SELECT 7 AS a UNION SELECT 8 AS a UNION SELECT 9 AS a) AS b CROSS JOIN (SELECT 0 AS a UNION SELECT 1 AS a UNION SELECT 2 AS a UNION SELECT 3 AS a UNION SELECT 4 AS a UNION SELECT 5 AS a UNION SELECT 6 AS a UNION SELECT 7 AS a UNION SELECT 8 AS a UNION SELECT 9 AS a) AS c) AS date_table LEFT JOIN messages ON DATE(messages.timestamp) = date_table.date AND messages.job_id IN (SELECT id FROM jobs WHERE company_id = (SELECT id FROM company WHERE user_id = ${id})) WHERE date_table.date > DATE_SUB(CURDATE(), INTERVAL 7 DAY) GROUP BY x`;
        const jobsCountPerDay = `SELECT DATE_FORMAT(date_table.date, '%d/%m') AS x, IFNULL(COUNT(jobs.id), 0) AS y FROM (SELECT CURDATE() - INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY AS date FROM (SELECT 0 AS a UNION SELECT 1 AS a UNION SELECT 2 AS a UNION SELECT 3 AS a UNION SELECT 4 AS a UNION SELECT 5 AS a UNION SELECT 6 AS a UNION SELECT 7 AS a UNION SELECT 8 AS a UNION SELECT 9 AS a) AS a CROSS JOIN (SELECT 0 AS a UNION SELECT 1 AS a UNION SELECT 2 AS a UNION SELECT 3 AS a UNION SELECT 4 AS a UNION SELECT 5 AS a UNION SELECT 6 AS a UNION SELECT 7 AS a UNION SELECT 8 AS a UNION SELECT 9 AS a) AS b CROSS JOIN (SELECT 0 AS a UNION SELECT 1 AS a UNION SELECT 2 AS a UNION SELECT 3 AS a UNION SELECT 4 AS a UNION SELECT 5 AS a UNION SELECT 6 AS a UNION SELECT 7 AS a UNION SELECT 8 AS a UNION SELECT 9 AS a) AS c) AS date_table LEFT JOIN jobs ON DATE(jobs.date_posted) = date_table.date AND jobs.company_id = (SELECT id FROM company WHERE user_id = ${id}) WHERE date_table.date > DATE_SUB(CURDATE(), INTERVAL 7 DAY) GROUP BY x`;
        const applicationsPerJob = `SELECT title AS x, applications AS y FROM jobs WHERE company_id = (SELECT id FROM company WHERE user_id = ${id})`;
        const viewsPerJob = `SELECT title AS x, views AS y FROM jobs WHERE company_id = (SELECT id FROM company WHERE user_id = ${id})`;
        const typeOfApplications = `SELECT status, COUNT(id) AS metric FROM applications WHERE job_id IN (SELECT id FROM jobs WHERE company_id = ((SELECT id FROM company WHERE user_id = ${id}))) GROUP BY status;`;
        const bestJob = `SELECT MAX(applications) AS applications, views, DATEDIFF(NOW(), date_posted) AS days_ago, (SELECT COUNT(id) FROM messages WHERE messages.job_id = id) AS messages, title FROM jobs WHERE company_id = (SELECT id FROM company WHERE user_id = ${id}) LIMIT 1;`;

        db.RunQuery(recruitersCountQuery)
        .then((res1) => {

        db.RunQuery(recruitersCountGroupedQuery)
        .then((res2) => {

        db.RunQuery(applicationsCountQuery)
        .then((res3) => {

        db.RunQuery(applicationsCountGroupedQuery)
        .then((res4) => {

        db.RunQuery(jobsCountQuery)
        .then((res5) => {

        db.RunQuery(jobsCountGroupedQuery)
        .then((res6) => {

        db.RunQuery(messagesCountPerDay)
        .then((res7) => {

        db.RunQuery(jobsCountPerDay)
        .then((res8) => {

        db.RunQuery(applicationsPerJob)
        .then((res9) => {

        db.RunQuery(viewsPerJob)
        .then((res10) => {

        db.RunQuery(typeOfApplications)
        .then((res11) => {

        db.RunQuery(bestJob)
        .then((res12) => {

        res.json({ status: 200, metric1: {
                A: res1[0].metrics, 
                B: res2.map(v => v.metrics),
                C: res3[0].metrics,
                D: res4.map(v => v.metrics),
                E: res5[0].metrics,
                F: res6.map(v => v.metrics),
            }, metric2: {
                A: res7,
                B: res8
            }, metric3: {
                A: res9,
                B: res10
            }, metric4: {
                A: res11.map(item => item.status),
                B: res11.map(item => item.metric)
            }, metric5: res12[0]

        })
        })
        })
        })
        })
        })
        })
        })
        })
        })
        })
        })
        })
        
    } else if (mode === 'user-metrics') {
        const noJobs = `SELECT COUNT(id) AS metric FROM jobs`;
        const noCompanies = `SELECT COUNT(user_id) AS metric FROM users WHERE access_level = 'ADMIN_ACCESS';`;
        const noApplications = `SELECT COUNT(id) AS metric FROM applications`;
        const companyResponse = `SELECT u.name AS company_name, SUM(CASE WHEN a.status = 'pending' THEN 1 ELSE 0 END) AS pending_applications, SUM(CASE WHEN a.status != 'pending' THEN 1 ELSE 0 END) AS non_pending_applications FROM jobs j JOIN applications a ON j.id = a.job_id JOIN company c ON j.company_id = c.id JOIN users u ON c.user_id = u.user_id GROUP BY j.company_id;`;
        const mostPopularTerms = `SELECT skills AS v FROM cv`;
        const mostPopularJob = `SELECT applications, views, (SELECT COUNT(*) FROM applications WHERE status = 'accepted' AND job_id = id) AS accepted, (SELECT COUNT(*) FROM messages WHERE job_id = id) AS messages, (SELECT name FROM users WHERE user_id = (SELECT user_id FROM company WHERE id = company_id)) AS company, title FROM jobs ORDER BY applications DESC, views DESC LIMIT 1;`;
        const userMetrics = `SELECT status, COUNT(status) AS metric FROM applications WHERE user_id = ${id} GROUP BY status;`;

        db.RunQuery(noJobs)
        .then((res1) => {

        db.RunQuery(noCompanies)
        .then((res2) => {

        db.RunQuery(noApplications)
        .then((res3) => {

        db.RunQuery(companyResponse)
        .then((res4) => {

        db.RunQuery(mostPopularTerms)
        .then((res5) => {

        db.RunQuery(mostPopularJob)
        .then((res6) => {

        db.RunQuery(userMetrics)
        .then((res7) => {

        res.json({ status: 200, metric1: {
            A: res1[0].metric,
            B: res2[0].metric,
            C: res3[0].metric
        }, metric2: {
            A: res4
        }, metric3: {
            A: res5
        }, metric4: res6[0]
        , metric5: {
            A: res7
        }
            
        })
        })
        })
        })
        })
        })
        })
        })

    } else if (mode === 'recruiter-metrics') {
        const unansweredJobApplications = `SELECT COUNT(id) AS metrics FROM applications WHERE job_id IN (SELECT id FROM jobs WHERE company_id = (SELECT company_id FROM company_staff WHERE user_id = ${id})) AND status = 'pending';`;
        const unansweredMessages = `SELECT COUNT(id) AS metrics FROM messages WHERE job_id IN (SELECT id FROM jobs WHERE company_id = (SELECT company_id FROM company_staff WHERE user_id = ${id})) AND reply = 0 AND last_seen IN (SELECT user_id FROM users WHERE access_level = 'USER_ACCESS');`;
        const todayApplications = `SELECT COUNT(id) AS metrics FROM applications WHERE job_id IN (SELECT id FROM jobs WHERE company_id = (SELECT company_id FROM company_staff WHERE user_id = ${id})) AND date = DATE(NOW())`;
        const jobsPosted = `SELECT COUNT(id) as metrics FROM jobs WHERE posted_by = ${id}`;
        const quickApplyRaw = `SELECT COUNT(DISTINCT application_id) AS metric FROM supporting_docs WHERE application_id IN (SELECT id FROM applications WHERE job_id IN (SELECT id FROM jobs WHERE company_id = (SELECT company_id FROM company_staff WHERE user_id = ${id})));`;
        const applicationsCountQuery = `SELECT COUNT(id) AS metrics FROM applications WHERE job_id IN (SELECT id FROM jobs WHERE company_id = (SELECT company_id FROM company_staff WHERE user_id = ${id}))`;
        const activity = `SELECT COUNT(id) as metric FROM messages WHERE last_seen = ${id};`;
        const applicationsPerJob = `SELECT title AS x, applications AS y FROM jobs WHERE company_id = (SELECT company_id FROM company_staff WHERE user_id = ${id})`;
        const viewsPerJob = `SELECT title AS x, views AS y FROM jobs WHERE company_id = (SELECT company_id FROM company_staff WHERE user_id = ${id})`;

        db.RunQuery(unansweredJobApplications)
        .then((res1) => {

        db.RunQuery(unansweredMessages)
        .then((res2) => {

        db.RunQuery(todayApplications)
        .then((res3) => {

        db.RunQuery(jobsPosted)
        .then((res4) => {

        db.RunQuery(quickApplyRaw)
        .then((res5) => {

        db.RunQuery(activity)
        .then((res6) => {

        db.RunQuery(applicationsPerJob)
        .then((res7) => {

        db.RunQuery(viewsPerJob)
        .then((res8) => {

        db.RunQuery(applicationsCountQuery)
        .then((res9) => {

        res.json({ status: 200, metric1: {
            A: res1[0].metrics,
            B: res2[0].metrics,
            C: res3[0].metrics,
            D: res4[0].metrics,
            E: (res9[0].metrics - res5[0].metric),
            F: res6[0].metric
        }, metric2: {
            A: res7
        }, metric3: {
            A: res8
        }

        })
        })
        })
        })
        })
        })
        })
        })
        })
        })

    }
}