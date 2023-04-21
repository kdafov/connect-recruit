/**
 * Internal API used for updating the password after
 * password request has been made (in the forgot 
 * password screen).
 */

import db from '@/utils/db';
import emailClient from '@/utils/email';
import bcrypt from 'bcryptjs';

export default function handler(req, res) {
    // Get parameters of request
    const password = db.escapeChar(req.body.password);
    const resetId = db.escapeChar(req.body.id);

    // Check reset code
    const query = `SELECT timestamp FROM password_reset WHERE code = '${resetId}'`;
    db.RunQuery(query).then((response) => {
        if (response.length > 0) {
            const tokenTimestamp = new Date(response[0].timestamp);
            const nowBF5 = new Date(Date.now() - 5*60*1000);

            // Check if token has expired (5 mins)
            if (tokenTimestamp > nowBF5) {
                // Token valid :. Check if password is same as old one
                const user = resetId.split('$')[0];
                const queryB = `SELECT password FROM users WHERE user_id = ${user}`;
                db.RunQuery(queryB).then((responseB) => {
                    // Check if user tries to use the same password
                    const passwordMatch = bcrypt.compareSync(password, responseB[0].password);
                    if (passwordMatch) {
                        res.json({
                            status: 400,
                            message: 'User is using the same password'
                        })
                    } else {
                        // Encrypt the password and save it in the database
                        const salt = bcrypt.genSaltSync(10);
                        const hashPassword = bcrypt.hashSync(password, salt);
                        const queryC = `UPDATE users SET password = '${hashPassword}' WHERE user_id = ${user}`;
                        db.RunQuery(queryC).then(() => {
                            res.json({
                                status: 200,
                                message: 'Password updated'
                            })
                        })
                    }
                })
            } else {
                res.json({
                    status: 498,
                    message: 'Reset token has expired'
                })
            }
        } else {
            res.json({
                status: 404,
                message: 'Reset code not valid'
            });
        }
    });
}