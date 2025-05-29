const express = require("express");
const { connectDB, User } = require("./config/database");
const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName : "Virat",
    lastName : "Kholi",
    emailId : "virat@kholi.com",
    password : "samaira"
  });
  await user.save();
  res.send("User saved successfully!");
});
connectDB()
  .then(() => {
    app.listen(7777, () => {
      console.log("Server running on http://localhost:7777");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
  });