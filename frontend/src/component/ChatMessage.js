import React, { useState } from "react";
import SocketContext from "../context/socket";

export default function ChatMessage({channel}){
    const socket = React.useContext(SocketContext);
    const [messages, setMessages] = useState([]);
    React.useEffect(() => {
        const getMessages = () => {
            const data = {
                channel: channel
            }
            socket.emit("get chat messages", data);
        }
        socket.on(`messages of ${channel}`, function(msg){
            setMessages(msg);
            let chatMessage = document.getElementById(`chatMessage${channel}`);
            //chatMessage.style.overflow =  "scroll"
            //chatMessage.style.maxHeight =  "93vh"
            chatMessage.scrollIntoView({ behavior: "smooth", block: "end" });
        })
        socket.on(channel, function(data) {
            if(data.success === "success"){
                getMessages();
            }
        });
        getMessages();
    }, []);

    return (
        <ul className="ChatMessage" id={`chatMessage${channel}`}>
            {messages.map((msg, index) => {
                return <li key={index}>{msg.message}</li>
            })}
        </ul>
    )
}