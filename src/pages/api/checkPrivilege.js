/**
 * This function will be called when a protected page is rendered
 * to ensure that the user has access to view the page and has
 * valid unexpired tokens (access and refresh tokens)
 */

import jwtVerifier from '@/utils/jwtVerify';
import db from '@/utils/db';

export default function handler(req, res) {
    const accessToken = req.body.accessToken;
    const refreshToken = req.body.refreshToken;
    const accessRoute = req.body.access;
    const access = ({'/user': 'USER_ACCESS', '/company': 'COMPANY_ACCESS', '/admin': 'ADMIN_ACCESS', '/dev': 'DEV_ACCESS'})[accessRoute];

    // Check if tokens are valid
    jwtVerifier(accessToken, refreshToken).then((response) => {
        if (response.status === 'invalid' || response.status === 'expired') {
            // Access token or Refresh token is null, undefined or expired
            res.status(200).json({
                action: 'revalidate'
            });
        } else if (response.status === 'valid' || response.status === 'refreshed') {
            // Valid tokens -> Check if user has permission to view page
            const user_id = response.data.userId;
            const query = `SELECT access_level AS access, requires_setup FROM users WHERE user_id = ${db.escapeChar(user_id)}`;
            db.RunQuery(query).then((db_response) => {
                if (db_response.length === 0) {
                    // No access found in the database
                    res.status(200).json({
                        action: 'revalidate'
                    });
                } else {
                    // Compare if the access in database matches the access of user
                    if (access === db_response[0].access) {
                        // User has access
                        res.status(200).json({
                            action: 'valid',
                            updatedTokens: response.status === 'refreshed' ? response.newToken : null,
                            payload: response.data,
                            accountStatus: db_response[0].requires_setup
                        });
                    } else {
                        // User does not have access
                        res.status(200).json({
                            action: 'revalidate'
                        });
                    }
                }
            })
        }
    })
}