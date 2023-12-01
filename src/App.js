import './App.css';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Logout from './pages/logout/Logout';
import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux';
import { changeSocket } from './redux/UserRedux';
import io from 'socket.io-client';
import Course from './pages/course/Course';
import MyCourses from './pages/myCourses/MyCourses';
import MyCourse from './pages/myCourse/MyCourse';

function App() {
  // const [socket, setSocket] = useState(null);
  // const dispatch = useDispatch();
  const user= useSelector((state)=>state.user.user_id)

  // useEffect(() => {
    
  // }, [])

  console.log(user)

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element= { user ? <Home /> : <Navigate to="/login" replace /> } />
        <Route path="/login" element= {user ? <Navigate to="/" replace /> :  <Login />} />
        <Route path="/logout" element= {user ? <Logout /> : <Navigate to="/login" replace />} />
        <Route path="/register" element= {user ? <Navigate to="/" replace /> :  <Register />} />
        <Route path="/course/:id" element= {user ? <Course /> : <Navigate to="/login" replace /> } />
        <Route path="/mycourses" element= {user ? <MyCourses /> : <Navigate to="/login" replace /> } />
        <Route path="/mycourse/:id" element= {user ? <MyCourse /> : <Navigate to="/login" replace /> } />
        {/* <Route path="/product/:id" element= {<SingleProduct />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
