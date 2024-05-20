const Section = require("../models/Section")
const Course = require("../models/Course")

//Create Section
exports.createSection = async (req, res) =>{
    try{
        //data fetch 
        const {sectionName, courseId} = req.body
        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: 'Missing Properties'
            })
        }
        //create section
        const newSection = await Section.create({sectionName});
        //update course with section ObjectID
        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                            courseId,
                                            {
                                                $push:{
                                                    courseContent: newSection
                                                }
                                            },
                                            {new: true}
        //how to use populate in here thats how i can show both section and subsection
        ).populate({
            path:"courseContent",
            populate: {
                path: "subSection"
            }
        }).exec()
        
        //return response
        return res.status(200).json({
            success: true,
            message: 'Section created successfully',
            updatedCourseDetails
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: 'Unable to create section please try again',
            error:error.message
        })
    }
}

//Update Section
exports.updateSection = async(req, res) =>{
    try{
        //data input
        const {sectionName, sectionId} = req.body
        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                message: 'messing properties'
            })
        }
        //update data 
        const section = await Section.findByIdAndUpdate(
                                        sectionId,
                                        {sectionName},
                                        {new: true}
        )
        console.log("Section: ", section)
        //return response
        return res.status(200).json({
            success: true,
            message: 'Section Updated Successfully'
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Unable to update section please try again',
            error:error.message
        })
    }
}

//deleta Section
exports.deleteSection = async(req, res) =>{
    try{
        //get id - assuming that we are sending ID in params
        //param se ku nahhi ho raha
        const {sectionId} = req.body
        //use findbyidanddelete
        await Section.findByIdAndDelete(sectionId)
        //do we need to delete the entry from the coures schema
        // NO this will happen automatically how ?
        //return response
        return res.status(200).json({
            success: true,
            message: 'Section Deleted Successfully'
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: 'Unable to delete section please try again',
            error:error.message
        })
    }
}