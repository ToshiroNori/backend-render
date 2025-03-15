const User = require("../models/User");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const transporter = require("../config/mailer");
const EMAIL_VERIFY_TEMPLATE = require("../config/emailTemplate");

const generateTokenAndSetCookie = (user, res) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3h",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only secure in production
    sameSite: "Strict",
    maxAge: 3 * 60 * 60 * 1000,
  });
  return token;
};

const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please input all fields" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email doesn't exist" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ message: "Please check email or password" });
    }
    const token = generateTokenAndSetCookie(user, res);
    return res.status(200).json({
      name: user.name,
      email: user.email,
      token,
      message: "Login Success",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const registerController = async (req, res) => {
  const { name, email, password, password2 } = req.body;
  if (!name || !email || !password || !password2) {
    return res.status(401).json({ message: "Please input all fields" });
  }
  try {
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (password.trim() !== password2.trim()) {
      return res.status(400).json({ message: "Password not match" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    console.log(process.env.SMTP_USER);

    const emailOption = {
      from: "sabado114daryl@gmail.com", // sender address
      to: newUser.email, // list of receivers
      subject: "Registration Successful", // Subject line
      text: "Welcome to DSolution", // plain text body
      html: EMAIL_VERIFY_TEMPLATE,
    };

    try {
      await transporter.sendMail(emailOption);
    } catch (error) {
      console.error("Error sending email:", error);
      return res
        .status(400)
        .json({ message: "Email not sent", error: error.message });
    }

    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      message: "Registration Successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
const userDataController = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
const logoutController = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only secure in production
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logout successful" });
};
module.exports = {
  loginController,
  registerController,
  userDataController,
  logoutController,
};
