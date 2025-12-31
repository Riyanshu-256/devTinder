require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/database");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.options(/.*/, cors());

// app.use(
//   cors({
//     // list of frontend URLs that are allowed to make requests
//     origin: process.env.FRONTEND_URL
//       ? process.env.FRONTEND_URL.split(",")
//       : [
//           "http://localhost:5173",
//           "http://localhost:3000",
//           "http://localhost:5174",
//         ],
//     // allow cookies to be sent with requests - needed for authentication
//     credentials: true,
//     // which HTTP methods are allowed
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     // which headers can be sent
//     allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
//     // expose Set-Cookie header so frontend knows about cookies
//     exposedHeaders: ["Set-Cookie"],
//   })
// );

app.use(express.json());
app.use(cookieParser());

/* ================= ROUTES ================= */
app.use("/auth", authRouter); // ✅ VERY IMPORTANT
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);

/* ================= FALLBACK ================= */
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("DB connection failed", err);
  });
