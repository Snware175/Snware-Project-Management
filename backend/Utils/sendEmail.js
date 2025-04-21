const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  // Use environment variables in production
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail
      pass: process.env.EMAIL_PASS, // App password (not your Gmail password)
    },
  });

  const mailOptions = {
    from: `"Snware Project" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
