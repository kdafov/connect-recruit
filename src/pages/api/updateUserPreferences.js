/**
 * Internal API used for updating the user's preferences
 */

import db from '@/utils/db';

export default function handler(req, res) {
    const id = db.escapeChar(req.body.id);
    const mode = db.escapeChar(req.body.mode);

    if (mode === 'admin') {
        let notifications = db.escapeChar(req.body.notifications);
        let directMessaging = db.escapeChar(req.body.dm);

        let query = `UPDATE company SET notifications = ${notifications}, direct_messages = ${directMessaging} WHERE user_id = ${id}`;
        db.RunQuery(query).then(() => {
            res.json({status: 200});
        });
    } else if (mode === 'recruiter') {
        let notifications = db.escapeChar(req.body.notifications);

        let query = `UPDATE users SET notifications = ${notifications} WHERE user_id = ${id}`;
        db.RunQuery(query).then(() => {
            res.json({status: 200});
        })
    } else if (mode === 'user') {
        let notifications = db.escapeChar(req.body.notifications);
        let globalcv = db.escapeChar(req.body.globalcv);
        let query = `UPDATE users SET notifications = ${notifications}, global_cv = ${globalcv} WHERE user_id = ${id}`;
        db.RunQuery(query).then(() => {
            res.json({status: 200});
        })
    }
}