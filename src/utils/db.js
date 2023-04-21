 /**
 * This is the standard db utility function
 * used to make queries to the database
 * and return their status and data.
 * Includes escapeChar function that prevents
 * SQL injection by filtering out input.
 */

import mysql from "mysql";

function RunQuery(query, callback) {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });

    return new Promise((resolve, reject) => {
        connection.query(query, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
            connection.end();
        });
    });
}

function escapeChar(input) {
    const entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    }
    
    return String(input).replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s]
    });
}

export default { RunQuery, escapeChar };