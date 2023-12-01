import { useSelector, useDispatch  } from "react-redux";
import { useState, useEffect } from "react";
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import { logOut } from "../../redux/UserRedux";
import logo from "./dunder.png";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ProgressBar from "../../components/progressBar/ProgressBar";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/navbar/Navbar";
import io from 'socket.io-client';

const Home = () => {
    const token = useSelector((state) => state.user.token);
    console.log(token)    
    const userID = useSelector((state) => state.user.user_id);
    const dispatch= useDispatch()

    const [coursesList, setCoursesList]= useState([]);
    const [filteredCourses, setFilteredCourses]= useState([]);
    const [searchCourseInput, setSearchCourseInput] = useState("");
    const [searchCourseValue, setSearchCourseValue]= useState("");
    const [searchInstructorInput, setSearchInstructorInput] = useState("");
    const [searchInstructorValue, setSearchInstructorValue]= useState("");
    const [socket, setSocket] = useState(null)
 
    useEffect(() => {
        const getCourses = async () => {
            try{
                const config = {
                    headers: {
                      'token': `Bearer ${token}`
                    }
                };
                const res= await axios.get(`http://localhost:5000/api/course/`, config)
                console.log(res.data["course"])

                setCoursesList(res.data['course'])
                // setCoursesList(res)
            } catch(error) {
                if (error.response["status"] === 403 || error.response["status"] === 401) {
                    dispatch(logOut())
                }
            }
        }
        getCourses();
        const io_socket = io.connect("http://localhost:5000");

        setSocket(io_socket);
        return () => {
          io_socket.disconnect();
        }
    }, [])

    useEffect(() => {
        if (socket == null) return;
        const applyDeltas = (delta) => {
            console.log(delta)
            const { courseID, currState } = delta;

            setCoursesList(prevCourses =>
                prevCourses.map(course => {
                  if (course._id === courseID) {
                    return { ...course, likes : currState ? course.likes - 1 : course.likes + 1 }
                  }
                    return course
                }
                ))
            // setEditorValue((prevEditorValue) => {
                
            // });
        }
        socket.on("receive-changes", applyDeltas)
        return () => {
          socket.off("receive-changes")
        }
    }, [socket])
    
    useEffect(() => {
        const setCourses = () => {
            setFilteredCourses(coursesList)
        }
        setCourses();
    }, [coursesList])

    const handleSearchCourseInput= (data) => {
        setSearchCourseValue(data)
        setSearchCourseInput(data)
    }
  
    const handleSearchInstructorInput= (data) => {
        setSearchInstructorValue(data)
        setSearchInstructorInput(data)
    }

    const handleSearchClick = (e) => {
            const queryCourse = searchCourseInput?.toLowerCase();
            const queryInstructor = searchInstructorInput?.toLowerCase();
            const regexCourse = new RegExp(queryCourse, 'i');
            const regexInstructor = new RegExp(queryInstructor, 'i');

            let filteredItems = coursesList;

            if (searchCourseValue !== "") {
                filteredItems = coursesList.filter((course) => regexCourse.test(course.name?.toLowerCase()));
            }
            if (searchInstructorValue !== "") {
                filteredItems = filteredItems.filter((course) => regexInstructor.test(course.instructor?.toLowerCase()));
            }
            setFilteredCourses(filteredItems);
        // }
    };

    const handleResetClick = async (e) => {
        setSearchInstructorInput("")
        setSearchInstructorValue("")
        setSearchCourseInput("")
        setSearchCourseValue("")

        handleSearchClick(e);
        setFilteredCourses(coursesList)
      };

    const handleKeyDown = (e) => {
        if (e.code === "Enter") {
            handleSearchClick(e)
        }
    };

    const navigate = useNavigate();

    const redirectCourse = (courseID) => {
        console.log("REDIRECT")
        // redirect(`course/${courseID}`);
        navigate(`/course/${courseID}`);
    }


    // const handleCardClick = (courseID) => {
    //     // Redirect to the "/course/courseID" route
    // };

    const likeCourseButton = (e) => {
        e.preventDefault();
        console.log(e)
    }

    const renderCourses = filteredCourses?.map((course) => (
        <Card
        style={{backgroundColor: "#FFF3F3"}}
        key={course._id} sx={{ width: "80%", height: "30vh", padding: "10px", margin: "20px", display: "flex", justifyContent: "space-between", flexDirection: "column"}}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between"
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "flex-start"
                    }}
                >
                    <img style={{cursor: "pointer"}} onClick={() => redirectCourse(course._id)}  src={logo} alt="" width="80px" height="80px" />
                    <CardHeader
                    style={{cursor: "pointer"}}
                        onClick={() => redirectCourse(course._id)} 
                        title= {course.name}
                    />
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        index: "10",
                        cursor: "pointer"
                    }}
                >
                    <FavoriteIcon /> {course.likes}
                </div>
            </div>
            <div
                onClick={() => redirectCourse(course._id)} 
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    cursor: "pointer"
                }}
            >
                <p>
                    Instructor: {course.instructor}
                </p>
                <p>
                    Duration: {course.duration}
                </p>
            </div>

            <div
                style={{
                    display: "flex"
                }}
            >
                <p>
                    Schedule: {course.schedule}
                </p>
            </div>
        </Card>
    ));


    return (
        <>
        <Navbar />
        <div 
        style={{width: "90vw", display: "flex", justifyContent: "flex-end", alignItems: "flex-end"}}
        >
            <div 
            style={{width: "60%", display: "flex", justifyContent: "flex-end", padding: "10px 40px", alignItems: "flex-end"}}
            >

                <IconButton type="button" aria-label="search">
                    <SearchIcon 
                    className="search-icon" 
                    onClick={(e)=>handleSearchClick(e)}
                    onKeyDown={handleKeyDown}
                    />
                </IconButton>
                
                <InputBase
                    sx={{ ml: 1, flex: 1, variant:"outlined", }}
                    placeholder="Course name..."
                    value={searchCourseValue}
                    onChange={(e)=>handleSearchCourseInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                {/* </div> */}
                {/* <div className="search-bar"> */}
                <InputBase
                    sx={{ ml: 1, flex: 1, variant:"outlined", }}
                    placeholder="Instructor name..."
                    value={searchInstructorValue}
                    onChange={(e)=>handleSearchInstructorInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                {/* </div> */}
            </div>
        </div>

        {(searchCourseInput!=="" || searchInstructorInput!=="") && <h3 
        className="reset-text"
        onClick={handleResetClick} style={{padding: "30px 30px 0px 0px", display: "flex", flexDirection: "column", alignItems: "flex-end"}}>RESET</h3>}
        <h3 style={{marginLeft: "10vw"}}>Courses</h3>
        <div style={{ marginTop:"30px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            {renderCourses}
            {filteredCourses?.length===0 && <h2>No courses found...</h2>}
        </div> 
        </>
    )
}

export default Home;
