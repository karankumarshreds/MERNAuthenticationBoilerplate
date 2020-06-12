const nodemailer = require('nodemailer');

const passwordResetEmail = (email, token) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    let mailOptions = {
        from: 'NoReply-HUNGERBOX@gmail.com',
        to: email,
        subject: 'Password reset for HungerBox',
        text: `Click this link to reset your password http://localhost:3000/password-reset/${token}`
    };
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            return log('Error occurs');
        }
        return log('Email sent!!!');
    });
};

module.exports = passwordResetEmail;

