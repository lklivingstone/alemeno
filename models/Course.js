const mongoose = require("mongoose")

const CourseSchema= new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        instructor: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        enrollmentStatus: {
            type: String,
            required: true
        },
        thumbnail: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        schedule: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        likes: {
            type: Number,
            default: 0
        },
        prerequisites: [String],
        syllabus: [
            {
                week: Number,
                topic: String,
                content: String,
            },
        ],
        students: [
            {
                id: String,
                name: String,
                email: String,
            },
        ],
      
    }, 
    {
        timestamps: true
    }
)

module.exports= mongoose.model('Course', CourseSchema)