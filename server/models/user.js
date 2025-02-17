const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
    },
    username: {
      type: String,
      required: [true, "Username is Required"],
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
      select:false,
    },
    avatar: {
      url: { type: String, default: "https://default-avatar.com/default.png" },
      filename: String,
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
    },
    reelCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);



const User = mongoose.model("User", userSchema);
module.exports = User;
