import {io} from 'socket.io-client'

const URL =  "https://soda-house-api.onrender.com/";
//s
export const socket = io(URL,{ autoConnect: false });

socket.on("connect_error", (err : any) => {
    if (err.message === "invalid username") {
        console.log("socket failed!, "+err)
    }
  });

export default socket;