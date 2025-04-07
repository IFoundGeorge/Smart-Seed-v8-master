require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Endpoint to handle password reset request
app.post("/request-password-reset", (req, res) => {
  const { email } = req.body;

  // Here, you'd typically verify the email exists in your database

  // Generate a random 6-digit verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000);

  // Store the verification code in your database associated with the user

  // Email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Verification Code",
    text: `Your verification code is: ${verificationCode}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent:", info.response);
      res.status(200).send("Verification code sent");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
