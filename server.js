require('dotenv').config();
const { log } = require('console');
const express = require("express");
const http = require("http");
const https = require("https");
const app = express();
const fs = require('fs');
const path = require('path');

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
} else {
  app.use(express.static(__dirname));
}

const mongoose = require('mongoose')
const cors = require('cors')

let server;

// Use HTTPS in development, HTTP in production (hosting providers handle SSL)
if (process.env.NODE_ENV === 'production') {
  server = http.createServer(app);
} else {
  const key = fs.readFileSync('cert.key');
  const cert = fs.readFileSync('cert.crt');
  server = https.createServer({key, cert}, app);
}

const socket = require("socket.io");
const UserModel = require('./models/user');

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

app.post('/register', (req, res)=>{
    UserModel.create(req.body).
    then(user => res.json(user))
    .catch(err => res.json(err))
    console.log("user created successfulyy\n");
    
})

app.post('/login', async(req, res)=>{
    const {email} = req.body;
    UserModel.findOne({email: email})
    .then(user => {
        if(user){
            res.json("Success")
        } else{
            res.json("The email does not exist in our database")
        }
    })
})

async function getUsernameByEmail(email){
    let userName = "unknown";
    await UserModel.findOne({email: email})
    .then(user => {
        if(user){
            console.log("user, ", user.name);
            userName = user;
        }
    })

    return userName;
}

const io = socket(server, {
    cors: {
        origin: [
            // "https://localhost",
            // "https://192.168.29.188"
            "*"
        ],
        methods:["GET", "POST"]
    }
});

const users = {};

const socketToRoom = {};
const socketToEmail = {};

io.on('connection', socket => {
    console.log("user joined");
    socket.on("join room", roomID => {
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 4) {
                socket.emit("room full");
                return;
            }
            users[roomID].push(socket.id);
            console.log("user joining in live room");
            console.log("currnt user: ", socket.id);
            
            console.log("users, ", users);
            
        } else {
            console.log("user created room");
            users[roomID] = [socket.id];
            console.log("users, ", users);

        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

        socket.emit("all users", usersInThisRoom);

        
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });


    socket.on("send message", ({ roomID, message }) => {
        console.log("67)roomiID: ", roomID, " message: ", message);
        console.log("68)from sockteid: ", socket.id);
        const from = socket.id;
        console.log("70)users, ", users);
        console.log("users[roomID]: ", users[roomID]);
        
        users[roomID].forEach(async userSocketId => {
            if(userSocketId!=socket.id){

                const fromInEmail = socketToEmail[from];
                console.log("from in mail: ", fromInEmail);
                
                const fromInName = await getUsernameByEmail(fromInEmail)
                console.log("from: ", from , " in name: ", fromInName);
                
                io.to(userSocketId).emit('receive message', {from: fromInEmail||"Unknown", message});
                
            }
        });
    });


    function removeSocketIdFromRoom(){
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }

        console.log("emitting all userd to say good bye to ", socket.id);
        console.log("usersinthis rrooom: ", users[roomID], "\n");
        
        if(users[roomID]){
            users[roomID].forEach(userSocketId => {
                io.to(userSocketId).emit('remove user', socket.id);
            });
        }
    }

    socket.on('leave room', ()=>{
        console.log(`${socket.id} wants to leave\n`);
        
        removeSocketIdFromRoom();
    })

    socket.on('tell everyone that i arrived', async({email, roomID}) => {
        console.log("email: ", email);
        socketToEmail[socket.id] = email;
        console.log('ste: ', socketToEmail);
        
        if(users[roomID]){
            const user = await getUsernameByEmail(email);
            users[roomID].forEach(userSocketId => {
                console.log(user, "slsl");
                
                io.to(userSocketId).emit('user broadcasting his name', email||"unknown");
            });
        }
    })


    socket.on('disconnect', () => {
        removeSocketIdFromRoom();
        console.log(`${socket.id} removed from ${socketToRoom[socket.id]}\n`);
        console.log("user in 99 server: ", users);
    });

});

// In production, serve the React app for any unknown paths
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 8181;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));