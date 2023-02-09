import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
    /*
        1.Enable less secure apps - https://www.google.com/settings/security/lesssecureapps
        2.Disable Captcha temporarily so you can connect the new device/server - https://accounts.google.com/b/0/displayunlockcaptcha
    */
    const transporter =  nodemailer.createTransport({ 
        // config mail server
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const mailOptions = { 
        // thiết lập đối tượng, nội dung gửi mail
        from: process.env.SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions);
}