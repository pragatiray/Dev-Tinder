const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://pragatiray445_db_user:wP68pDeMvqxHamxr@task-management.be4qgxv.mongodb.net/");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("MongoDB connection error:", err.message);
    process.exit(1); // stop app if DB fails
  }
};

module.exports = {
  connectDB
};