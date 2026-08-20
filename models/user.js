const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      required: true,
      enum: ["host", "guest"],
    },
    favourites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Home",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
