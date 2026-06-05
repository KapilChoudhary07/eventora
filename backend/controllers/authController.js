
const User = require("../models/User");
const OTP = require("../models/OTP");
const bcrypt = require("bcryptjs");
const { sendOTPEmail } = require("../utils/email");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPWithTimeout = (email, otp, type) => {
  return Promise.race([
    sendOTPEmail(email, otp, type),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("OTP email timeout. Please try again.")),
        25000
      )
    ),
  ]);
};

// REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });

    if (userExists && userExists.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (userExists && !userExists.isVerified) {
      await User.deleteOne({ email });
      await OTP.deleteMany({ email, action: "account_verification" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      isVerified: false,
    });

    await OTP.create({
      email,
      otp,
      action: "account_verification",
    });

   
    await sendOTPWithTimeout(email, otp, "account_verification");
    res.status(201).json({
      message: "User registered. Check email for OTP",
      email,
    });
  } catch (error) {
    await User.deleteOne({ email: req.body.email, isVerified: false });
    await OTP.deleteMany({
      email: req.body.email,
      action: "account_verification",
    });

    res.status(500).json({
      error: "Failed to send OTP. Please check email configuration.",
      details: error.message,
    });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified && user.role === "user") {
      const otp = generateOtp();

      await OTP.deleteMany({ email, action: "account_verification" });

      await OTP.create({
        email,
        otp,
        action: "account_verification",
      });

   await sendOTPWithTimeout(email, otp, "account_verification");

      return res.status(400).json({
        message: "Account not verified. New OTP sent to email",
      });
    }

    res.json({
      message: "Login successful",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({
      error: "Login failed",
      details: error.message,
    });
  }
};

// VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await OTP.findOne({
      email,
      otp,
      action: "account_verification",
    });

    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await OTP.deleteMany({ email, action: "account_verification" });

    res.json({
      message: "Account verified successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({
      error: "OTP verification failed",
      details: error.message,
    });
  }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.deleteMany({ email, action: "forgot_password" });

    await OTP.create({
      email,
      otp,
      action: "forgot_password",
    });

    await sendOTPWithTimeout(email, otp, "forgot_password");

    res.json({
      message: "OTP sent to your email",
      email,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to send reset OTP",
      details: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const otpRecord = await OTP.findOne({
      email,
      otp,
      action: "forgot_password",
    });

    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await OTP.deleteMany({ email, action: "forgot_password" });

    res.json({
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Password reset failed",
      details: error.message,
    });
  }
};