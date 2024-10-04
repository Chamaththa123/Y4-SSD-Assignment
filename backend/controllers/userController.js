const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const {User} = require("../models/userModel");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;

const { generateToken } = require("../utils/generateToken");

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public

// Function to check if the account is locked
const isAccountLocked = (user) => {
  return user.lockUntil && user.lockUntil > Date.now();
};

const authUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // If no user is found
    if (!user) {
      return res.status(400).json({ message: 'Invalid Email' });
    }

    // Check if the account is locked
    if (isAccountLocked(user)) {
      const unlockDate = new Date(user.lockUntil);
      const unlockDateString = unlockDate.toLocaleString(); // Format date and time
      return res.status(403).json({
        message: `Account is locked. Try again after ${unlockDateString}.`,
      });
    }


    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // Increment failed login attempts
      user.failedLoginAttempts += 1;
      user.lastLoginAttempt = Date.now();

      // Lock the account after 8 failed attempts
      if (user.failedLoginAttempts >= 8) {
        user.lockUntil = Date.now() + 2 * 24 * 60 * 60 * 1000; // Lock for 2 days
        user.failedLoginAttempts = 0; // Reset failed attempts
        await user.save();
        const unlockDate = new Date(user.lockUntil);
        const unlockDateString = unlockDate.toLocaleString(); // Format date and time
        return res.status(403).json({
          message: `Account locked for 2 days due to multiple failed login attempts. Try again after ${unlockDateString}.`,
        });
      }

      await user.save();
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Successful login, reset failed attempts and lockUntil
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    user.lastLoginAttempt = Date.now();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return token and user data
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});



// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    //Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // Strong password validation
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user instance
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    return res
      .status(201)
      .json({ message: "User registered successfully", user: savedUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.status(200).json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin || user.isAdmin;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user stats
// @route   GET /api/users/stats
// @access  Private/Admin
const getUserStats = asyncHandler(async (req, res) => {
  // Create a new Date object to represent the current date and time
  const date = new Date();
  // Subtract one year from the current date to get the date from last year
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  // Use the MongoDB aggregate function to perform a series of operations on the User collection
  const data = await User.aggregate([
    {
      // Filter documents to only include those where the 'createdAt' field is greater than or equal to 'lastYear'
      $match: { createdAt: { $gte: lastYear } },
    },
    {
      // Project a new field called 'month' that contains the month of the 'createdAt' field
      $project: { month: { $month: "$createdAt" } },
    },
    {
      // Group documents by the 'month' field and calculate a count of documents for each month
      $group: { _id: "$month", total: { $sum: 1 } },
    },
  ]);

  res.status(200).json(data);
});

module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  getUserStats,
};
