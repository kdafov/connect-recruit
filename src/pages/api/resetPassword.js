/**
 * Internal API used for reseting the password of a user
 */

import db from '@/utils/db';
import emailClient from '@/utils/email';

export default function handler(req, res) {
    // Get email from request
    let email = db.escapeChar(req.body.email);

    // Check if email exists in the database
    let query = `SELECT user_id FROM users WHERE email = '${email}'`;
    db.RunQuery(query).then((response) => {
        if (response.length > 0) {
            // Email valid :. Generate password reset link & save to database
            let userId = response[0].user_id;
            let resetCode = userId + '$' +  [...Array(64)].map(() => Math.random().toString(36)[2]).join('');
            let insertQuery = `INSERT INTO password_reset(code) VALUES('${resetCode}')`;
            db.RunQuery(insertQuery).then((response) => {
                // Send email to user about reset link
                //DEV: emailClient.sendEmail('Subject', 'Text', '<h3>HTML</h3>');
                const resetLink = 'http://localhost:3000/login/reset?id=' + resetCode;
                res.json({
                    status: 200,
                    message: 'Success',
                    resetLink
                })
            });
        } else {
            res.json({
                status: 404,
                message: 'Email not found'
            })
        }
    })

}