import "./Navbar.css";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
    const navigate = useNavigate();

    return (
        <>
        <nav className='navbar' style={{ display: "flex", padding: "20px"}}>
            <div onClick={(e) => navigate("/")} style={{cursor: "pointer", display: "flex", flex: 1, justifyContent: "flex-start", padding: "10px 40px"}}>
                <h1 style={{backgroundColor: "rgb(48, 48, 48)", color: "#ffe5ec"}}>dobby-ads.</h1>
            </div>
            <a
            href="/mycourses"
            style={{
                color: "rgb(48, 48, 48)",
                textDecoration: "none",
                paddingRight: "20px"
            }}
            >
                My Courses
            </a>
            <a 
            href="/logout"
            style={{
                color: "rgb(48, 48, 48)",
                textDecoration: "none",
                paddingRight: "20px"
            }}
            >
                <p>
                LOGOUT    
                </p>
            </a> 
            <div className="border"></div>
        </nav>  
        </>
    )
}

export default Navbar;