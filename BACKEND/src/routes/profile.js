const express = require("express");
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();

/* ===============================
   VIEW PROFILE
   GET /profile/view
================================ */
profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const userResponse = req.user.toObject();
    delete userResponse.password;
    res.json(userResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   EDIT PROFILE
   PATCH /profile/edit
================================ */
profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req.body)) {
      return res.status(400).json({ message: "Invalid fields in request" });
    }

    if (req.body.emailId && req.body.emailId !== req.user.emailId) {
      const existingUser = await User.findOne({ emailId: req.body.emailId });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    const allowedFields = [
      "firstName",
      "lastName",
      "emailId",
      "photoUrl",
      "gender",
      "age",
      "about",
      "skills",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.user[field] = req.body[field];
      }
    });

    await req.user.save();

    const userResponse = req.user.toObject();
    delete userResponse.password;

    res.status(200).json(userResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = profileRouter;
