/**
 * Internal API used for updating the details of a company
 */

import db from "@/utils/db";

export default function handler(req, res) {
    const id = db.escapeChar(req.body.id);
    const mode = db.escapeChar(req.body.mode);

    if (mode === 'u-company-details' || mode === 'fill-company-details') {
        // Update the 'Company Details' section of the profile settings
        const name = db.escapeChar(req.body.name);
        const email = db.escapeChar(req.body.email);
        const logoURL = db.escapeChar(req.body.logoURL);
        const description = db.escapeChar(req.body.description);
        let query;

        if (mode === 'u-company-details') {
            // Company details are updated
            query = `UPDATE company, users SET company.logo_url = '${logoURL}', company.company_description = '${description}', users.name = '${name}', users.email = '${email}' WHERE company.user_id = ${id} AND users.user_id = ${id}`;
        } else if (mode === 'fill-company-details') {
            // Company details just after registration
            query = `UPDATE company, users SET company.logo_url = '${logoURL}', company.company_description = '${description}', users.name = '${name}', users.email = '${email}', users.requires_setup = 0 WHERE company.user_id = ${id} AND users.user_id = ${id}`;
        }

        // Execute the query
        db.RunQuery(query).then(() => {
            res.json({status: 200, data: null})
        })
    }
}