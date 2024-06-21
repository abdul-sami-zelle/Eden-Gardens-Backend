const UserModel = require("../../Model/UserSchema");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRATE = process.env.JWT_SECRET || "thisissecratekey";

const Login = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ status: 400, message: "Required fields are missing" });
  }

  try {
    const user = await UserModel.findOne({ userName });

    if (!user) {
      return res.status(401).json({ status: 401, message: "User not found" });
    }

    bcryptjs.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({ status: 500, message: "Password comparison error" });
      }

      if (!result) {
        return res.status(401).json({ status: 401, message: "Incorrect password" });
      }

      const token = jwt.sign(
        {
          id: user._id,
          username: user.userName,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
          lastLogin: user.lastLogin,
        },
        JWT_SECRATE,
        {
          expiresIn: "1h",
        }
      );

      res.cookie('token', token, { httpOnly: true });
      res.status(200).json({ token });
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ status: 500, message: "An error occurred during login" });
  }
};

module.exports = Login;
