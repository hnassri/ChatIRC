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
import JoinChannel from './model/joinchannelModel.js'
import User from './model/userModel.js'
import Message from './model/messageModel.js'
import PrivateMsg from './model/privatemsgModel.js'

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
    socket.on('join' ,async (data) => { 
        try{
            const room = await Channel.findOne({name: data.channel_name.trim()});
            const user = await User.findOne({username: data.user.username});
            if(room && user ){
                const join= await JoinChannel.findOne({user_id: user._id, channel_id:room._id})
                if(!join){
                    const joinChannel = await JoinChannel.create({user_id: user._id , channel_id: room._id});
                    if(joinChannel){
                        console.log(`Socket ${socket.id} join ${data.channel_name.trim()}`); 
                        socket.join(data.channel_name.trim()) ;
                        return socket.emit('joinChannel', {
                            success: 'success',
                            channel_name: data.channel_name.trim()
                        });
                    }
                    
                }
            }
            socket.emit('joinChannel', {success: 'failed'});
        } catch (e) {
            console.error(e);
        }
     });
     socket.on('leave' ,async (data) => { 
       
        try{
            const room = await Channel.findOne({name: data.channel_name.trim()});
            const user = await User.findOne({username: data.user.username});
            const join= await JoinChannel.findOne({user_id: user._id,channel_id:room._id})
            if(join){
                        await JoinChannel.findOneAndRemove({user_id: user._id,channel_id:room._id});
                        console.log(`Socket ${socket.id} leave ${data.channel_name.trim()}`); 
                        socket.leave(data.channel_name.trim()) ; 
                        return socket.emit('leaveChannel', {success: 'success', channel_name: data.channel_name.trim()});      
            }

            socket.emit('leaveChannel', {success: 'failed'});
        } catch (e) {
            console.error(e);
        }
     });
     socket.on('delete' ,async (data) => { 
       
        try{
            const user = await User.findOne({username: data.user.username});
            const room = await Channel.findOne({name: data.channel_name.trim(),user_id:user._id});
            const join= await JoinChannel.findOne({user_id: user._id,channel_id:room._id})
            if(room){
                        await Channel.findOneAndRemove({name: data.channel_name.trim(),user_id:user._id});
                        await JoinChannel.findOneAndRemove({channel_id:room._id})
                        console.log(`Socket delete ${data.channel_name.trim()}`); 
                        return socket.emit('deleteChannel', {success: 'success', channel_name: data.channel_name.trim()});      
            }

            socket.emit('deleteChannel', {success: 'failed'});
        } catch (e) {
            console.error(e);
        }
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
    socket.on('get channels' , async (data) => {
        try{
            const user = await User.findOne({username: data.username});
            if(user){
                const channelsJoined = await JoinChannel.find({ user_id: user._id }).exec();
                const channels_name = [];
                for(let i = 0; i < channelsJoined.length; i++){
                    const element = channelsJoined[i];
                    const channel = await Channel.findById(element.channel_id).exec();
                    if(channel){
                        channels_name.push(channel.name);
                        socket.join(channel.name);
                    } 
                }
                return socket.emit('channels joined', {success: 'success', channels: channels_name});
            }
            socket.emit('channels joined', {success: 'failed'});
        } catch (e) {
            console.error(e);
        }
        
    });
    socket.on('chat', async (data) => {
        const user = await User.findOne({username: data.username.trim()});
        const channel = await Channel.findOne({name: data.channel.trim()});
        if(user && channel){
            
            const msg = `${data.username} : ${data.message}`;
            const message = await Message.create({
                user_id: user._id,
                channel_id: channel._id,
                message: msg
            });
            if(message){
                console.log("message créé");
                io.to(data.channel).emit(data.channel, {success: "success"}); 
            }
            
        }
        
    });
    socket.on('get chat messages', async (data) => {
        const channel = await Channel.findOne({name: data.channel.trim()});
        if(channel){
            const messages = await Message.find({channel_id: channel._id});
            io.to(data.channel).emit(`messages of ${data.channel}`, messages); 
        }
        
    });
    socket.on('msg', async (msg) => {
      const l=msg.message.substr(5);
      const h=l.split(' ')[0];
     const longueur =h.length+1;
    const word=l.substr(longueur);
    try{
        const user = await User.findOne({username:h});
        console.log(user)
            if(user){
                const users = await User.findOne({username: msg.user.username});
                 await PrivateMsg.create({scender_id: user._id,message:word,receiver_id:users._id});
                return socket.emit('privatemsg', {success: 'success'});
            }
            socket.emit('privatemsg', {success: 'failed'});
    }catch(e){
        console.log(e);
    }
     
    });


//list channel
    socket.on('list', async (msg) => {

try{
        let channel = await Channel.find({});
        channel.forEach(function(col) {
            // Do something with each collection.
            if(col.name.includes(msg.channel_name.trim())){
                console.log(col.name)
                return socket.emit('listChannel', {success: 'success', channels: col.name}); 
            }       
        
        });
        socket.emit('listChannel', {success: 'failed'}); 
    }catch (e) {
        console.error(e);
    }
    });
    socket.on('create channel', async (data) => {
       
          
        try {
            let user = await User.findOne({username:data.user.username});
            let result = await Channel.findOne({ name: data.msg.trim() });
            if(!result && user) {
                await Channel.create({
                    user_id: user._id,
                    name: data.msg.trim(),
                    is_deleted: false
                });
                socket.emit('add channel', data.msg.trim());
            }
        } catch (e) {
            console.error(e);
        }
 
        

             
    });


});

//Express js listen method to run project on http://localhost:5000
app.listen(PORT, console.log(`App is running in ${process.env.NODE_ENV} mode on port ${PORT}`))

