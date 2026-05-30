


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

// ✅ REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      isVerified: false,
    });

    // OTP generate
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.create({ email, otp, action: "account_verification" });

     sendOTPEmail(email, otp, "account_verification");

    res.status(201).json({
      message: "User registered. Check email for OTP",
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ LOGIN
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

    // 🔥 verify check
    if (!user.isVerified && user.role === "user") {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await OTP.deleteMany({ email, action: "account_verification" });

      await OTP.create({ email, otp, action: "account_verification" });

      sendOTPEmail(email, otp, "account_verification");

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
    res.status(500).json({ error: error.message });
  }
};

// ✅ VERIFY OTP
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
    res.status(500).json({ error: error.message });
  }
};