const User = require("../models/User")
const OTP = require("../models/OTP")
const otpGenerator = require("otp-generator")
const Profile = require("../models/Profile")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const mailSender = require("../utils/mailSender")
const {passwordUpdated} = require("../mail/templates/passwordUpdate")

require("dotenv").config()



//otp send
exports.sendOTP = async(req,res) =>{
    try{
        //fetch email from req body
        const {email} = req.body
        //check if user already exist 
        const checkUserPresent = await User.findOne({email})
        //if user exist then retrun a response
        if(checkUserPresent){
            return res.status(401).json({
            success: false,
            message: 'User already registerd'
            })
        }
        //generate otp
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })
        console.log("OTP generated: ", otp)

        //check unique otp or not 
        const result = await OTP.findOne({otp: otp})
        console.log("Result", result)
        while(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            })
            result = await OTP.findOne({otp: otp})
        }

        const otpPayload = {email, otp}
        //create an entry in DB for otp
        const otpBody = await OTP.create(otpPayload)
        console.log("OPT body", otpBody)

        //return response
        res.status(200).json({
            success: true,
            message: 'otp send successfully',
            otp
        })
    }
    catch(error){4
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

//signUp
exports.signUp = async(req, res) => {
    try{
            //data fetch from reqbody
        const {
            firstName, 
            lastName, 
            email, 
            password, 
            confirmPassword, 
            accountType,
            contactNumber,
            otp
        } = req.body
        //data validation
        if(!firstName || !lastName || !email ||!password ||!confirmPassword ||!otp){
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }
        //2 password match 
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: 'Password and confirmPassword value doesnot match'
            })
        }
        //check user exist or not 
        const existingUser = await User.findOne({email})
        if(existingUser){
            res.status(400).json({
                success: false,
                message: 'User is already registered'
            })
        }
        // find most recent otp for user 
        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(response)
        //validate otp
        if(response.length === 0){
            //otp not found
            return res.status(400).json({
                success: false,
                message: 'OTP not found'
            })
        }else if(otp !== response[0].otp){
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            })
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        //create the user
        let approved = ""
        approved === "Instructor" ? (approved = false) : (approved = true)

        //entry create on DB
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        })
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType: accountType,
            approved: approved,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })
        //return res
        return res.status(200).json({
            success: true,
            user,
            message: 'User is registered successfully',
            
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'User cannot be registered.'
        })
    }

}

//login
exports.login = async(req, res) =>{
    try{
        //get data from req body
        const {email, password} = req.body
        //validate data
        if(!email || !password) {
            return res.status(403).json({
                success: false,
                message: 'All fields are required'
            })
        }
        //user check exist or not 
        const user = await User.findOne({email}).populate("additionalDetails")
        if(!user){
            return res.status(401).json({
                success: false,
                message: 'User is not registered please create an account first'
            })
        }
        // generate jwt token and password match
        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET,{
                expiresIn: "24h"
            })
            // Save token to user document in database
            user.token = token
            user.password = undefined

            //create cookie and send response
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: 'loggedin successfully'
            })
        }
        else{
            return res.status(401).json({
                success: false,
                message: 'Password is not matched'
            })
        }
        
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: 'Login Failure, please try again'
        })
    }
}

//changepassword controller
exports.changePassword = async (req, res) =>{
    try{
        //get data from req body
        const userDetails = await User.findById(req.user.id)
        //get oldpassword, new password, confirmnewpassword
        const {oldPassword, newPassword, confirmPassword} = req.body
        //validation old password
        const isPasswordMatchh = await bcrypt.compare(
            oldPassword,
            userDetails.password
        )
        if(!isPassword){
            //if old password does not match, return a 401 error
            return res.status(401).json({
                success: false,
                message: 'The password is incorrect'
            })
        }
        //match new password and confirm password
        if(newPassword !== confirmPassword){
            //not matched
            return res.status(400).json({
                success: false,
                message: 'The password and confirm password does not match'
            })
        }
        //update password
        const encryptedPassword = await bcrypt.hash(newPassword, 10)
        const updatedUserDetails = await User.findByIdAndUpdate(
            req.user.id,
            {password: encryptedPassword},
            {new: true}
        )

        //send notification email
        try{
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                passwordUpdated(
                    updatedUserDetails.email,
                    `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            )
            console.log("Email send successfully", emailResponse.response)
        }
        catch(error){
            console.log(error)
            return res.status(500).json({
                success: false, 
                message: error.message
            })
        }
        //return success response
        return res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}