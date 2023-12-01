const mongoose = require("mongoose")

const BoughtCourseSchema= new mongoose.Schema(
    {
        courseID: {
            type: String,
            required: true
        },
        userID: {
            type: String,
            required: true
        },
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
        duedate: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        progress: {
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
        isFav: {
            type: Boolean,
            default: false,
        },
        isComplete: {
            type: Boolean,
            default: false,
        }
    }, 
    {
        timestamps: true
    }
)

module.exports= mongoose.model('BoughtCourse', BoughtCourseSchema)