const nodemailer = require("nodemailer");

const sendEmail = async (options) => {

    if (!process.env.SMTP_HOST) {
        throw new Error("SMTP_HOST is not defined in environment variables");
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });


    const mailOptions = {
        from: `"Real Estate Support" <${process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };


    const info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;
