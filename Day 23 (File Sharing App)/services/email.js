const mailer = require("nodemailer");
const HOST = process.env.SMTP_HOST_URL;
const PORT = process.env.SMTP_PORT;
const USER = process.env.MAIL_USER;
const PASSWORD = process.env.MAIL_PASSWORD;

const sendEmail = async ({ from, to, subject, text, html }) => {
  let transporter = mailer.createTransport({
    host: HOST,
    port: PORT,
    secure: false,
    auth: {
      user: USER,
      pass: PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: `ShareEazy <${from}>`,
    to: to,
    subject: subject,
    text: text,
    html: html,
  });
};

module.exports = sendEmail;