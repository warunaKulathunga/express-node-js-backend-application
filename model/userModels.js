const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please add the user email"],
      unique: [true, "Email address already taken"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phone_number: {
      type: String,
      required: [true, "Please add the user phone number"],
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("User", userSchema);
