/**
 * API for creating JWT Access and Refresh tokens for when the user is authenticated
 * Use cases: When the user logs in and when the user registers
 */

import AuthenticateUser from '@/utils/auth'
import jwtUtils from '@/utils/jwtTokens';

export default function handler(req, res) {
    if (req.method === 'POST') {
        // Get email and password from POST request
        const email = req.body.email;
        const password = req.body.password;

        // Verify inputs (check if exists in database)
        AuthenticateUser(email, password).then((response) => {
            if(response[0] === true) {
                // User authenticated successfully :. Generate tokens
                const accessToken = jwtUtils.createAccessToken(response[1].name, response[1].id, response[1].access);
                const refreshToken = jwtUtils.createRefreshToken(response[1].name, response[1].id, response[1].access);

                res.status(200).send({
                    requestStatus: true,
                    requestData: {
                        accessToken,
                        refreshToken,
                        route: ({'USER_ACCESS': '/user', 'COMPANY_ACCESS': '/company', 'ADMIN_ACCESS': '/admin', 'DEV_ACCESS': '/dev'})[response[1].access]
                    }
                })
            } else {
                res.status(200).send({
                    requestStatus: false,
                    requestData: null
                });
            }
        })

    } else {
        // API invocation failed (invalid method call)
        res.status(405).json({message: 'Invalid method for /api/auth'});
    }
}