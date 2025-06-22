const mongoose = require("mongoose");

const validator = require("validator");

const userSchema = new mongoose.Schema({
  firstName:{
    type: String,
    required: true,
    minLength: 4,
    maxLength: 50
  },
  lastName:{
    type: String,
  },
  emailId:{
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    trim: true,
    validate(value) {
      if(!validator.isEmail(value)){
        throw new Error("Invalid email address:"+value)
      }
    },
  },
  password:{
    type: String,
    required: true,
    validate(value){
      if(!validator.isStrongPassword(value)){
        throw new Error("Enter a Strong Password:"+value)
      }
    },
  },
  age:{
    type: String,
    min: 18
  },
 gender: {
  type: String,
  validate(value) {
    if (!["male", "female", "others"].includes(value)) {
      throw new Error("Gender data is not valid");
    }
  }
},
  photoUrl:{
    type:String,
    default:"https://static.vecteezy.com/system/resources/previews/018/765/757/original/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg.komk",
    validate(value){
      if(!validator.isURL(value)){
        throw new Error("Invalid Photo URL:" + value)
      }
    }
  },
  about:{
    type:String,
    default:"This is about an actress"
  },
  skills:{
    type: [String],
  },
},
{
  timestamps:true
}
);

const User = mongoose.model("User", userSchema);
module.exports = {
  User
};
