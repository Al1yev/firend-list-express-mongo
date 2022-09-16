const nodemailer = require("nodemailer");
require("dotenv").config({ path: "../.env" });

class Email {
  constructor(user) {
    this.to = user.email;
    this.from = `Anvar Aliyev <${process.env.EMAIL_FROM}>`;
    this.name = user.name;
  }

  // 1. Transporter create
  transporter() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  // 2. Email options
  async sendMessage(title) {
    // 1. Get template and render it
    const html = "<h1>Helloo</h1>";
    // 2. Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      title,
      html: html,
    };

    // 3. Create transport and send email
    await this.transporter().sendMail(mailOptions);
  }
  sending = () => this.sendMessage("Salomlar");
}

module.exports = Email;
