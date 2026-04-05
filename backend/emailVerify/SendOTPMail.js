import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const sendOTPMail = async (otp, email) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const mailConfigurations = {
        //It should be a string of sender/server email
        from: process.env.MAIL_USER,

        to: email,

        subject: 'Email Verification OTP',

        html:`<p>Your OTP for email verification is: <b>${otp}</b>. This OTP is valid for 10 minutes.</p>`
    };

    transporter.sendMail(mailConfigurations, function(error, info){
        if(error) {
            console.error("Error sending email:", error);
            return;
        }
        console.log('OTP sent successfully');
        console.log(info);
    });
}

export const sendForgotPasswordOTP = async (otp, email) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const mailConfigurations = {
        //It should be a string of sender/server email
        from: process.env.MAIL_USER,

        to: email,

        subject: 'Email Verification OTP',

        html:`<p>Your OTP for password reset is: <b>${otp}</b>. This OTP is valid for 10 minutes.</p>`
    };

    transporter.sendMail(mailConfigurations, function(error, info){
        if(error) {
            console.error("Error sending email:", error);
            return;
        }
        console.log('OTP sent successfully');
        console.log(info);
    });
}