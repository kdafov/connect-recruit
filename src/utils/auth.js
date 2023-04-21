/**
 * Authenticates the user by checking if credentials exist in the database
 * and if so, returns the Id, name and access level of the user
 */

import db from '@/utils/db';
import bcrypt from 'bcryptjs';

export default function AuthenticateUser(email, password) {
    return new Promise((resolve, reject) => {
        // Check if inputs are empty
        if (email === null || email === undefined || email.length === 0 || password === null || password === undefined || password.length === 0) {
            resolve([false, 'Invalid inputs']);
        };

        // Check if credentials exist in the database
        let query = `SELECT user_id AS id, name, password, access_level AS access FROM users WHERE email = '${db.escapeChar(email)}'`;
        db.RunQuery(query).then((response) => {
            if (response.length > 0) {
                // Validate password
                const passTest = bcrypt.compareSync(db.escapeChar(password), response[0].password);
                if (passTest) {
                    // User exists and password matches
                    resolve([true, {
                        id: response[0].id,
                        name: response[0].name,
                        access: response[0].access
                    }]);
                } else {
                    resolve([false, 'Password does not match']);
                }
            } else {
                resolve([false, 'Email not found in database']);
            }
        });
    });
}