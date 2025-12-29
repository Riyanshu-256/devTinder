const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const { status, toUserId } = req.params;

      if (!["ignored", "interested"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const request = new ConnectionRequest({
        fromUserId: req.user._id,
        toUserId,
        status,
      });

      await request.save();

      res.json({ message: "Request sent successfully" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

module.exports = requestRouter;
