// Import monggose
const mongoose = require("mongoose");

// This function will connect our Node.js app to the MongoDB database
const connectDB = async() => {
    await mongoose.connect(
        "mongodb+srv://namaste-node:cvWTNwUOuv8xzDk8@namaste-node.rz96f4l.mongodb.net/devTinder"
    );
};

// Export this function so we can use it in other files(app.js)
module.exports = connectDB;
