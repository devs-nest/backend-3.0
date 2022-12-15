const express = require("express");
const scheduler = require("node-cron"); // node-cron is an npm package to schedule cron jobs
const nodemailer = require("nodemailer"); // Nodemailer is an npm package for Node.js applications to allow easy as cake email sending.

const PORT = 1338;
const SMTP_PORT = 587;
const HOST_SERVICE = "smtp-relay.sendinblue.com";

//! Create a sendin blue account and enter the credentials
const USER_EMAIL = "";
const USER_PASSWORD = "";

//! You cannot use a temp mail id as your sender's email id as it does not have the functionality to send emails, it can only receive emails
const SENDERS_EMAIL = ""; // Change this to the sender's email id
const RECEIVERS_EMAIL = ""; // Change this to target email id
const CC = []; // Array of recipients email addresses that will appear on the Cc: field
const BCC = []; // Array of recipients email addresses that will appear on the Bcc: field
const EMAIL_SUBJECT = "What is Lorem Ipsum?";
const EMAIL_BODY_TEXT =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
const EMAIL_BODY_HTML =
  "<em>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.</em>";

const app = express();

const emailOptions = {
  from: SENDERS_EMAIL,
  to: RECEIVERS_EMAIL,
  cc: CC,
  bcc: BCC, //
  subject: EMAIL_SUBJECT,
  //   text: EMAIL_BODY_TEXT, //! You can either keep the email body in plaintext or in html, but you cannot use both at the same time
  html: EMAIL_BODY_HTML,
};

const transporter = nodemailer.createTransport({
  host: HOST_SERVICE,
  port: SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: USER_EMAIL,
    pass: USER_PASSWORD,
  },
});

//! Refer: https://crontab.guru/ to understand how cron syntax works
scheduler.schedule("* * * * *", async () => {
  console.log("Sending email");

  // Delivering mail with sendMail method
  transporter.sendMail(emailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
