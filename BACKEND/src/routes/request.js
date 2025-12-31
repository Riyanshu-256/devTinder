const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

/* =========================================
   SEND CONNECTION REQUEST
   POST /request/send/:status/:toUserId
========================================= */
requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const { status, toUserId } = req.params;
    const fromUserId = req.user._id;

    if (!["interested", "ignored"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (fromUserId.toString() === toUserId) {
      return res
        .status(400)
        .json({ message: "Cannot send request to yourself" });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      fromUserId,
      toUserId,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const request = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    await request.save();

    res.json({ message: "Request sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================================
   GET RECEIVED REQUESTS
   GET /request/received
========================================= */
requestRouter.get("/received", userAuth, async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({
      toUserId: req.user._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName emailId skills photoUrl");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================================
   ACCEPT / REJECT REQUEST
   POST /request/review/:status/:requestId
========================================= */
requestRouter.post("/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const { status, requestId } = req.params;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid review status" });
    }

    const request = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: req.user._id,
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status;
    await request.save();

    res.json({ message: `Request ${status}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = requestRouter;
