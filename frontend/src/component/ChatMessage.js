import React, { useState } from "react";
import SocketContext from "../context/socket";

export default function ChatMessage({channel}){
    const socket = React.useContext(SocketContext);
    const [messages, setMessages] = useState([]);
    React.useEffect(() => {
        socket.on(channel, function(msg) {
            setMessages(messages => [...messages, msg]);
        });
    }, []);

    return (
        <ul className="ChatMessage">
            {messages.map((msg, index) => {
                return <li key={index}>{msg}</li>
            })}
        </ul>
    )
}