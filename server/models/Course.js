const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema({
    courseName:{
        type: String,
    },
    courseDescription:{
        type: String,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    whatYouWillLearn:{
        type:String
    },
    courseContent:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        required: true
    }],
    ratingAndReviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RatingAndReview"
        }
    ],
    price:{
        type: Number,
        required: true
    },
    thumbnail:{
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    tag:{
        type: [String],
        required: true
    },
    studentsEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref : "user",
        required: true
    }],
    instructions: {
		type: [String],
	},
	status: {
		type: String,
		enum: ["Draft", "Published"],
	},

})

module.exports = mongoose.model("Course", courseSchema)