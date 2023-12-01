import { useSelector, useDispatch  } from "react-redux";
import { useState, useEffect } from "react";
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { logOut } from "../../redux/UserRedux";
import logo from "./dunder.png";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ProgressBar from "../../components/progressBar/ProgressBar";
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/navbar/Navbar";
import io from 'socket.io-client';

const MyCourses = () => {
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

    const updateLikes = async (courseID, change) => {
        try{
            const config = {
                headers: {
                  'token': `Bearer ${token}`
                }
            };
            const res= await axios.put(`http://localhost:5000/api/course/like/${courseID}/${change}`)
            console.log(res.data["course"])

        } catch(error) {
            if (error.response["status"] === 403 || error.response["status"] === 401) {
            }
        }
    }

    const likeCourseButton = (courseID, currState) => {
        if (socket == null) return;
        console.log(courseID, currState)

        setCoursesList(prevCourses =>
            prevCourses.map(course => {
              if (course.courseID === courseID) {
                return { ...course, isFav: !currState }
              }
                return course
            }
            )
        );
            
        updateLikes(courseID, currState ? -1 : 1);

        console.log(coursesList)
        socket.emit('send-changes', {courseID, currState})
    };

    useEffect(() => {
        if (socket == null) return;
        const applyDeltas = (delta) => {
            console.log(delta)

        }
        socket.on("receive-changes", applyDeltas)
        return () => {
          socket.off("receive-changes")
        }
    }, [socket])
 
    useEffect(() => {
        const getCourses = async () => {
            try{
                const config = {
                    headers: {
                      'token': `Bearer ${token}`
                    }
                };
                const res= await axios.get(`http://localhost:5000/api/course/orders/${userID}`, config)
                console.log(res.data['courses'])

                setCoursesList(res.data['courses'])
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
                filteredItems = coursesList.filter((course) => regexInstructor.test(course.instructor?.toLowerCase()));
            }
            setFilteredCourses(filteredItems);
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
        navigate(`/mycourse/${courseID}`);
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
                    {
                        course.isFav ?
                        (
                            <FavoriteIcon onClick={(e) => likeCourseButton(course.courseID, true)}/>
                        ) : (
                            <FavoriteBorderIcon onClick={(e) => likeCourseButton(course.courseID, false)}/>
                        )
                    }
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
                    Due date: {course.duedate}
                </p>
            </div>

            <div
                style={{
                    display: "flex"
                }}
            >
                <p>
                    Progress: 
                </p>
                <ProgressBar percent={course.progress} />
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
                <InputBase
                    sx={{ ml: 1, flex: 1, variant:"outlined", }}
                    placeholder="Instructor name..."
                    value={searchInstructorValue}
                    onChange={(e)=>handleSearchInstructorInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </div>

        {(searchCourseInput!=="" || searchInstructorInput!=="") && <h3 
        className="reset-text"
        onClick={handleResetClick} style={{padding: "30px 30px 0px 0px", display: "flex", flexDirection: "column", alignItems: "flex-end"}}>RESET</h3>}
        <h3 style={{marginLeft: "10vw"}}>My Courses</h3>
        <div style={{ marginTop:"30px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            
            {renderCourses}
            {filteredCourses?.length===0 && <h2>No courses found...</h2>}
        </div> 
        </>
    )
}

export default MyCourses;
