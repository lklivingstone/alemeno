import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../api/RequestMethods";

import { Link } from "react-router-dom";


const Login = () => {

    const [username, setUsername]= useState("")
    const [password, setPassword]= useState("")
    const dispatch= useDispatch()

    const handleClick = (e) => {
        e.preventDefault()
        login(dispatch, { username, password })
    }

    const handleKeyDown = (e) => {
        if (e.code === "Enter") {
            handleClick(e)
        }
    };

    return (
        <div style={{width: "100%",
            backgroundColor: "#AFCFFD",
            height: "100vh",
            color:"rgb(48, 48, 48)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"}}>
            <div style={{
                width: "50%",
                padding: "20px",
                borderRadius: "7px",
                border: "1px solid rgb(48, 48, 48)"}}>
                <h1 style={{
                    margin: "10px 10px",
                    fontWeight: "200",}}>
                    LOGIN
                </h1>
                <form style={{
                    display: "flex",
                    flexDirection: "column"}}>
                    <input style={{
                        flex: "1",
                        minWidth: "40%",
                        margin: "10px 10px",
                        padding: "10px",}} placeholder="Username" onChange={(e)=>setUsername(e.target.value)}/>
                    <input style={{
                        flex: "1",
                        minWidth: "40%",
                        margin: "10px 10px",
                        padding: "10px",}} placeholder="Password" type="password" onChange={(e)=>setPassword(e.target.value)} 
                        onKeyDown={handleKeyDown}/>
                    <a style={{
                        margin: "5px 10px",
                        fontSize: "12px",
                        textDecoration: "underline",
                        "&:hover": {
                            textDecoration: "none",
                            cursor: "pointer"
                        }}}>Forgot Password</a>
                    <a href="/register" style={{
                        margin: "5px 10px",
                        fontSize: "12px",
                        textDecoration: "underline",
                        color:"rgb(48, 48, 48)",
                        "&:hover": {
                            textDecoration: "none",
                            cursor: "pointer"
                        }}}>Create new account</a>
                </form>
                <div style={{display: "flex", alignItems: "center", flexDirection: "column"}} >
                    <div style={{
                        display:"flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "10px 0px 0px 0px"}}>
                        <button style={{
                            padding: "10px 65px",
                            border: "none",
                            cursor: "pointer",
                            fontFamily: 'Poppins',
                            backgroundColor: "rgb(48, 48, 48)",
                            color: "#edf5e1",
                            "&:disabled" : {
                                color: "#e1e6f5",
                                cursor: "not-allowed"
                            }}} variant="filled" onClick={handleClick}>
                                LOGIN
                        </button>
                     
                    </div>
                    <div style={{
                        display:"flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "10px 0px 0px 0px"}}>
                        <Link to="/register" style={{margin: "5px 10px",
                            fontSize: "17px",
                            textDecoration: "underline",
                            "&:hover": {
                                textDecoration: "none",
                                cursor: "pointer"
                            }, 
                            textDecoration: "none",
                            color:"rgb(48, 48, 48)"}} >
                                Register
                        </Link>
                    </div>
                
                </div>
            </div>
        </div>
    )
}

export default Login
