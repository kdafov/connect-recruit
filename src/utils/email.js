/**
 * This utility function will enable a future developer to 
 * add their SMTP / TLS mail server configuration so the 
 * platform sends emails from their MAIL server
 * 
 * Change transporter variable [LINE 20]
 * Change from & to label [LINE 33/34]
 */

import nodemailer from 'nodemailer';

const sendEmail = (subject, text, html) => {
    // Create a test email client using nodemailer
    nodemailer.createTestAccount((err, account) => {
        if (err) {
            console.error('Failed to create a testing account. \n' + err.message);
            return process.exit(1);
        }

        // Create SMTP tranporter object
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: account.user,
                pass: account.pass
            }
        });

        // Create message object
        let message = {
            from: 'Connect <connect@recruiter.com>',
            to: 'Recipient <recipient@domain.com>',
            subject,
            text,
            html
        };

        // Send message
        transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log('Error occurred when sending mail. \n' + err.message);
                console.log(err)
                console.log(info)
                return process.exit(1);
            }

            // Get URL Preview of the 
            console.log(nodemailer.getTestMessageUrl(info));
        });
    });
}

export default { sendEmail };   