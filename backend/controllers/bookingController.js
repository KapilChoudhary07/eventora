const Booking = require("../models/Booking");
const OTP = require("../models/OTP");
const { sendOTPEmail, sendBookingEmail } = require("../utils/email");
const Event = require("../models/Event");
const User = require("../models/User");

// 🔥 OTP generator
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};



// ================= SEND BOOKING OTP =================
exports.sendBookingOtp = async (req, res) => {
  try {
    const otp = generateOtp();

    await OTP.deleteMany({
      email: req.user.email,
      action: "event_booking",
    });

    await OTP.create({
      email: req.user.email,
      otp,
      action: "event_booking",
    });

    await sendOTPEmail(req.user.email, otp, "event_booking");

    res.json({ message: "OTP sent to email" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ================= BOOK EVENT =================
exports.bookEvent = async (req, res) => {
  try {
    const { eventId, otp } = req.body;

    // OTP verify
    const otpRecord = await OTP.findOne({
      email: req.user.email,
      otp,
      action: "event_booking",
    });

    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // find event
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (event.availableSeats <= 0) {
      return res.status(400).json({ error: "No seats available" });
    }

    // check duplicate booking
    const existingBooking = await Booking.findOne({
      userId: req.user._id,
      eventId,
      status: { $ne: "cancelled" },
    });

    if (existingBooking) {
      return res.status(400).json({
        error: "You have already booked this event",
      });
    }

    // create booking
    const booking = await Booking.create({
      userId: req.user._id,
      eventId,
      status: "pending",
      paymentStatus: "non_paid",
      amount: event.ticketPrice,
    });

    // delete OTP
    await OTP.deleteMany({
      email: req.user.email,
      action: "event_booking",
    });

    sendBookingEmail(req.user.email, event.title, booking._id).catch((error) => {
      console.log("Booking request email failed:", error.message);
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};



// ================= CONFIRM BOOKING =================
exports.confirmBooking = async (req, res) => {
  try {
    const paymentStatus = req.body.paymentStatus || "paid";

    if (!["paid", "non_paid"].includes(paymentStatus)) {
      return res.status(400).json({ error: "Invalid payment status" });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.status === "confirmed") {
      return res.status(400).json({ error: "Booking already confirmed" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ error: "Cancelled booking cannot be confirmed" });
    }

    const event = await Event.findById(booking.eventId);

    if (!event || event.availableSeats <= 0) {
      return res.status(400).json({ error: "No seats available" });
    }

    // confirm booking
    booking.status = "confirmed";
    booking.paymentStatus = paymentStatus;
    await booking.save();

    // reduce seats
    event.availableSeats -= 1;
    await event.save();

    // 🔥 get user email safely
    const user = await User.findById(booking.userId);
    if (user) {
      sendBookingEmail(user.email, event.title, booking._id).catch((error) => {
        console.log("Booking confirmation email failed:", error.message);
      });
    }

    res.json({
      message: "Booking confirmed successfully",
      booking,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};



// ================= GET MY BOOKINGS =================
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user._id,
    }).populate("eventId");

    res.json({
      total: bookings.length,
      bookings,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("eventId");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= CANCEL BOOKING =================
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const isOwner = booking.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ error: "Booking already cancelled" });
    }

    // restore seat if confirmed
    if (booking.status === "confirmed") {
      const event = await Event.findById(booking.eventId);

      if (event) {
        event.availableSeats += 1;
        await event.save();
      }
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({
      message: "Booking cancelled successfully",
      booking,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

