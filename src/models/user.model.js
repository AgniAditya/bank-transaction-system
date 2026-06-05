const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required for creating an account"],
      trim: true,
      lowercase: true,
      match: [
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        "Please enter a valid email address",
      ],
      unique: [true, "Email already exist"],
    },
    name: {
      type: String,
      required: [true, "Name is required for creating an account"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Name is required for creating an account"],
      minlength: [6, "password should be atleast 6 characters"],
      maxlength: [20, "password should be atmost 20 characters"],
      select: false,
      trim: true,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  return;
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
