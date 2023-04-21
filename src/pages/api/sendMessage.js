/**
 * Internal API used for sending a message from the 
 * user to the recruiter and vice versa.
 */

import db from "@/utils/db";

export default function handler(req, res) {
    const mode = db.escapeChar(req.body.mode);

    if (mode === 'user-to-company') {
        const userId = db.escapeChar(req.body.user);
        const jobId = db.escapeChar(req.body.job);
        const content = db.escapeChar(req.body.msg);

        const checkQuery = `SELECT 0 FROM messages WHERE from_user = ${userId} AND to_user = (SELECT user_id FROM company WHERE id = (SELECT company_id FROM jobs WHERE id = ${jobId})) AND job_id = ${jobId};`;
        db.RunQuery(checkQuery).then((checkRes) => {
            let query;

            if (checkRes.length > 0) {
                // Message with same header already exists :. add to content
                query = `UPDATE messages SET content = CONCAT(content, '***', '${content}'), reply = 1 WHERE from_user = ${userId} AND to_user = (SELECT user_id FROM company WHERE id = (SELECT company_id FROM jobs WHERE id = ${jobId})) AND job_id = ${jobId};`;
            } else {
                // Create new message header
                query = `INSERT INTO messages(from_user, to_user, job_id, content, last_seen) VALUES(${userId}, (SELECT user_id FROM company WHERE id = (SELECT company_id FROM jobs WHERE id = ${jobId})), ${jobId}, '${content}', ${userId})`;
            }

            db.RunQuery(query).then(() => {
                res.json({status: 200});
            });
        });
    } else if (mode === 'reply-from-user') {
        const messageId = db.escapeChar(req.body.id);
        const content = db.escapeChar(req.body.content);

        let query = `UPDATE messages SET content = CONCAT(content, '***', '${content}'), reply = 1 WHERE id = ${messageId}`;
        db.RunQuery(query).then(() => {
            res.json({status: 200})
        })
    } else if (mode === 'user-opening-message') {
        const userId = db.escapeChar(req.body.userid);
        const messageId = db.escapeChar(req.body.msgid);

        let query = `UPDATE messages SET last_seen = ${userId}, reply = 0 WHERE id = ${messageId}`;
        db.RunQuery(query);
    }
}