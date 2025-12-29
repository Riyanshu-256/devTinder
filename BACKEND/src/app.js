// require("dotenv").config();

// const express = require("express");
// const connectDB = require("./config/database");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");

// const app = express();

// /* ================= MIDDLEWARE ================= */
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// app.use((req, res, next) => {
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });

// app.use(express.json());
// app.use(cookieParser());

// /* ================= ROUTES ================= */
// const authRouter = require("./routes/auth");
// const profileRouter = require("./routes/profile");
// const requestRouter = require("./routes/request");
// const userRouter = require("./routes/user");

// app.use("/", authRouter);
// app.use("/", profileRouter);
// app.use("/request", requestRouter);
// app.use("/", userRouter);

// /* ================= SERVER ================= */
// const PORT = process.env.PORT || 3000;

// connectDB()
//   .then(() => {
//     console.log("Database connection established");
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   })
//   .catch(console.error);

// require("dotenv").config();

// const express = require("express");
// const cookieParser = require("cookie-parser");

// const connectDB = require("./config/database");

// const authRouter = require("./routes/auth");
// const profileRouter = require("./routes/profile");
// const requestRouter = require("./routes/request");
// const userRouter = require("./routes/user");

// const app = express();

// /* ================= MIDDLEWARE ================= */

// app.use(express.json());
// app.use(cookieParser());

// // 🔥 MANUAL CORS (FIXES PATCH 100%)
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET,POST,PUT,PATCH,DELETE,OPTIONS"
//   );
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

//   if (req.method === "OPTIONS") {
//     return res.sendStatus(204);
//   }

//   next();
// });

// /* ================= ROUTES ================= */

// app.use("/", authRouter);
// app.use("/", profileRouter);
// app.use("/request", requestRouter);
// app.use("/", userRouter);

// /* ================= SERVER ================= */

// const PORT = process.env.PORT || 3000;

// connectDB().then(() => {
//   console.log("Database connection established");
//   app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
//   });
// });

require("dotenv").config();

const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

const app = express();

/* ================= MANUAL CORS (TOP MOST) ================= */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

/* ================= BODY + COOKIE ================= */
app.use(express.json());
app.use(cookieParser());

/* ================= ROUTES ================= */
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/request", requestRouter);
app.use("/", userRouter);

/* ================= SERVER ================= */
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    console.log("✅ Database connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
  });
