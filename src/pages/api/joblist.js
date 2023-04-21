/***
 * This is the official API for external use provided by "Connect"
 * Documentation of this API is available at: /demo at the API section
 * 
 * Validating the request method, the api key used, the parameters
 * passed and their values, and the body.
 * 
 * Returns a JSON object containing list of jobs with attributes
 * such as name, job title, etc. Full JSON response object available
 * at /demo at the API section (bottom of the page).
 */

import db from "@/utils/db";

export default function handler(req, res) {
    // Check method of request
    if (req.method && req.method === 'POST') {
        // Check headers
        if (req.headers && (req.headers['x-api-key'] || req.headers['X-API-KEY'])) {
            // Check if API key is valid
            const apiKey = req.headers['x-api-key'] || req.headers['X-API-KEY'];
            db.RunQuery(`SELECT 0 FROM devaccess WHERE access_key = '${apiKey}'`)
            .then((response) => {
                if (response.length > 0) {
                    // Check if body is valid
                    const authorizedParams = new Set(['company', 'role', 'location']);
                    const unauthorizedParams = Object.keys(req.body).filter(param => !authorizedParams.has(param));
                    if (unauthorizedParams.length > 0) {
                        res.json({
                            status: 400,
                            data: `Request contains unauthorized parameters: ${unauthorizedParams.join(', ')}`
                        });
                    } else {
                        // Request is valid and API key is valid :. return data
                        const { company, role, location } = req.body;
                        const whereClauses = [];

                        // Check body
                        if (company) {
                            whereClauses.push(`company_id = '${company}'`);
                        }
                        if (role) {
                            whereClauses.push(`title = '${role}'`);
                        }
                        if (location) {
                            whereClauses.push(`location = '${location}'`);
                        }

                        // Construct query
                        let query = `SELECT (SELECT name FROM users WHERE user_id = (SELECT user_id FROM company WHERE id = jobs.company_id)) AS company, title AS job, job_type AS type, job_level AS level, mode, location, salary, description, requirements, benefits, add_info AS more_info, date_posted, expiring, CASE WHEN expiring = 1 THEN exp_date ELSE '' END AS exp_date, views, applications FROM jobs`

                        // Append the WHERE clauses (if any)
                        if (whereClauses.length > 0) {
                            query += ` WHERE ${whereClauses.join(' AND ')}`;
                        }

                        // Execute query and return results
                        db.RunQuery(query).then((results) => {
                            res.json({
                                status: 200,
                                data: results,
                                timestamp: new Date()
                            });
                        });
                    }
                } else {
                    res.json({
                        status: 401,
                        data: 'API Key invalid or unathorized'
                    });
                }
            });
        } else {
            res.json({
                status: 400,
                data: 'Missing or invalid headers'
            });
        }
    } else {
        res.json({
            status: 405,
            data: 'Invalid method of request (use POST)'
        });
    }
}