const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);
      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        fullName: req.body.fullName,
        isAdmin: req.body.isAdmin,
        password: hashed,
      });

      const user = await newUser.save();

      return res
        .status(200)
        .json({ status: 200, message: "Đăng ký thành công!!!", user });
    } catch (error) {
      res.status(500).json({
        message: error?.keyValue?.email
          ? "Email này đã tồn tại!!!"
          : error?.keyValue?.username
          ? "Username này đã tồn tại!!!"
          : "",
        error: error,
      });
    }
  },

  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res
          .status(404)
          .json({ status: 404, message: "User không tồn tại!!!", user: null });
      }

      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!isValidPassword) {
        return res
          .status(404)
          .json({ status: 404, message: "Password sai!!!", user: null });
      }

      return res
        .status(200)
        .json({ status: 200, message: "Đăng nhập thành công!!!", user });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = authController;