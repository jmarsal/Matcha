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

    mailNewUser(dataUser) {
        return new Promise((resolve, reject) => {
            let contentMail = "",
                search = {
                    'titre': '^^title^^',
                    'login': '^^login^^',
                    'link': '^^link^^'
                },
                replace = {
                    'titre': "Bienvenue sur Matcha !",
                    'login': dataUser.login,
                    'link': "localhost:3000/login?log=" + encodeURIComponent(dataUser.login) + "&cle=" + encodeURIComponent(dataUser.cle)
                }
            ;
            fs.readFile('src/core/mailTemplates/subscribeMail.html', (err, data) => {
                if (err) {
                    reject(console.error(err));
                }
                contentMail = data.toString();
                const mailOptions = {
                    from: '"Matcha" <foo@matcha.com>', // sender address
                    to: dataUser.email, // list of receivers
                    subject: 'Bienvenue sur Matcha ' + dataUser.login, // Subject line
                    html: contentMail.replace(search.login, replace.login).replace(search.titre, replace.titre).replace(search.link, replace.link) // html body
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