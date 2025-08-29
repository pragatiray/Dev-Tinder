const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const {validateSignUpData} =  require("./utils/validation");
const app = express();
const bcrypt = require("bcrypt")

app.use(express.json())

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    //Validation of user
    validateSignUpData(req);
  
    const {firstName, lastName, emailId, password} = req.body;
    //Encrypt the password
    const passwordHash = await bcrypt.hash(password,10);
    //Creating a new user
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash
     });
     await user.save();
     res.send("User saved successfully!");
  } catch (err) {
     res.status(400).send("ERROR : " + err.message);
  }
});
app.get("/user",async(req,res) => {
  const userEmail = req.body.emailId;
  try{
  const user = await User.findOne({emailId:userEmail})
  res.send(user)
  } catch(err){
    res.status(400).send("Something went wrong")
  }
})
app.get("/feed",async(req,res) => {
  try{
  const user = await User.find({})
  res.send(user)
  } catch(err){
    res.status(400).send("Something went wrong")
  }
})
app.delete("/user",async(req,res) =>{
  const userId = req.body.userId;
  try{
    const user = await User.findByIdAndDelete({_id: userId})
    res.send("User added successfully")
  } catch(err){
    res.status(400).send("Something went wrong")
  }
})
app.patch("/user/:userId", async(req,res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try{
  const ALLOWED_UPDATES = ["userId","photoUrl","about","gender","age", "skills"]
  const isUpdateAllowed = Object.keys(data).every((k) =>
    ALLOWED_UPDATES.includes(k)
  );
  if(!isUpdateAllowed){
   throw new Error("Update not allowed")
  }
    await User.findByIdAndUpdate({_id: userId},data)
    res.send("User updated successfully")
  } catch(err){
    res.status(400).send("Something went wrong")
  }
})

connectDB()
  .then(() => {
    app.listen(7777, () => {
      console.log("Server running on http://localhost:7777");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
});