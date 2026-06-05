// const dotenv = require("dotenv");
// dotenv.config();
// const cors = require("cors");
// const express = require("express");
// const mongoose = require("mongoose");
// const authRoutes = require("./routes/auth.js")
// const eventRoutes = require("./routes/event.js");
// const bookingRoutes = require("./routes/booking.js");



// const app = express();
// app.use(cors());
// app.use(express.json());



// app.use("/api/auth", authRoutes);
// app.use("/api/events", eventRoutes);
// app.use("/api/bookings", bookingRoutes);





// // ✅ DB Connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB Connected ✅");
//   })
//   .catch((err) => {
//     console.error("Error:", err.message);
//     process.exit(1);
//   });

// // ✅ Server Start
// app.get("/", (req,res) => {
//     res.send("Running")
// })
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server Running on port ${PORT} 🚀`);
// });

require("dotenv").config(); // ← PEHLI LINE

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth.js");
const eventRoutes = require("./routes/event.js");
const bookingRoutes = require("./routes/booking.js");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => res.send("Running"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => { console.error("MongoDB Error:", err.message); process.exit(1); });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Running on port ${PORT} 🚀`));