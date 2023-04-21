/**
 * Internal API used to check whether an email address
 * exists when a user attempts to register
 */

import db from "@/utils/db";

export default function handler(req, res) {
    if (req.method === 'POST') {
        const email = req.body.email;
        const query = `SELECT user_id FROM users WHERE email = '${db.escapeChar(email)}'`;
        db.RunQuery(query).then((data) => {
            res.json(data.length > 0);
        })
    } else {
        // API invocation failed (invalid method call)
        res.status(405).json({message: 'Invalid method for /api/auth'});
    }
}