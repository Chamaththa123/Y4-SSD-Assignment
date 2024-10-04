const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    googleId: { type: String, unique: true },  // Ensure googleId is unique
    displayName: String,
    username: String,
    email: String,
    image: String
}, { timestamps: true });



const userdb = new mongoose.model("users",userSchema);

module.exports = userdb;