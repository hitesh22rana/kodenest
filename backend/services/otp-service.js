const nodemailer = require("nodemailer");
const crypto = require('crypto');
const hashService = require('./hash-service');

class OtpService {
    async generateOtp() {
        const otp = crypto.randomInt(100000, 999999);
        return otp;
    }

    async generateSecretToken() {
        const specialSymbols = ['@', '#', '$', '*'];
        const randomInt = crypto.randomInt(100000, 999999).toString()

        const randomPrefix = specialSymbols[Math.floor(Math.random() * specialSymbols.length)]
        const randomIndex = Math.floor(Math.random() * 4) + 1
        const randomSuffix = specialSymbols[Math.floor(Math.random() * specialSymbols.length)]
        const token = randomPrefix + randomInt.substring(0, randomIndex) + randomSuffix + randomInt.substring(randomIndex)

        return token
    }

    sendByEmail(email, otp) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const mailOptions = {
            from: 'KodeNest 😆',
            to: `${email}`,
            subject: "Account Verification",
            html: `
          <div
            class="container"
            style="max-width: 90%; margin: auto; padding-top: 20px"
          >
            <h2>Welcome To KodeNest ✔</h2>
            <h4 style="margin-bottom: 30px;">Your OTP to get started🎉</h4>
            <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${otp}</h1>
            <h4 style="margin-top:50px;">If you did not request for verification please ignore this mail.</h4>
          </div>
        `,
        }

        return transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
            } else {
            }
        });
    }

    sendResetPasswordByEmail(email, link) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const mailOptions = {
            from: 'Kodenest 😆',
            to: `${email}`,
            subject: "Account Activation Link",
            html: `
          <div
            class="container"
            style="max-width: 90%; margin: auto; padding-top: 20px"
          >
            <p style="margin-bottom: 30px;">Please click on the given link to activate your account🎉</p>
            <a href="${link}" target="_blank" style="font-size: 40px; letter-spacing: 2px; text-align:center; color: blue;">Reset Password</a>
            <p style="margin-top:50px;">If you did not request for account activation please ignore this mail.</p>
          </div>
        `,
        }

        return transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
            } else {
            }
        });
    }

    verifyOtp(hashedOtp, data) {
        let hashGenerated = hashService.hashOtp(data);
        return hashGenerated === hashedOtp;
    }
}

module.exports = new OtpService();