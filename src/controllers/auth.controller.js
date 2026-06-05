const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

/**
 * register new user
 * POST /api/auth/register
 */
async function registerUser(req, res) {
  try {
    const { email, name, password } = req.body;

    const isUserExist = await userModel.findOne({ email });
    if (isUserExist) {
      return res.status(422).json({
        message: `user already exist with this email: ${email}`,
        status: "failed",
      });
    }

    const newUser = await userModel.create({
      email,
      name,
      password,
    });

    const token = jwt.sign(
      {
        userId: newUser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      },
    );

    res.cookie("token", token);

    return res.status(201).json({
      user: {
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      },
      message: "user register successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

/*
 * login user
 * GET /api/auth/login
 */
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "email not found",
      });
    }

    const isValidePassword = await user.comparePassword(password);
    if (!isValidePassword) {
      return res.status(401).json({
        message: "password is incorrect",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      },
    );

    res.cookie("token", token);

    return res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      message: "user login successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  registerUser,
  loginUser,
};
