const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

/**
 * register new user
 * POST request /api/auth/register
 * 1. get email, name, password from request body
 * 2. create a new user
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

    res.cookies("token", token);

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

module.exports = {
  registerUser,
};
