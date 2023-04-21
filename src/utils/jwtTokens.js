/**
 * Utility function that returns a method
 * to create an access and refresh token
 * for any user.
 */

import jwt from 'jsonwebtoken'

const createAccessToken = (name, userId, accessLevel) => {
    const jwtPayload = {
        name,
        userId,
        accessLevel
    }
    const accessToken = jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '20s'});
    return accessToken;
}

const createRefreshToken = (name, userId, accessLevel) => {
    const jwtPayload = {
        name,
        userId,
        accessLevel
    }
    const refreshToken = jwt.sign(jwtPayload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '60m'});
    return refreshToken;
}

export default { createAccessToken, createRefreshToken };