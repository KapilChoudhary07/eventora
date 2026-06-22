

const path = require("path");
const nodemailer = require("nodemailer");

require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});

const buildHtml = ({ title, message, otp }) => `
  <div style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
    <div style="max-width: 520px; margin: auto; background: #ffffff; padding: 25px; border-radius: 10px; text-align: center;">
      <h2 style="color: #111; margin-top: 0;">${title}</h2>
      <p style="color: #555; font-size: 15px;">${message}</p>
      ${
        otp
          ? `<div style="margin: 20px 0;">
              <span style="display: inline-block; font-size: 28px; letter-spacing: 6px; font-weight: bold; color: #2c3e50; background: #f1f1f1; padding: 10px 20px; border-radius: 8px;">${otp}</span>
            </div>
            <p style="color: #888; font-size: 13px;">This OTP is valid for 5 minutes.</p>`
          : ""
      }
      <hr style="margin: 20px 0;" />
      <p style="font-size: 12px; color: gray;">If you did not request this, please ignore this email.</p>
    </div>
  </div>
`;

const sendEmailJS = async ({ toEmail, subject, title, message, otp }) => {
  const requiredEnv = [
    "EMAILJS_SERVICE_ID",
    "EMAILJS_TEMPLATE_ID",
    "EMAILJS_PUBLIC_KEY",
    "EMAILJS_PRIVATE_KEY",
  ];
  const missingEnv = requiredEnv.filter((key) => !process.env[key]);

  if (missingEnv.length > 0) {
    throw new Error(`Missing email configuration: ${missingEnv.join(", ")}`);
  }

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      accessToken: process.env.EMAILJS_PRIVATE_KEY,
      template_params: {
        to_email: toEmail,
        subject,
        title,
        message,
        otp,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "EmailJS email failed");
  }
};

const sendSmtpEmail = async ({ toEmail, subject, title, message, otp }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Missing SMTP configuration: EMAIL_USER, EMAIL_PASS");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Eventora" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject,
    html: buildHtml({ title, message, otp }),
  });
};

const sendEmail = async (payload) => {
  try {
    await sendEmailJS(payload);
  } catch (emailJsError) {
    console.log("EmailJS failed, trying SMTP fallback:", emailJsError.message);
    try {
      await sendSmtpEmail(payload);
    } catch (smtpError) {
      throw new Error(
        `Email failed. EmailJS: ${emailJsError.message}. SMTP: ${smtpError.message}`
      );
    }
  }
};

const sendBookingEmail = async (userEmail, eventTitle, bookingId) => {
  try {
    await sendEmail({
      toEmail: userEmail,
      subject: `Booking Confirmed: ${eventTitle}`,
      title: "Booking Confirmed",
      message: `Your booking for ${eventTitle} is confirmed. Booking ID: ${bookingId}`,
      otp: "",
    });

    console.log("Booking email sent successfully to", userEmail);
  } catch (error) {
    console.log("Booking email error:", error.message);
    throw error;
  }
};

const sendOTPEmail = async (userEmail, otp, type) => {
  try {
    let title = "Confirm Your Event Booking";
    let message = "Please use the following OTP to confirm your event booking.";

    if (type === "account_verification") {
      title = "Verify your Eventora Account";
      message = "Please use the following OTP to verify your new Eventora account.";
    }

    if (type === "forgot_password") {
      title = "Reset your Eventora Password";
      message = "Please use the following OTP to reset your password.";
    }

    await sendEmail({
      toEmail: userEmail,
      subject: title,
      title,
      message,
      otp,
    });

    console.log(`OTP sent to ${userEmail} for ${type}`);
  } catch (error) {
    console.log(`OTP email error for ${userEmail} (${type}):`, error.message);
    throw error;
  }
};

module.exports = {
  sendBookingEmail,
  sendOTPEmail,
};
