// const nodemailer = require("nodemailer");
// const dotenv = require("dotenv");
// dotenv.config();

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const sendBookingEmail = async (userEmail, userName, eventTitle) => {
//   try {
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: userEmail,
//       subject: `Booking Confirmed: ${eventTitle}`,
//       html: `
//         <h2>Hi ${userName}!</h2>
//         <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
//         <p>Thank you for choosing Eventora.</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("Email sent successfully to", userEmail);

//   } catch (error) {
//     console.log("Email error:", error.message);
//   }
// };


// const sendOTPEmail = async (userEmail, otp, type) => {
//   try {
  
//     const title =
//       type === "account_verification"
//         ? "Verify your Eventora Account"
//         : "Confirm Your Event Booking";

//     const msg =
//       type === "account_verification"
//         ? "Please use the following OTP to verify your new Eventora account."
//         : "Please use the following OTP to confirm your event booking.";

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
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

//     console.log(`✅ OTP sent to ${userEmail} for ${type}`);
//   } catch (error) {
//     console.log(`❌ OTP email error for ${userEmail} (${type}): ${error.message}`);
//   }
// };

// module.exports = {sendBookingEmail , sendOTPEmail};



const nodemailer = require("nodemailer");
require("dotenv").config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn("EMAIL_USER or EMAIL_PASS is missing in .env");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
  try {
    const mailOptions = {
      from: `"Eventora" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Booking Confirmed: ${eventTitle}`,
      html: `
        <h2>Hi ${userName}!</h2>
        <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
        <p>Thank you for choosing Eventora.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Booking email sent successfully to", userEmail);
  } catch (error) {
    console.log("Booking email error:", error.message);
    throw error;
  }
};

const sendOTPEmail = async (userEmail, otp, type) => {
  try {
    // const title =
    //   type === "account_verification"
    //     ? "Verify your Eventora Account"
    //     : "Confirm Your Event Booking";

    // const msg =
    //   type === "account_verification"
    //     ? "Please use the following OTP to verify your new Eventora account."
    //     : "Please use the following OTP to confirm your event booking.";

    let title = "Confirm Your Event Booking";
let msg = "Please use the following OTP to confirm your event booking.";

if (type === "account_verification") {
  title = "Verify your Eventora Account";
  msg = "Please use the following OTP to verify your new Eventora account.";
}

if (type === "forgot_password") {
  title = "Reset your Eventora Password";
  msg = "Please use the following OTP to reset your password.";
}
    const mailOptions = {
      from: `"Eventora" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: title,
      html: `
        <div style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
          <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 25px; border-radius: 10px; text-align: center;">
            <h2 style="color: #111;">${title}</h2>

            <p style="color: #555; font-size: 15px;">
              ${msg}
            </p>

            <div style="margin: 20px 0;">
              <span style="
                display: inline-block;
                font-size: 28px;
                letter-spacing: 6px;
                font-weight: bold;
                color: #2c3e50;
                background: #f1f1f1;
                padding: 10px 20px;
                border-radius: 8px;
              ">
                ${otp}
              </span>
            </div>

            <p style="color: #888; font-size: 13px;">
              This OTP is valid for 5 minutes.
            </p>

            <hr style="margin: 20px 0;" />

            <p style="font-size: 12px; color: gray;">
              If you did not request this, please ignore this email.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
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