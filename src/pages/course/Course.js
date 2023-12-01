import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from 'axios';
import Card from '@mui/material/Card';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import logo from "./dunder.png";
import { useLocation } from "react-router-dom";
import TimelapseIcon from '@mui/icons-material/Timelapse';
import AdjustIcon from '@mui/icons-material/Adjust';
import "./Course.css"
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Navbar from "../../components/navbar/Navbar";

const Course = () => {
    const userID = useSelector((state) => state.user.user_id);
    const location= useLocation();
    const courseID = location.pathname.split("/")[2];

    console.log(courseID, userID)
    const [course, setCourse]= useState(null);

    useEffect(() => {
        const getCourses = async () => {
            try{
                const config = {
                    headers : {
                    }
                };
                const res= await axios.get(`http://localhost:5000/api/course/${courseID}`)
                console.log(res.data['course'])

                setCourse(res.data['course'])
            } catch(error) {
                if (error.response["status"] === 403 || error.response["status"] === 401) {
                }
            }
        }
        getCourses();
    }, [])
    
    return (
        <>
        <Navbar />
        <div style={{ 
            width: "100vw",
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center", 
            alignItems: "center"
        }}>
            <div
                style={{
                    width: "80%",
                    display: "flex",
                    justifyContent: "space-between"
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px"
                    }}
                >
                    <img src={logo} alt="" width="200px" height="200px" />
                    <div
                    
                    >
                        <h1>
                            {course?.name}
                        </h1>
                        <br/>
                        <p>
                            {course?.description}
                        </p>
                        <p>
                            By: {course?.instructor}
                        </p>
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "flex-end",
                        padding: "10px"
                    }}
                >
                    {
                        course?.isFav ?
                        (
                            <FavoriteIcon />
                        ) : (
                            <FavoriteBorderIcon />
                        )
                    }
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between"
                }}
            >
            </div>

            <div
            style={{
                height: "100px",
                width: "100vw",
                padding: "0 10px 0 20px",
                backgroundColor: "#E5E4E2",
                display: "flex",
                flexDirection: "row"
            }}
            >
                <div
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "5px"
                }}
                >
                    <TimelapseIcon style={{fontSize: "40px"}} />
                    <div>
                        <p>Duration:</p>
                        <p>{course?.duration} weeks</p>
                    </div>
                </div>
                <div
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "5px"
                }}
                >
                    <AdjustIcon style={{fontSize: "40px"}} />
                    <div>
                        <p>Status:</p>
                        <p>{course?.enrollmentStatus}</p>
                    </div>
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "20px",
                    width: "75%"
                }}
            >
                <div
                style={{flex: 5}}
                >
                    <h4>Prerequisites</h4>
                    <ul>
                        {course?.prerequisites?.map((data, index) => {
                            return <li key={index}>{data}</li>
                        })}
                    </ul>
                </div>
                <Card
                style={{
                    flex: 3,
                    padding: "20px",
                    gap: "10px"
                }}
                >
                    <p><strong>Schedule:</strong> {course?.schedule}</p>
                    <p><strong>Location:</strong> {course?.location}</p>
                </Card>
            </div>
            <div>
            <section className="accordion">
            <input type="checkbox" name="collapse2" id="handle2" />
            <h2 className="handle">
                <label htmlFor="handle2"> 
                <NavigateNextIcon /> Syllabus
                </label>
            </h2>
            <div className="content">
                {course?.syllabus?.map((each, index) => {
                    return (
                        <div key={index} style={{padding: "10px", margin: 0}}>
                            <p style={{padding: 0, margin: 0}}><strong>Week:</strong> {each["week"]}</p>
                            <p style={{padding: 0, margin: 0}}><strong>Topic:</strong> {each["topic"]}</p>
                            <p style={{padding: 0, margin: 0}}><strong>Content:</strong> {each["content"]}</p>
                            <br />
                        </div>
                    )
                })}
            </div>
            </section>

            </div>
        </div> 
       
        </>
    )
}

export default Course;
