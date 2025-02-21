const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      // required: [true, "Name is Required"],
    },
    username: {
      type: String,
      // required: [true, "Username is Required"],
      unique: true,
      index: true,
      lowercase:true, 
      trim:true,
    },
    bio: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    googleId: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      // select:false,
    },
    avatar: {
      url: { type: String, default: "" },//default empty string
      key: String,
    },
    follower: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ], // while scaling we need to refactor this , because the array gets larger, we need to make a different collection
    premium: {
      // talk to creator price
      type: Number,
      default: 50
    },
    reelCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);


userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
  });
}

userSchema.statics.findAndValidate = async function (userDetails, password) {
  const foundUser = await this.findOne(
      {
          $or: [{ username: userDetails.toLowerCase() }, { email: userDetails }]
      }
  ).select("+password");
  //if a user is found, this means that the username is already in use
  if (!foundUser) return false;
  if(!foundUser.password) return false;
  //if username is unique, then we will verify the password
  const isValid = await bcrypt.compare(password, foundUser.password);
  return isValid ? foundUser : false;
}

const User = mongoose.model("User", userSchema);
module.exports = User;
