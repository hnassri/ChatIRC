import React, { useState } from "react";
import SocketContext, {socket} from "../context/socket";
import VerticalTabs from "../component/Tabs"
import { Link,Redirect,useHistory  } from "react-router-dom";
import axios from 'axios';
const Chat =props => {
    const [message, setMessage] = useState();
    const [channel, setChannel] = useState();
    const { username, password} =
    (props.location && props.location.state) || {};
    console.log({password});
    const handleSubmit = (e) => {
        e.preventDefault();
    
      /*if(message == "/join"){
            
            socket.emit('chat', message),
            setMessage(""),
            e.target.reset()
        }*/
        
        switch (true) {
            case /^\/create\s.+/.test(message):
                return(
                    socket.emit('create channel', message),
                    setMessage(""),
                    e.target.reset()
                )
            default:
                if(message !== ""){ 
                    return(
                        socket.emit('chat', message),
                        setMessage(""),
                        e.target.reset(),
                        axios.post(`http://127.0.0.1:4242/create`, username)
                        .then(res => {
                        console.log(res.data.greeting);
                    
                        })
                    )
                }
                
         }
    }

    
    
    return (
        <SocketContext.Provider value={socket}>
            <div className="Chat">
                <VerticalTabs />
                <form onSubmit={handleSubmit}>
                    <input onChange={event => setMessage(event.target.value)} placeholder="Entrez votre message" /><button>Send</button>
                </form>
            </div>
        </SocketContext.Provider>
    )
}

export default Chat;