
// this file contains details of sending verification mail
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport( smtpTransport({
  service: 'gmail',
  secure: false,
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'tutorry.in@gmail.com',
    pass: 'tutorry@123'
  }
}));

// this module so that it can be used anywhere in the app
// based on this we can send mail

module.exports = {
  sendEmail(from, to, subject, html) {
    return new Promise((resolve, reject) => {
      transporter.sendMail({ from, subject, to, html }, (err, info) => {
        if (err) reject(err);
        resolve(info);
      });
    });
  }
}
