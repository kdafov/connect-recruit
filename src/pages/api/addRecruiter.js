/**
 * Internal API used for adding a recruiter from
 * the admin of a company
 */

import db from "@/utils/db";
import bcrypt from 'bcryptjs';

export default function handler(req, res) {
    const companyId = db.escapeChar(req.body.companyId);
    const name = db.escapeChar(req.body.name);
    const email = db.escapeChar(req.body.email);
    const access = db.escapeChar(req.body.access) === 'limited' ? 0 : 1;

    const password = Array.from({length: 10}, () => String.fromCharCode(Math.floor(Math.random() * (126 - 33 + 1)) + 33)).join('');
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const insertQuery = `INSERT INTO users(name, email, password, access_level) VALUES('${name}', '${email}', '${hashedPassword}', 'COMPANY_ACCESS')`;
    db.RunQuery(insertQuery).then((insertResults) => {
        const newUserId = insertResults.insertId;
        const recruiterLinkQuery = `INSERT INTO company_staff(company_id, user_id, full_access) VALUES((SELECT id FROM company WHERE user_id = ${companyId}), ${newUserId}, ${access})`;
        db.RunQuery(recruiterLinkQuery).then(() => {
            res.json({
                status: 200,
                password,
                newUserId
            })
        })
    })
}