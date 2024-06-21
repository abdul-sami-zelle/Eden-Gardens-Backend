const express = require("express");
const Signup = require("../Controller/Authentication/Signup");
const Login = require("../Controller/Authentication/Login");
const SignOut = require("../Controller/Authentication/SignOut");
const Get = require("../Controller/Authentication/Get");
const Edit = require("../Controller/Authentication/Edit");
const Delete = require("../Controller/Authentication/Delete");
const SingleGet = require("../Controller/Authentication/SingleGet");
const ChangePassword = require("../Controller/Authentication/ChangePassword");
const dynamicUploads = require('../midlewares/image-uploads-multer')
const validateImageDiemensions = require('../midlewares/validateImageDimensions');
// testing data
const getAllUsers = require('../Controller/Authentication/getAllUsers');
const router = express.Router();

// const dynamicMulter = require('../midlewares/multerMidleware')

// const signupMulter = dynamicMulter('signup', ['profileImage'], 1, ['image/jpg', 'image/jpeg', 'image/png'], 1*1024*1024)

router.post('/signup',  dynamicUploads('signup').single('profileImage'), async(req, res, next) => {
    try {
        await validateImageDiemensions(req.file);
        next();
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
},
Signup);

router.post("/login", Login);

router.get('/getallusers', getAllUsers);

router.get("/logout", SignOut);

router.get("/Get", Get);

router.put("/update-user/:id", Edit);

router.delete("/delete/:id", Delete);

router.get("/single-user/:id", SingleGet);

router.post("/ChangePassword/:id", ChangePassword);

module.exports = router;
