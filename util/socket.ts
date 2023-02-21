import {io} from 'socket.io-client'

const URL =  "ws://sodalabs-production.up.railway.app/";
//s
export const socket = io(URL,{ autoConnect: false });

socket.on("connect_error", (err : any) => {
    if (err.message === "invalid username") {
        console.log("socket failed!, "+err)
    }
  });

export default socket;