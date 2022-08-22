import socket from "./socket";
const timeRate = 1000;

const constraints = {
    'video': false,
    'audio': true
}

let isRecording1 = false;
let isSending = false;

export const getMedia  = async()  =>  {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const mediaRecorder = new MediaRecorder(stream);
            //mediaRecorder.start();

            let audioChunks = [];
            mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
                sendData(audioChunks);
                audioChunks = [];
            });

            mediaRecorder.addEventListener("stop", () => {

            });

            setInterval(()=>{
                mediaRecorder.start();
                isRecording1 = true;
                setTimeout(() => {

                    mediaRecorder.stop();
                },6996);
            },7000)
        });
}

export const getMedia2  = async()  =>  {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const mediaRecorder = new MediaRecorder(stream);
            //mediaRecorder.start();

            let audioChunks = [];
            mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
                sendData(audioChunks);
                audioChunks = [];
            });

            mediaRecorder.addEventListener("stop", () => {

            });
            
            setInterval(()=>{
                setTimeout(()=>{},7000)
                mediaRecorder.start();
                setTimeout(() => {

                    mediaRecorder.stop();
                },6996);
            },7000)
        });
}

const sendData  = (data)=>{
    const audioBlob = new Blob(data);
    const audioUrl = URL.createObjectURL(audioBlob);
    socket.emit("sendAudio",{audio:audioBlob});
    return audioUrl;
}
