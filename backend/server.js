const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth.js")
const eventRoutes = require("./routes/event.js");
const bookingRoutes = require("./routes/booking.js");

dotenv.config();

const app = express();
app.use(cors({
  origin: "https://eventora-86gt.vercel.app",
  credentials: true
}));
app.use(express.json());



app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);





// ✅ DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");
  })
  .catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
  });

// ✅ Server Start
app.get("/", (req,res) => {
    res.send("Running")
})
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT} 🚀`);
});