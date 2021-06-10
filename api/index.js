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
    socket.on('chat', (msg) => {
        console.log(msg);
     
        io.emit("chat message", msg); 
    });
    socket.on('create channel', async (msg) => {
        app.post('/create', function(req, res) {
            let user = User.findOne({username:req.username});
            console.log(req.body.username);
                  });
        
        try {
            let result = await Channel.findOne({ name: msg.substr(8) });
            if(!result) {
                await Channel.create({ user_id:'jjjj',name:msg.substr(8),is_deleted:0});
            }
        } catch (e) {
            console.error(e);
        }
        

        io.emit('add channel', msg);     
    });
    socket.on('delete channel', (msg) => {
        io.emit('delete channel', msg); 
    });

});

//Express js listen method to run project on http://localhost:5000
app.listen(PORT, console.log(`App is running in ${process.env.NODE_ENV} mode on port ${PORT}`))

