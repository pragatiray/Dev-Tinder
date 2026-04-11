const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("MongoDB connection error:", err.message);
    process.exit(1); // stop app if DB fails
  }
};

module.exports = {
  connectDB
};