//we dont need to write create profile handler cause its already created when user signup
const Profile = require("../models/Profile")
const User = require("../models/User")
const { uploadImageToCloudinary } = require("../utils/imageUploader")

//Update Profile 
exports.updateProfile = async (req, res) =>{
    try{
        //get data
        const {dateOfBirth="",about="", contactNumber="",gender} =req.body
        //get userid
        const id =req.user.id
        //validate data
        // if(!contactNumber || !gender || !id){
        //     return res.status(400).json({
        //         success: false,
        //         message: 'All fields are required'
        //     })
        // }
        //find profile
        const userDetails = await User.findById(id)
        const profile = await Profile.findById(userDetails.additionalDetails)
        //update profile
        profile.dateOfBirth = dateOfBirth
        profile.about = about
        profile.gender = gender
        profile.contactNumber = contactNumber
        await profile.save()
        //return response
        return res.status(200).json({
            success: true, 
            message: 'Profile Updated Successfully',
            profile
        })
    }
    catch(error){
        return res.status(500).json({
            success: false, 
            error: error.message
        })
    }
}


//delete account function
//make the delete schedule 

//Explore -> cron job
exports.deleteAccount = async(req, res) =>{
    try{
        //get id
        const id = req.user.id
        //validation
        const user = await User.findById(id)
        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        //delete profile
        await Profile.findByIdAndDelete({_id: user.additionalDetails})
        //HW:unenroll user from all enrolled courses
        //delete user
        await User.findByIdAndDelete({_id:id})
        
        //return response
        return res.status(200).json({
            success :true,
            message :'User deleted Successfully'
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success : false,
            message : 'User cannot be deleted successfully'
        })
    }
}

//get all details of user
exports.getAllUserDetails = async(req, res) =>{
    try{
        //get id 
        const id = req.user.id
        //validation and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec()
        if(!userDetails){
            return res.status(404).json({
                success : false,
                message : 'User not found'
            })
        }
        //return res
        return res.status(200).json({
            success : true,
            data: userDetails,
            message : 'User data fetched successfully'
        })
    }
    catch(error){
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

//update user display picture
exports.updateDisplayPicture = async(req,res) => {
    try{
        const displayPicture = req.files.displayPicture
        const userId = req.user.id
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        console.log(image)
        const updatedProfile = await User.findByIdAndUpdate(
            {_id: userId},
            {image: image.secure_url},
            {new: true}
        )
        //return response
        return res.status(200).json({
            success: true,
            data: updatedProfile,
            message: 'Image Updated successfully'
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//get all enrolled courses handler function
exports.getEnrolledCourses = async(req, res) => {
    try{
        const userId = req.user.id
        const userDetails = await User.findOne({
            _id: userId,
        }).populate("courses").exec()

        if(!userDetails){
            return res.status(400).json({
                success: false,
                message: `Could not find user with id: ${userDetails}`
            })
        }
        return res.status(200).json({
            success: true,
            data: userDetails.courses
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}