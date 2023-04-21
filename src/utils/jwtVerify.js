/**
 * This utility function will allow other function to call it
 * when they want to verify the tokens of a user. If an invalid
 * access token is passed, but a valid refresh token is present,
 * a new access token will be returned. For invalid tokens or
 * exired token a no_access status will be returned.
 */

import jwt from 'jsonwebtoken'
import jwtUtils from '@/utils/jwtTokens';

export default function verifyToken(accessToken, refreshToken) {
    return new Promise(function(resolve, reject) {
        // Check if token content is invalid
        if (accessToken === undefined || accessToken === null || refreshToken === undefined || refreshToken === null) {
            resolve({
                status: 'invalid',
                data: {}
            });
        }

        // Check if access token is valid
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, jwtPayload) => {
            if (err) {
                // Token has expired :. Try to generate a new access token
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, jwtPayload) => {
                    if (err) {
                        // Both tokens have expired :. Request revalidation
                        resolve({
                            status: 'expired',
                            data: {}
                        });
                    } else {
                        // Refresh token valid :. Generating new access token
                        const newAccessToken = jwtUtils.createAccessToken(jwtPayload.name, jwtPayload.userId, jwtPayload.accessLevel);
                        resolve({
                            status: 'refreshed',
                            data: jwtPayload,
                            newToken: newAccessToken
                        })
                    }
                });
            } else {
                // Token valid
                resolve({
                    status: 'valid',
                    data: jwtPayload
                });
            }
        });
    });
}

