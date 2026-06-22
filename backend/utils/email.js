

const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});

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

const sendBookingEmail = async (userEmail, eventTitle, bookingId) => {
  try {
    await sendEmailJS({
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

    await sendEmailJS({
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
