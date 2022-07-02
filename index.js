const http=require("http");
const express=require("express");
const app=express();
const cors=require("cors");
const {Server}=require("socket.io");
const path=require('path');

const users=[{}];
app.use(cors()); 
const port=process.env.PORT || 4500;

app.use(express.static(path.join(__dirname,'build')));

app.get("/",(req,res)=>{
    res.send("hello");
})


const server=http.createServer(app);
const io=new Server(server ,{
    cors:{

        origin:"http://localhost:4500",
        methods:["GET","POST"]
    }, 
})
io.on("connection",(socket)=>{
    console.log("new connection");
    socket.on('joined',({user})=>{
        users[socket.id]=user;
        console.log(`${user} has joined `);
        socket.broadcast.emit('userJoined',{user:"Admin",message:`${users[socket.id]} has joined`})

        socket.emit('welcome',{user:"Admin",message:`welcome  ${users[socket.id]} to the chat`})
       
    })
    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id});

    })
    socket.on('disconnect',()=>{
        socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]} has left`})
        console.log("user left");
    })
})

server.listen(port,()=>{
    console.log(`server listen at http://localhost:${port}`);
})