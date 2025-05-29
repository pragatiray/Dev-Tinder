const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/testDB")
      console.log("Connected to MongoDB");
   } catch (err) {
    console.log(" MogoDB connection error:", err.message);
  }
};

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  emailId: String,
  password: String,
  age: String,
  gender: String,
});

const User = mongoose.model("User", userSchema);

module.exports = {
  connectDB,
  User,
};
