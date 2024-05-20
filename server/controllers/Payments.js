const { default: mongoose } = require("mongoose")
const {instance} = require("../config/razorpay")
const Course = require("../models/Course")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail")



//capture the payment and initiate the razorpay order
exports.capturePayment = async(req, res) =>{
    
    //get course id and user id
    const {course_id} = req.body
    const userId = req.user.id

    //valid courseID
    if(!course_id){
        return res.json({
            success: false,
            message: 'Please provide valid course id '
        })
    }
    //valid courseDetails
    let course;
    try{
        course = await Course.findById(course_id)
        if(!course){
            return res.json({
                success: false,
                message: 'Could not find the course'
            })
        }
        //user already paid or not 
        const uid = mongoose.Types.ObjectId(userId);  //converting userid string to object id
        if(course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success: false,
                message: 'Student is already enrolled'
                })
            }
        }
        catch(error){
            console.error(error)
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
        //create order 
        const amount = course.price
        const currency = "INR"

        const options = {
            amount: amount * 100,
            currency,
            receipt: Math.random(Date.now()).toString(),
        notes:{
            courseId: course_id,
            userId,
        }
    };

    try{
        //initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options)
        console.log(paymentResponse)
        // return response
        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount
        })
    }
    catch(error){
        console.log(error)
        return res.json({
            success: false,
            message: 'could not initiate order'
        })
    }
}

//verify Signature of Razorpay and Server
exports.verifySignature = async(req,res) => {
    const webhookSecret = "12345678"

    const signature = req.headers["x-razorpay-signature"] //this signature comes from razorpay

    const shasum = crypto.createHmac("sha256", webhookSecret)
    shasum.update(JSON.stringify(req.body))
    const digest = shasum.digest("hex")


    if(signature === digest){
        console.log("Payment is authorised")

        const {courseId, userId} = req.body.payload.payment.entity.notes

        try{
            //fullfil the action
            //find the course and enroll the student in it 
            const enrolledCourse = await Course.findOneAndUpdate(
                                                    {_id: courseId},
                                                    {
                                                        $push:{
                                                                studentsEnrolled: userId
                                                        }
                                                    },
                                                    {new: true}
            )
            if(!enrolledCourse){
                return res.status(500).json({
                    success: false,
                    message: 'Course not found'
                })
            }

            console.log(enrolledCourse)

            //find the student and add course to their list of enrolled courses
            const enrolledStudent = await User.findOneAndUpdate(
                                                    {_id: userId},
                                                    {
                                                        $push:{
                                                            courses: courseId
                                                        }
                                                    },
                                                    {new: true}
            )
            console.log(enrolledStudent)

            //confirmation mail send
            const emailResponse = await mailSender(
                                    enrolledStudent.email,
                                    "Title",
                                    "congratulation, you are enrolled into course"
            )

            console.log(emailResponse)

            return res.status(200).json({
                success: true,
                message: 'Signature verified and course added'
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

    else{
        return res.status(400).json({
            success: false,
            message: 'Invalid request'
        })
    }
}



