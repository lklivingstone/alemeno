const mongoose = require("mongoose")

const UserSchema= new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
            unique: true
        },
        lastname: {
            type: String,
            required: true,
            unique: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        courses : [
            {
                courseID: {
                    type: String
                }
            }
        ],
        isAdmin: {
            type: Boolean,
            deafult: false
        }
    }, 
    {
        timestamps: true
    }
)

module.exports= mongoose.model('User', UserSchema)
