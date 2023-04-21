/**
 * Internal API used to complete the register of a user
 */

import db from "@/utils/db";
import jwtUtils from '@/utils/jwtTokens';
import bcrypt from 'bcryptjs';

export default function handler(req, res) {
    if (req.method === 'PUT') {
        // Get parameters from request
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const access = req.body.access;

        // Encrypt password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(db.escapeChar(password), salt);

        // Add registration into the database
        const query = `INSERT INTO users(name, email, password, access_level) VALUES('${db.escapeChar(name)}', '${db.escapeChar(email)}', '${hashPassword}', '${db.escapeChar(access)}')`;
        db.RunQuery(query).then((data) => {
            // Get userID from database
            const query_id = `SELECT user_id FROM users WHERE email = '${db.escapeChar(email)}'`;
            db.RunQuery(query_id).then((data) => {
                // Generate access and refresh tokens
                const accessToken = jwtUtils.createAccessToken(name, data[0].user_id, access);
                const refreshToken = jwtUtils.createRefreshToken(name, data[0].user_id, access);

                // Check if registration is for company :. Add info to the company table (db)
                if (access === 'ADMIN_ACCESS') {
                    const company_query = `INSERT INTO company(user_id) VALUES(${data[0].user_id})`;
                    db.RunQuery(company_query).then(() => {
                        res.status(200).json({ 
                            accessToken,
                            refreshToken
                        });
                    })
                } else {
                    res.status(200).json({ 
                        accessToken,
                        refreshToken
                    });
                }
            });
        });
    } else {
        // API invocation failed (invalid method call)
        res.status(405).json({message: 'Invalid method for /api/auth'});
    }
}