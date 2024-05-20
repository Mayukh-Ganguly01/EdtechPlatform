const express = require("express")
const router = express.Router()

const{
    sendOTP,
    signUp,
    login,
    changePassword
} = require("../controllers/Auth")
const{
    resetPasswordToken,
    resetPassword
} = require("../controllers/ResetPassword")

const{auth} = require("../middlewares/auth")

//Routes for login, signup and authentication
router.post("/login", login)
router.post("/signup", signUp)
router.post("/sendotp", sendOTP)
router.post("/changepassword", changePassword)

//Reset password
//generating reset password token
router.post("/reset-password-token", resetPasswordToken)
//route for resetting users password after verification
router.post("/reset-password", resetPassword)

module.exports = router