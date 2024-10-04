const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const yup = require("yup");

// Define the Yup Validation schema for user data
const userValidationSchema = yup.object().shape({
  username: yup
    .string()
    .required("Please add username")
    .min(4, "Username must be at least 4 characters long")
    .max(16, "Username cannot be longer than 16 characters")
    .matches(
      /^[A-Za-z0-9 ]+$/,
      "Username must be alphanumeric and can contain spaces"
    ),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Please add email"),
  password: yup
    .string()
    .required("Please add password")
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      "Password must contain at least 8 characters, one letter and one number"
    ),
  role: yup.number().default(0),
});

// Define the Mongoose user schema

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    googleId:String,
    displayName:String,
    password: {
      type: String,
    },
    role: {
      type: Number,
      enum: [0, 1, 2], // 0: User, 1: Admin, 2: editor
      default: 0,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = {
  User: mongoose.model("User", userSchema),
  validateUser: userValidationSchema, // Export the Yup validation schema
};
