import React, { useState } from "react";
import SocketContext, {socket} from "../context/socket";
import AuthContext from "../context/auth";
import VerticalTabs from "../component/Tabs"
import { Link,Redirect,useHistory  } from "react-router-dom";
import axios from 'axios';
import '../App.css';
const Chat =props => {
    const [message, setMessage] = useState("");
    const [channel, setChannel] = useState("");
    const [notification, setnotification] = useState("");
    const user = JSON.parse(localStorage.getItem("auth"));
    const channelToUseCallback = (channel) => {
        setChannel(channel);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        switch (message.split(' ')[0]) {
            case '/nick':
                const nick = {
                    name: message.split(' ')[1],
                    user: user
                };
                return(
                    
                    socket.emit('nick', nick),
                    setMessage(""),
                    e.target.reset(),
                    socket.on("nickname update", function(data) {
                        if(data.success === "success"){
                            setnotification("Your nickname has been updated");
                            user.username = data.username;
                            localStorage.setItem("auth", JSON.stringify(user));
                        }else{
                            setnotification('Update failed');
                        }
                    })
                )
            case '/create':
                const data = {
                    msg: message.split(' ')[1],
                    user: user
                }
                return(
                    
                    socket.emit('create channel', data),
                    setMessage(""),
                    e.target.reset(),
                    socket.on("add channel", function(msg) {
                        setnotification("You have create " + msg + " channel");
                        socket.emit('join', {
                          channel_name: msg,
                          user: user
                      });
                    })
                )
            case '/join':
                const dataJoin= {
                    channel_name: message.split(' ')[1],
                    user: user,
                }
                return(
                    socket.emit('join', dataJoin),
                    setMessage(""),
                    e.target.reset(),
                    socket.on("joinChannel", function(data) {
                        if(data.success === "success"){
                          setnotification(" You are join channel " + data.channel_name);
                        }else{
                            setnotification('Update ggg failed');
                        }
                    })
                )
            case '/leave':
                const dataLeave= {
                    channel_name: message.split(' ')[1],
                    user: user,
                }
                return(
                    socket.emit('leave', dataLeave),
                    setMessage(""),
                    e.target.reset(),
                    socket.on("leaveChannel", function(data) {
                        if(data.success === "success"){
                            setnotification("You are leave channel " + data.channel_name);
                        }else{
                            setnotification("Channel don't exist");
                        }
                       })
                )
            case '/delete':
            const dataDelete= {
                channel_name: message.split(' ')[1],
                user: user,
            }
            return(
                socket.emit('delete', dataDelete),
                setMessage(""),
                e.target.reset(),
                socket.on("deleteChannel", function(data) {
                    if(data.success === "success"){
                        setnotification("You are delete channel " + data);
                    }else{
                        setnotification("Channel don't exist");
                    }
                })
            )
            case '/users':
                const dataUsers= {
                    channel_name: message.split(' ')[1],
                }
                return(
                    socket.emit('users', dataUsers),
                    setMessage(""),
                    e.target.reset()
                )
            case '/list':
                const dataList= {
                    channel_name: message.split(' ')[1],
                }
                return(
                    socket.emit('list', dataList),
                    setMessage(""),
                    e.target.reset(),
                    socket.on("listChannel", function(data) {
                        if(data.success === "success"){
                            setnotification("channel " + data.channels);
                        }else{
                            setnotification("we have. no channel with this name");
                        }
                    })
                )
            case '/msg':
            const datamsg= {
                message: message,
                user: user
            }
            return(
                socket.emit('msg', datamsg),
                setMessage(""),
                e.target.reset(),
                socket.on("privatemsg", function(data) {
                    if(data.success === "success"){
                        setnotification("msg send");
                    }else{
                        setnotification("msg not send");
                    }
                })
            )
            default:
                if(message !== "" && channel !== ""){ 
                    return(
                        socket.emit('chat', {message: message, channel: channel, username: user.username}),
                        setMessage(""),
                        e.target.reset()
                    )
                }
                
         }
    }
    if(!user){
        return <Redirect to="/login" />
    }
    return (
        <div>
        <AuthContext.Provider value={user}>
            <SocketContext.Provider value={socket}>
                <div className="Chat">
                    <VerticalTabs channelToUse={channelToUseCallback}/>
                    <form onSubmit={handleSubmit}>
                        <input onChange={event => setMessage(event.target.value)} placeholder="Entrez votre message" /><button>Send</button>
                    </form>
                </div>
                <div className="onglet">
                    <p>{notification}</p>
                </div>
            </SocketContext.Provider>
        </AuthContext.Provider>
        </div>
        

    )
}

export default Chat;