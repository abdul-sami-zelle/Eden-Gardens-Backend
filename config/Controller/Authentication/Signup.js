const UserModel = require("../../Model/UserSchema");
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');
const JWT_SECRATE = 'my_secrate_key';


const validatePassword = (password) => {
  const passwordRegex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

const Signup = async (req, res) => {
  const { userName, fullName, email, password, confirmpassword, idNumber, role, lastLogin, dateAdded } = req.body;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!fullName || !userName || !email || !password || !idNumber || !role || !lastLogin || !dateAdded || !req.file) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ status: 400, message: "Invalid email format" });
  }

  console.log(password);
  console.log(confirmpassword)
  
  try {
    if(!validatePassword(password)){
      return res.status(400).send({status: 400, message: "password does not meet requirnments"})
    }
    if(password !== confirmpassword){
      return res.status(400).send({status: 400, message: "password not match"})
    }else{
      const hashPassword = await bcryptjs.hash(password, 10);

      const user = new UserModel({
        fullName,
        userName,
        email,
        password: hashPassword,
        idNumber,
        role,
        lastLogin,
        dateAdded,
        profileImageName: req.file.originalname,
        profileImagePath: req.file.path
      });

      await user.save()
      .then((user) => {
        const maxTime = 3 * 60 * 60
        const token = jwt.sign(
          {id: user._id, userName, role: user.role},
          JWT_SECRATE,
          {expiresIn: maxTime}
        )
      res.cookie("jwt", token, {
        httpOnly: true,
        maxTime: maxTime * 1000
      })
    });
      res.status(201).json({ message: "User successfully registered", user: user._id });
    }
    } catch (error) {
      console.error("Error occurred during user registration:", error);
      res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = Signup;
