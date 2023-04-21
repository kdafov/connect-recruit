/**
 * Internal API used for modifying the permissions of 
 * a recruiter from the admin page
 */

import db from "@/utils/db";

export default function handler(req, res) {
    const id = db.escapeChar(req.body.id);
    const action = db.escapeChar(req.body.action);
    let query;

    if (action === 'promote') {
        query = `UPDATE company_staff SET full_access = 1 WHERE user_id = ${id}`;
    } else if (action === 'demote') {
        query = `UPDATE company_staff SET full_access = 0 WHERE user_id = ${id}`;
    }

    db.RunQuery(query).then(() => {
        if (action === 'delete') {
            db.RunQuery(`DELETE FROM users WHERE user_id = ${id}`).then(() => {
                res.json({ status: 200 });
            })
        } else {
            res.json({ status: 200 });
        }
    })
}