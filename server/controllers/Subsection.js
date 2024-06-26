const SubSection = require("../models/SubSection")
const Section = require("../models/Section")
const { uploadImageToCloudinary } = require("../utils/imageUploader")

//Create subsection
exports.createSubSection = async (req, res) =>{
    try{
        //fetch data from req body
        const {sectionId, title, timeDuration, description} = req.body
        //extract file/video
        const video = req.files.video
        //validation
        if(!sectionId || !title || !timeDuration || !description || !video){
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }
        console.log(video)
        //upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME)
        //create subsection
        const SubSectionDetails = await SubSection.create(
                                    {title: title,
                                    timeDuration: `${uploadDetails.duration}`,
                                    description: description,
                                    videoUrl: uploadDetails.secure_url
                                    })
        //update section with this subsection objectid
        const updatedSection = await Section.findByIdAndUpdate({_id: sectionId},
                                                            {
                                                                $push:{
                                                                    subSection:SubSectionDetails._id
                                                                }
                                                            },
                                                            {new: true}).populate("subSection")
        //log updated sec here, after adding populate query
        console.log("UpdatedSection: ",updatedSection)
        //return res
        return res.status(200).json({
            success: true, 
            message: 'SubSection Created Successfully',
            data:updatedSection
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.messaage
        })
    }
}

//updateSubsection
exports.updateSubSection = async(req, res) => {
    try{
        const{sectionId, title, description} = req.body
        const subSection = await SubSection.findById(sectionId)

        if(!subSection){
            return res.status(404).json({
                success:false,
                message: "Subsection not found"
            })
        }
        if(title !== undefined) {
            subSection.title = title
        }
        if(description !== undefined){
            subSection.description = description
        }
        if(req.files && req.files.video !== undefined){
            const video = req.files.video
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME
            )
            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`
        }
        await subSection.save()

        return res.status(200).json({
            success: true,
            message: 'Section updated successfully'
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'An error occurred while updating the section',
            error: error.message
        })
    }
}

//deleteSubsection
exports.deleteSubSection = async (req, res) => {
    try{
        const {subSectionId, sectionId} = req.body
        await Section.findByIdAndUpdate(
            {_id: sectionId},
            {
                $pull:{
                    subSection: subSectionId
                }
            },
            {new: true}
        )
        const subSection = await SubSection.findByIdAndDelete({_id: subSectionId})

        if(!subSection){
            return res.status(404).json({
                success: false,
                message: 'Subsection not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'SubSection deleted successfully'
        })
    }
    catch(error){
        console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
      })
    }
}