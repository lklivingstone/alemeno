// const express= require("express")
// const cors= require("cors")
// const app= express()
// const http = require("http");
// const mongoose= require("mongoose")
// require("dotenv/config")

// const authRoute= require("./routes/auth")
// const courseRoute= require("./routes/course")

// app.use(express.json())

// app.use(cors({
//     credentials: true,
//     origin: true
// }))

// mongoose.connect(
//     process.env.DB_CONNECTION
//     ).then(
//         () => console.log("Connected to DB")
//         ).catch(
//             (err)=> {
//                 console.log(err)
//             })


// app.use("/api/auth", authRoute)
// app.use("/api/course", courseRoute)

// const server = http.createServer(app);

// const io = require("socket.io")(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"]
//     }
// });

// io.on("connection", (socket) => {
//     console.log("User connected");
  
//     socket.on("send-changes", (data) => {
//         console.log("Changes received:", data);
//         socket.broadcast.emit("receive-changes", data);
//     });
  
//     socket.on("disconnect", () => {
//         console.log("User disconnected");
//     });
//   });
  

// app.listen(process.env.PORT || 5000, ()=> {
//     console.log("Listening on port: 5000")
// })

const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
require("dotenv/config");

const authRoute = require("./routes/auth");
const courseRoute = require("./routes/course");

const app = express();
const httpServer = http.createServer(app);

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: true
}));

mongoose.connect(process.env.DB_CONNECTION)
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(err));

app.use("/api/auth", authRoute);
app.use("/api/course", courseRoute);

const io = require("socket.io")(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("send-changes", (data) => {
        console.log("Changes received:", data);
        socket.broadcast.emit("receive-changes", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

httpServer.listen(process.env.PORT || 5000, () => {
    console.log("Listening on port: 5000");
});
