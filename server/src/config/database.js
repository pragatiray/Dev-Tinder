const mongoose = require("mongoose");
// const validator = require("validator");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/testDB")
      console.log("Connected to MongoDB");
   } catch (err) {
    console.log("MogoDB connection error:", err.message);
  }
};

module.exports = {
  connectDB
};
