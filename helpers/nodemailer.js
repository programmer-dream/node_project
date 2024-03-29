var nodemailer = require('nodemailer')
const config = require("../config/env.js");
async function mailer(email,subject,html) {
    console.log(' in nodemailer params ->>', email, ' -->> end <---');
    var transporter = nodemailer.createTransport({
        service: config.email_service,
        host: config.host,
        port: config.port,
        secure: false,
        tls: {
            rejectUnauthorized:false
        },
        auth: {
            user: config.email_user,
            pass: config.email_password
        }
    });

    let mailOptions = {
        from: config.senderEmail,
        to: email,
        subject: subject,
        html: html
    };

    console.log('created');
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err, ' this is error in nodemmailer');
        }
        if (info) {
            console.log(info, " this is info in nodemailer.")
        }
    })
}

module.exports = mailer;
