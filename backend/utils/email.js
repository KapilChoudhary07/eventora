



// const nodemailer = require("nodemailer");
// require("dotenv").config();

// if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
//   console.warn("EMAIL_USER or EMAIL_PASS is missing in .env");
// }

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   }, connectionTimeout: 25000,
//   greetingTimeout: 25000,
//   socketTimeout: 25000,
// });

// const sendBookingEmail = async (userEmail, userName, eventTitle) => {
//   try {
//     const mailOptions = {
//       from: `"Eventora" <${process.env.EMAIL_USER}>`,
//       to: userEmail,
//       subject: `Booking Confirmed: ${eventTitle}`,
//       html: `
//         <h2>Hi ${userName}!</h2>
//         <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
//         <p>Thank you for choosing Eventora.</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("Booking email sent successfully to", userEmail);
//   } catch (error) {
//     console.log("Booking email error:", error.message);
//     throw error;
//   }
// };

// const sendOTPEmail = async (userEmail, otp, type) => {
//   try {

//     let title = "Confirm Your Event Booking";
// let msg = "Please use the following OTP to confirm your event booking.";

// if (type === "account_verification") {
//   title = "Verify your Eventora Account";
//   msg = "Please use the following OTP to verify your new Eventora account.";
// }

// if (type === "forgot_password") {
//   title = "Reset your Eventora Password";
//   msg = "Please use the following OTP to reset your password.";
// }
//     const mailOptions = {
//       from: `"Eventora" <${process.env.EMAIL_USER}>`,
//       to: userEmail,
//       subject: title,
//       html: `
//         <div style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
//           <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 25px; border-radius: 10px; text-align: center;">
//             <h2 style="color: #111;">${title}</h2>

//             <p style="color: #555; font-size: 15px;">
//               ${msg}
//             </p>

//             <div style="margin: 20px 0;">
//               <span style="
//                 display: inline-block;
//                 font-size: 28px;
//                 letter-spacing: 6px;
//                 font-weight: bold;
//                 color: #2c3e50;
//                 background: #f1f1f1;
//                 padding: 10px 20px;
//                 border-radius: 8px;
//               ">
//                 ${otp}
//               </span>
//             </div>

//             <p style="color: #888; font-size: 13px;">
//               This OTP is valid for 5 minutes.
//             </p>

//             <hr style="margin: 20px 0;" />

//             <p style="font-size: 12px; color: gray;">
//               If you did not request this, please ignore this email.
//             </p>
//           </div>
//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`OTP sent to ${userEmail} for ${type}`);
//   } catch (error) {
//     console.log(`OTP email error for ${userEmail} (${type}):`, error.message);
//     throw error;
//   }
// };

// module.exports = {
//   sendBookingEmail,
//   sendOTPEmail,
// };

const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});(__dirname, "../.env"),

const sendEmailJS = async ({ toEmail, subject, title, message, otp }) => {
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

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
  try {
    await sendEmailJS({
      toEmail: userEmail,
      subject: `Booking Confirmed: ${eventTitle}`,
      title: "Booking Confirmed",
      message: `Hi ${userName}, your booking for ${eventTitle} is successfully confirmed.`,
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