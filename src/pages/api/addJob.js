/**
 * Internal API used for adding new job to the
 * job listings from the recruiter
 */

import db from "@/utils/db";

export default function handler(req, res) {
    const recruiterId = db.escapeChar(req.body.id);
    const title = db.escapeChar(req.body.title);
    const jType = db.escapeChar(req.body.type);
    const jLevel = db.escapeChar(req.body.level);
    const jMode = db.escapeChar(req.body.mode);
    const jLocation = db.escapeChar(req.body.location);
    const jSalary = db.escapeChar(req.body.salary);
    const jDescription = db.escapeChar(req.body.description);
    const jReq = db.escapeChar(req.body.requirements);
    const jBenefits = db.escapeChar(req.body.benefits);
    const jMoreInfo = db.escapeChar(req.body.addInfo);
    const fastApply = db.escapeChar(req.body.fastApply);
    const screening = db.escapeChar(req.body.screening);
    const expiring = db.escapeChar(req.body.exp);
    const exp_date = db.escapeChar(req.body.expDate);
    const editMode = db.escapeChar(req.body.editing); // 'yes' or 'no'
    const existingJob = db.escapeChar(req.body.exJob);
    let query;

    if (fastApply === 'yes') {
        if (editMode === 'yes') {
            query = `UPDATE jobs SET title = '${title}', job_type = '${jType}', job_level = '${jLevel}', mode = '${jMode}', location = '${jLocation}', salary = '${jSalary}', description = '${jDescription}', requirements = '${jReq}', benefits = '${jBenefits}', add_info = '${jMoreInfo}', posted_by = ${recruiterId}, expiring = ${expiring}, exp_date = '${exp_date}', fast_apply = 1 WHERE id = ${existingJob}`;
        } else {
            query = `INSERT INTO jobs(company_id, title, job_type, job_level, mode, location, salary, description, requirements, benefits, add_info, posted_by, expiring, exp_date) VALUES((SELECT company_id FROM company_staff WHERE user_id = ${recruiterId}), '${title}', '${jType}', '${jLevel}', '${jMode}', '${jLocation}', '${jSalary}', '${jDescription}', '${jReq}', '${jBenefits}', '${jMoreInfo}', ${recruiterId}, ${expiring}, '${exp_date}')`;
        }
    } else {
        if (editMode === 'yes') {
            query = `UPDATE jobs SET title = '${title}', job_type = '${jType}', job_level = '${jLevel}', mode = '${jMode}', location = '${jLocation}', salary = '${jSalary}', description = '${jDescription}', requirements = '${jReq}', benefits = '${jBenefits}', add_info = '${jMoreInfo}', posted_by = ${recruiterId}, expiring = ${expiring}, exp_date = '${exp_date}', screening = '${screening}', fast_apply = 0 WHERE id = ${existingJob}`;
        } else {
            query = `INSERT INTO jobs(company_id, title, job_type, job_level, mode, location, salary, description, requirements, benefits, add_info, posted_by, expiring, exp_date, screening, fast_apply) VALUES((SELECT company_id FROM company_staff WHERE user_id = ${recruiterId}), '${title}', '${jType}', '${jLevel}', '${jMode}', '${jLocation}', '${jSalary}', '${jDescription}', '${jReq}', '${jBenefits}', '${jMoreInfo}', ${recruiterId}, ${expiring}, '${exp_date}', '${screening}', 0)`;
        }
    }

    db.RunQuery(query).then((data) => {
        res.json({
            status: 200,
            advertId: data.insertId
        })
    })

}