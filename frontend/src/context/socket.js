import React from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:4243";

export const socket = socketIOClient(ENDPOINT);
const SocketContext = React.createContext(socket);
export default SocketContext;