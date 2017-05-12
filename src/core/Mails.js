/**
 * Created by jbmar on 11/05/2017.
 */

const nodemailer = require('nodemailer');
const fs = require('fs');

class Mails {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'jmarsal.matcha@gmail.com',
                pass: 'antoine&justine'
            }
        });
    }

    mailNewUser(email, login) {
        let contentMail = "";
        fs.readFile('src/core/mailTemplates/subscribeMail.html', (err,  data) => {
            if (err) {
                console.error(err);
            }
            contentMail = data;
            console.log(contentMail);
            return new Promise((resolve, reject) => {
                const mailOptions = {
                    from: '"Matcha" <foo@matcha.com>', // sender address
                    to: email, // list of receivers
                    subject: 'Bienvenue sur Matcha ' + login, // Subject line
                    html:  contentMail // html body
                };
                this.sendMail(mailOptions)
                    .then((message) => {
                        resolve(message);
                    }).catch((err) => {
                    reject(err);
                });
            });
        });
    }

    sendMail(mailOptions) {
        return new Promise((resolve, reject) => {
            // send mail with defined transport object
            this.transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    reject(err);
                } else {
                    resolve('Message %s sent: %s', info.messageId, info.response);
                }
            });
        });
    }
}
module.exports = Mails;