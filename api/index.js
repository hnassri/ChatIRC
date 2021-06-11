import connectDB from './config/dbs.js'
import registerRoutes from './routes/registerRoute.js'
import loginRoutes from './routes/loginRoute.js'
import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import {Server} from 'socket.io'
import http from 'http'
import Channel from './model/channelModel.js'
import User from './model/userModel.js'
import { useHistory } from 'react-router-dom'

//connect database
connectDB()


dotenv.config()

const app = express()
const server = app.listen(4243);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});


app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true
    })
);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
app.post('/register', registerRoutes)
app.post('/login', loginRoutes)



const PORT = process.env.PORT || 4242

//Socket connection

io.on('connection', (socket) => {
    console.log('a user connected');
    //JOINTURE
    socket.on('join' , (data) => { 
        console.log(`Socket ${socket.id} join ${data.channel_name.trim()}`); 
        socket.join(data.channel_name.trim()) ; 
     });
    socket.on('nick' , async (data) => {
        try{
            const user = await User.findOne({username: data.user.username});
            if(user){
                await User.findOneAndUpdate({username: data.user.username}, {username: data.name});
                return socket.emit('nickname update', {success: 'success', username: data.name});
            }
            socket.emit('nickname update', {success: 'failed'});
        } catch (e) {
            console.error(e);
        }
        
    });
    socket.on('chat', (msg) => {
        console.log(msg);
     
        io.emit("chat message", msg); 
    });
    socket.on('create channel', async (data) => {
       
          
        try {
            let user = await User.findOne({username:data.user.username});
            let result = await Channel.findOne({ name: data.msg.trim() });
            if(!result) {
                await Channel.create({ user_id:user._id,name:data.msg.trim(),is_deleted:false});
                socket.emit('add channel', data.msg.trim());
            }
        } catch (e) {
            console.error(e);
        }
 
        

             
    });
    socket.on('delete channel', (msg) => {
        io.emit('delete channel', msg); 
    });

});

//Express js listen method to run project on http://localhost:5000
app.listen(PORT, console.log(`App is running in ${process.env.NODE_ENV} mode on port ${PORT}`))

