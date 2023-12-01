const router= require("express").Router()
const Course = require("../models/Course")
const BoughtCourse = require("../models/BoughtCourse")
const CryptoJS= require("crypto-js")
require("dotenv/config")
const jwt= require("jsonwebtoken")

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();

        res.status(201).json({ message: 'Course added successfully', course: courses });
    }
    catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

router.get('/:courseID', async (req, res) => {
    try {
        const courseID = req.params.courseID;

        const courses = await Course.findById(courseID);
        
        res.status(201).json({ message: 'Course added successfully', course: courses });
    }
    catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

router.put('/markcomplete/:courseID/:change', async (req, res) => {
    try {
        const courseID = req.params.courseID;
        const change = !req.params.change;

        const boughtCourse = await BoughtCourse.findOneAndUpdate(
            { courseID: courseID },
            { $set: { isComplete: change } }
        );
        
        res.status(201).json({ message: 'Course added successfully', course: boughtCourse });
    }
    catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error : err });
    }
})

router.put('/like/:courseID/:change', async (req, res) => {
    try {
        const courseID = req.params.courseID;
        const change = req.params.change;

        const boughtCourse = await BoughtCourse.findOneAndUpdate({
            courseID : courseID
        },{
            $set: {isFav : change == 1 ? true : false }
        })

        const course = await Course.findByIdAndUpdate(
            courseID,
            { $inc: { likes: change } },
            { new: true }
        );
        
        res.status(201).json({ message: 'Course added successfully', course: course });
    }
    catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

router.post('/', async (req, res) => {
    try {
        const {
            name,
            instructor,
            description,
            enrollmentStatus,
            thumbnail,
            duration,
            schedule,
            location,
            prerequisites,
            syllabus,
            students,
        } = req.body;
    
        const newCourse = new Course({
            name,
            instructor,
            description,
            enrollmentStatus,
            thumbnail,
            duration,
            schedule,
            location,
            prerequisites,
            syllabus,
            students,
        });
    
        await newCourse.save();
    
        res.status(201).json({ message: 'Course added successfully', course: newCourse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/orders/:userID', async (req, res) => {
    try {
        const userID = req.params.userID;

        const courses = await BoughtCourse.find({
            userID: userID,
        });
      
        res.status(200).json({ courses });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

router.get('/order/:courseID', async (req, res) => {
    try {
        const courseID = req.params.courseID;

        const courses = await BoughtCourse.findById(courseID);
      
        res.status(200).json({ courses });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

router.post('/order', async (req, res) => {
    try {
        const {
            courseID,
            userID
        } = req.body;

        const course = await Course.find({_id : courseID});

        const {
            name,
            instructor,
            description,
            enrollmentStatus,
            thumbnail,
            duration,
            schedule,
            location,
            prerequisites,
            syllabus,
            students,
        } = course[0];
     
        const newDate = new Date();

        newDate.setDate(newDate.getDate() + 8 * 7);

        let day = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();

        const duedate = `${day}-${month}-${year}`

        const progress = 45;
    
        const newCourse = new BoughtCourse({
            courseID,
            userID,
            name,
            instructor,
            description,
            enrollmentStatus,
            thumbnail,
            duedate,
            duration,
            progress,
            schedule,
            location,
            prerequisites,
            syllabus,
            students,
        });
    
        await newCourse.save();
    
        res.status(201).json({ message: 'Course added successfully', course: newCourse });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get("/user/:userID", async (req, res) => {
    try {
        const userID = req.params.userID;
        const courses = await Course.find({
            'students.id': userID,
        });
      
        res.status(200).json({ courses });
    } catch (err) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

module.exports= router