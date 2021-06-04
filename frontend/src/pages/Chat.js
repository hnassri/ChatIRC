import React, { useState } from "react";
import SocketContext, {socket} from "../context/socket";
import VerticalTabs from "../component/Tabs"

function Chat (){
    const [message, setMessage] = useState();
    const handleSubmit = (e) => {
        e.preventDefault();
        if(message !== ""){
            socket.emit('chat', message);
            setMessage("");
            e.target.reset()
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