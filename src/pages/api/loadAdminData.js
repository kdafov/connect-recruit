/**
 * Internal API used for loading data for the recruiter's page
 */

import db from "@/utils/db";

export default function handler(req, res) {
    const id = req.body.id;

    const query = `SELECT c.logo_url, c.company_description, c.notifications, c.direct_messages, u.name, u.email, u.requires_setup FROM company c JOIN users u ON c.user_id = u.user_id WHERE c.user_id = ${id}`;

    db.RunQuery(query).then((data) => {
        const recruitersInfoQuery = `SELECT users.user_id, users.name, company_staff.full_access FROM users JOIN company_staff ON users.user_id = company_staff.user_id JOIN company ON company.id = company_staff.company_id WHERE company.user_id = ${id}`;

        db.RunQuery(recruitersInfoQuery).then((recruitersInfoData) => {
            res.json({...data[0], recruiters: recruitersInfoData});
        });
    });
}