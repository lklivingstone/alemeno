const router= require("express").Router()
const User = require("../models/User")
const CryptoJS= require("crypto-js")
require("dotenv/config")
const jwt= require("jsonwebtoken")

router.post("/register", async (req, res) => {
    const newUser= new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.CRYPTO_KEY).toString(),
        isAdmin: req.body.isAdmin || false
    })

    try{
        const savedUser= await newUser.save()
        res.status(200).json(savedUser)
    }catch(err) {
        res.status(500).json(err)
    }
})

router.post("/login", async (req, res) => {
    try{
        const user= await User.findOne({username: req.body.username})
        if (!user) {
            res.status(401).json("wrong credentials")
        }
        else {
            const OriginalPassword= CryptoJS.AES.decrypt(user.password, process.env.CRYPTO_KEY).toString(CryptoJS.enc.Utf8)

            if (OriginalPassword!==req.body.password) {
                res.status(401).json("wrong credentials")
            }
            else {

                const accessToken= jwt.sign({
                    id: user._id,
                    isAdmin: user.isAdmin
                }, process.env.JWT_KEY, { expiresIn: "30d"})
                const { password, ...other }= user._doc
                res.status(200).json({
                  user_id: user._id, 
                  username: user.username,
                  access_token: accessToken
                })
            }
        }
    }catch(err) {
        res.status(500).json(err)
    }
})

router.put('/addcourse/:userID', async (req, res) => {
    try {
        const userID = req.params.userID;
        const { courseID } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            userID,
            { $push: { 
                courses: { 
                    courseID: courseID
                } 
            } },
            {
                new: true
            }
        );
    
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        res.status(200).json({ message: 'Course added to user successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
  });

module.exports= router
