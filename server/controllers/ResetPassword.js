const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const bcrypt = require("bcrypt")
const crypto = require("crypto")


//resetPasswordToken
exports.resetPasswordToken = async(req, res) => {
    try{
        //get email from req body
        const email = req.body.email
        //check user for the email, validation
        const user = await User.findOne({email: email})
        if(!user){
            return res.json({
                success: false,
                message: 'your email is not registered with us'
            })
        }
        //generate token
        const token = crypto.randomBytes(20).toString("hex")
        //update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
                                {email:email},
                                {
                                    token: token,
                                    resetPasswordToken: Date.now() + 5*60*1000
                                },
                                {new: true})
        console.log("Details: ",updatedDetails)
        //create url
        const url = `http://localhost:3000/update-password/${token}`
        //send mail containing url
        await mailSender(email, "Password Reset Link", `Password Reset Link: ${url}`)
        //retrun response
        return res.json({
            success: true,
            message: 'Email send successfully for reset password'
        })

    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while reseting Password'
        })
    }
}

//resetPassword
exports.resetPassword = async (req, res) => {
    try{
       //data fetch karlo
       const {password, confirmPassword, token} = req.body
       //validation karlo
       if(password !== confirmPassword){
        return res.json({
            success: false,
            message: 'Password not matching'
        })
       }
       //get user details from db using token
       const userDetails = await User.findOne({token: token})
       //if not entry -> invalid token
       if(!userDetails){
        return res.json({
            success: false,
            message: 'token invalid'
        })
       }
       //token time check
       if(userDetails.resetPasswordExpires < Date.now()){
            return res.status(403).json({
                success: false,
                message: 'token is expired'
            })
       }
       //hash the password
       const encryptedPassword = await bcrypt.hash(password, 10)
       //update the password
       await User.findOneAndUpdate(
        {token: token},
        {password: encryptedPassword},
        {new: true}
       )
       //return response
       return res.status(200).json({
        success: true,
        message: 'Password reset successfully'
       })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while sending reset password'
        })
    }
}