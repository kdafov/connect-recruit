/**
 * Internal API used for saving a job to the user's profile
 */

import db from "@/utils/db";

export default function handler(req, res) {
    const userId = db.escapeChar(req.body.user);
    const jobId = db.escapeChar(req.body.job);

    const query = `INSERT INTO saved_jobs (user, job) SELECT ${userId}, ${jobId} WHERE NOT EXISTS (SELECT 1 FROM saved_jobs WHERE user = ${userId} AND job = ${jobId});`;
    db.RunQuery(query).then(() => {
        res.json({status: 200});
    })
}