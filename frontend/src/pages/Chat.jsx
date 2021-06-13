import React, { useState } from "react";
import SocketContext, {socket} from "../context/socket";
import AuthContext from "../context/auth";
import VerticalTabs from "../component/Tabs"
import { Link,Redirect,useHistory  } from "react-router-dom";
import axios from 'axios';
const Chat =props => {
    const [message, setMessage] = useState();
    const [channel, setChannel] = useState();
    const user = JSON.parse(localStorage.getItem("auth"));
    const handleSubmit = (e) => {
        e.preventDefault();
    
      /*if(message == "/join"){
            
            socket.emit('chat', message),
            setMessage(""),
            e.target.reset()
        }*/
        switch (message.split(' ')[0]) {
            case '/nick':
                const nick = {
                    name: message.split(' ')[1],
                    user: user
                };
                return(
                    
                    socket.emit('nick', nick),
                    setMessage(""),
                    e.target.reset()
                )
            case '/create':
                const data = {
                    msg: message.split(' ')[1],
                    user: user
                }
                return(
                    
                    socket.emit('create channel', data),
                    setMessage(""),
                    e.target.reset()
                )
            case '/join':
                const dataJoin= {
                    channel_name: message.split(' ')[1],
                    user: user,
                }
                return(
                    socket.emit('join', dataJoin),
                    setMessage(""),
                    e.target.reset()
                )
                case '/leave':
                    const dataLeave= {
                        channel_name: message.split(' ')[1],
                        user: user,
                    }
                    return(
                        socket.emit('leave', dataLeave),
                        setMessage(""),
                        e.target.reset()
                    )
                    case '/delete':
                    const dataDelete= {
                        channel_name: message.split(' ')[1],
                        user: user,
                    }
                    return(
                        socket.emit('delete', dataDelete),
                        setMessage(""),
                        e.target.reset()
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
                                e.target.reset()
                            )
            default:
                if(message !== ""){ 
                    return(
                        socket.emit('chat', message),
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
        <AuthContext.Provider value={user}>
            <SocketContext.Provider value={socket}>
                <div className="Chat">
                    <VerticalTabs />
                    <form onSubmit={handleSubmit}>
                        <input onChange={event => setMessage(event.target.value)} placeholder="Entrez votre message" /><button>Send</button>
                    </form>
                </div>
                <div>
                </div>
            </SocketContext.Provider>
        </AuthContext.Provider>

    )
}

export default Chat;