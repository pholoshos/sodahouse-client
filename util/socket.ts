import {io} from 'socket.io-client'

const URL =  "ws://localhost:3015";

export const socket = io(URL,{ autoConnect: false });

socket.on("connect_error", (err) => {
    if (err.message === "invalid username") {
        console.log("socket failed!, "+err)
    }
  });

export default socket;