const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");

const authRouter = express.Router();

/* ================= SIGNUP ================= */
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password, photoUrl, skills } =
      req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      photoUrl,
      skills,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ================= LOGIN ================= */
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Generate JWT
    const token = user.getJWT();

    // ✅ FIXED COOKIE (VERY IMPORTANT)
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax", // localhost ke liye correct
      secure: false, // prod me true
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json(userResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= LOGOUT ================= */
authRouter.post("/logout", (req, res) => {
  // ✅ CLEAR COOKIE PROPERLY
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  res.json({ message: "Logout successful" });
});

module.exports = authRouter;
