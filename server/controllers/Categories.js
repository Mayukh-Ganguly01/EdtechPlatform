const Category = require("../models/Category")


//create category ka handler function
exports.createCategory = async (req,res) =>{
    try{
        //fetch data
        const {name, description} = req.body
        //validation
        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }
        //create entry in db
        const categoryDetails = await Category.create({
            name: name,
            description: description
        })
        console.log(categoryDetails)

        return res.status(200).json({
            success: true,
            message: 'Category created Successfully'
        })

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


//get all categories
exports.showAllCategories = async(req,res) =>{
    try{
        const allCategories = await Category.find({}, {name:true, description: true})
        res.status(200).json({
            success: true,
            message: 'All categories return Successfully',
            allCategories
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//category page details handler function
exports.categoryPageDetails = async (req, res) => {
    try{
        //get categoryid
        const {categoryId} = req.body
        //get courses for specified category id
        const selectedCategory = await Category.findById(categoryId).populate("courses").exec()
        //validation
        if(!selectedCategory){
            return res.status(404).json({
                success: false,
                message: 'Data not found'
            })
        }
        //get courses for different categories
        const differentCategories = await Category.find({
                        _id: {$ne: categoryId}
        }).populate("courses").exec()
        //get topselling courses
        //HW
        //return response
        return res.status(200).json({
            success: true,
            data:{
                selectedCategory,
                differentCategories
            },
            message: 'Category page details shown successfully'
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
