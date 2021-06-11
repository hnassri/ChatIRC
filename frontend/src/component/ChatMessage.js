import React, { useState } from "react";
import SocketContext from "../context/socket";

export default function ChatMessage(props){
    const socket = React.useContext(SocketContext);
    const [messages, setMessages] = useState([]);
    React.useEffect(() => {
        socket.on("chat message", function(msg) {
            setMessages(messages => [...messages, msg]);
        });
        socket.on("add channel", function(msg) {
         alert(msg);
        });
        socket.on("nickname update", function(data) {
            if(data.success === "success"){
                alert("Your nickname has been updated");
                const user = JSON.parse(localStorage.getItem("auth"));
                user.username = data.username;
                localStorage.setItem("auth", JSON.stringify(user));
            }else{
                alert('Update failed');
            }
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