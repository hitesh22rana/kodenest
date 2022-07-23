const nodemailer = require("nodemailer");
const crypto = require('crypto');
const hashService = require('./hash-service');

class OtpService {
    async generateOtp() {
        const otp = crypto.randomInt(100000, 999999);
        return otp;
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
            from: 'Verify your email',
            to: `${email}`,
            subject: "Hello 😆",
            html: `
          <div
            class="container"
            style="max-width: 90%; margin: auto; padding-top: 20px"
          >
            <h2>KodeNest</h2>
            <h4>Welcome To KodeNest ✔</h4>
            <p style="margin-bottom: 30px;">Your OTP to get started🎉</p>
            <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${otp}</h1>
            <p style="margin-top:50px;">If you did not request for verification please ignore the mail.</p>
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