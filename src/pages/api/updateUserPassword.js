/**
 * Internal API used for resetting the password of a user
 */

import db from '@/utils/db';
import bcrypt from 'bcryptjs';

export default function handler(req, res) {
    // Get parameters of request
    const id = db.escapeChar(req.body.id);
    const password = db.escapeChar(req.body.password);
    const newPassword = db.escapeChar(req.body.newPassword);

    // Get hash of old password
    const query = `SELECT password FROM users WHERE user_id = ${id}`;
    db.RunQuery(query).then((response) => {
        // Check if user has entered the correct password for the account
        const passwordMatch = bcrypt.compareSync(password, response[0].password);
        if (passwordMatch) {
            // Check if user tries to use the same password
            const samePassword = bcrypt.compareSync(newPassword, response[0].password);

            if (samePassword) {
                res.json({
                    status: 400,
                    message: 'User is using the same password'
                })
            } else {
                // Encrypt the password and save it in the database
                const salt = bcrypt.genSaltSync(10);
                const hashPassword = bcrypt.hashSync(newPassword, salt);
                const queryC = `UPDATE users SET password = '${hashPassword}' WHERE user_id = ${id}`;
                db.RunQuery(queryC).then(() => {
                    res.json({
                        status: 200,
                        message: 'Password updated'
                    })
                })
            }
        } else {
            // User password does not match the account password
            res.json({
                status: 401,
                message: 'Provided password does not match the account password'
            })
        }
    });
}