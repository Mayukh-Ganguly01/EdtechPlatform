const Course = require("../models/Course")
const Category = require("../models/Category")
const User = require("../models/User")
const {uploadImageToCloudinary} = require("../utils/imageUploader")


//createCourse handler function
exports.createCourse = async (req, res) =>{
    try{
        //get user id form req body
        const userId = req.user.id
        //data fetch
        let {courseName, courseDescription, whatYouWillLearn, price, category, tag, status, instructions} = req.body
        //get thumbnail
        const thumbnail = req.files.thumbnailImage
        //validation
        if(!courseName || !courseDescription ||!whatYouWillLearn ||!price ||!category ||!thumbnail || !tag){
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }
        if(!status || status === undefined) {
            status = "Draft"
        }

        //check if the user is an instructor
        
        const instructorDetails = await User.findById(userId,{
            accoutType: "Instructor"
        })
        console.log("Instructor Details: ", instructorDetails)

        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message: 'Instructor details not found'
            })
        }

        //check given category is valid or not 
        const categoryDetails = await Category.findById(category)
        if(!categoryDetails){
            return res.status(404).json({
                success: false,
                message: 'Category details not found'
            })
        }
        //upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)
        console.log(thumbnailImage)
        //create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag: tag,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
            status: status,
            instructions: instructions
        })
        //add the new course to the user schema of instructor
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push:{
                    courses: newCourse._id
                }
            },
            {new: true}
        )
        //update the category Schema
        await Category.findByIdAndUpdate(
            {_id: categoryDetails._id},
            {
                $push:{
                    courses: newCourse._id
                }
            },
            {new: true}
        )
        //return response
        return res.status(200).json({
            success: true,
            data: newCourse,
            message: 'Course created successfully'
            
        })

    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Failed to create course',
            error: error.message
        })
    }
}



//getAllCourses handler function
exports.getAllCourses = async(req, res) =>{
    try{
        const allCourses = await Course.find({}, {courseName: true,
                                                price: true,
                                                thumbnail: true,
                                                instructor: true,
                                                ratingAndReviews: true,
                                                studentsEnrolled: true})
                                                .populate("instructor").exec()
        return res.status(200).json({
            succes: true,
            message: 'Data for all courses fetched successfully',
            data: allCourses
        })
    }
    catch(error){
        console.log(error)
        return res.status(404).json({
            success: false,
            message: 'Cannot fetch course data',
            error: error.message
        })
    }
}

//getCourseDetails handler function
exports.getCourseDetails = async (req, res) => {
    try{
        //get course id
        const {courseId} = req.body
        //find course details
        const courseDetails = await Course.find(
                                    {_id: courseId}).populate(
                                        {
                                            path: "instructor",
                                            populate: {
                                                path: "additionalDetails"
                                            }
                                        }
                                    ).populate("category")
                                    .populate("ratingAndReviews")
                                    .populate({
                                        path: "courseContent",
                                        populate: {
                                            path: "subSection"
                                        }
                                    }).exec()
        //validation
        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: `Could not find the course ith ${courseId}`
            })
        }
        //return response
        return res.status(200).json({
            success: true,
            message: 'Course Details fetched successfully',
            data: courseDetails
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
