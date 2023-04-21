/**
 * Internal API used for deleting a job from job listings
 */

import db from "@/utils/db";

export default function handler(req, res) {
    const id = db.escapeChar(req.body.id);
    console.log(req.params);

    db.RunQuery(`DELETE FROM supporting_docs WHERE application_id IN (SELECT id FROM applications WHERE job_id = ${id})`)
    .then(() => {
        db.RunQuery(`DELETE FROM saved_jobs WHERE job = ${id}`)
        .then(() => {
            db.RunQuery(`DELETE FROM messages WHERE job_id = ${id}`)
            .then(() => {
                db.RunQuery(`DELETE FROM applications WHERE job_id = ${id}`)
                .then(() => {
                    db.RunQuery(`DELETE FROM jobs WHERE id = ${id}`)
                    .then(() => {
                        res.json({
                            status: 200
                        });
                    });
                });
            });
        });
    });
}