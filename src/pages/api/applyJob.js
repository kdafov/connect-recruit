/**
 * Internal API used for adding an application from
 * the user to a job with the information provided
 * to that same application, and answers to any
 * questions set by the recruiter.
 */

import db from "@/utils/db";

export default function handler(req, res) {
    const userId = db.escapeChar(req.body.user);
    const jobId = db.escapeChar(req.body.job);
    const firstRoundData = req.body.fr_data;
    const secondRoundData = req.body.sr_data;
    const lastRoundData = req.body.lr_data;
    const userResponses = req.body.ur_data;

    let applicationQuery = `INSERT INTO applications(user_id, job_id) VALUES(${userId}, ${jobId})`;
    db.RunQuery(applicationQuery).then(( response ) => {
        const insertId = response.insertId;

        if (req.query.mode && req.query.mode === 'fast') {
            res.json({status: 200, data: insertId});
        } else {
            const queriesToBeExecuted = [];

            for (let i = 0; i < firstRoundData.length; i++) {
                queriesToBeExecuted.push(
                    `INSERT INTO supporting_docs(application_id, user_id, type, ref, title) VALUES(${insertId}, ${userId}, 'zKeyword', 'yes', '${firstRoundData[i][1]}')`
                );
            }

            for (let i = 0; i < secondRoundData.length; i++) {
                queriesToBeExecuted.push(
                    `INSERT INTO supporting_docs(application_id, user_id, type, ref, title) VALUES(${insertId}, ${userId}, 'zReq', 'yes', '${secondRoundData[i][1]}')`
                );
            }

            for (let i = 0; i < lastRoundData.length; i++) {
                if (lastRoundData[i*3] === 'Text Response') {
                    queriesToBeExecuted.push(`INSERT INTO supporting_docs(application_id, user_id, type, ref, title) VALUES(${insertId}, ${userId}, 'Text', '${userResponses[i]}', '${lastRoundData[i*3+1]}')`);
                }
                if (lastRoundData[i*3] === 'Video Response') {
                    queriesToBeExecuted.push(`INSERT INTO supporting_docs(application_id, user_id, type, ref, title) VALUES(${insertId}, ${userId}, 'Video', '${userResponses[i]}', '${lastRoundData[i*3+1]}')`);
                }
                if (lastRoundData[i*3] === 'Requirement') {
                    queriesToBeExecuted.push(`INSERT INTO supporting_docs(application_id, user_id, type, ref, title) VALUES(${insertId}, ${userId}, 'Req', '${userResponses[i]}', '${lastRoundData[i*3+1]}')`);
                }
                if (lastRoundData[i*3] === 'Keyword') {
                    queriesToBeExecuted.push(`INSERT INTO supporting_docs(application_id, user_id, type, ref, title) VALUES(${insertId}, ${userId}, 'Keyword', '${userResponses[i]}', '${lastRoundData[i*3+1]}')`);
                }
            }

            for (let i = 0; i < queriesToBeExecuted.length; i++) {
                db.RunQuery(queriesToBeExecuted[i]);
            }
            res.json({status: 200, data: insertId});
        }

        // Increment count of applications
        db.RunQuery(`UPDATE jobs SET applications = applications + 1 WHERE id = ${jobId};`);
    })
}