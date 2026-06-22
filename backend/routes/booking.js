const express = require("express");
const router = express.Router();

const {
  bookEvent,
  sendBookingOtp,
  confirmBooking,
  cancelBooking,
  getAllBookings,
  getMyBookings,
} = require("../controllers/bookingController");

const { protect, admin } = require("../middleware/auth");

// 🎟️ Step 1: book event (create pending booking)
router.post("/", protect, bookEvent);

// 📩 Step 2: send OTP for booking
router.post("/send-otp", protect, sendBookingOtp);


router.get("/my", protect, getMyBookings);


router.get("/all", protect, admin, getAllBookings);

// ✅ Step 3: confirm booking with OTP
router.post("/confirm/:id", protect, admin, confirmBooking);

// ❌ Cancel booking
router.put("/:id", protect, cancelBooking);


module.exports = router;
