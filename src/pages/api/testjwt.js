/**
 * Internal API used for testing and validating
 * the user's JWT tokens. Returns appropriate
 * status code and data which is either new
 * token if revalidation is required, or error
 * message message if token is invalid.
 */

import jwt_verifier from '@/utils/jwtVerify';

export default function handler(req, res) {
  jwt_verifier(req, res, async () => {
    const dataToReturnFromAPI = 'some data'
    res.json({
      status: 200,
      data: dataToReturnFromAPI
    })
  })
}