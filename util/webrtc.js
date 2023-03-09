import socket from "./socket";
const timeRate = 1000;

const constraints = {
    video: false,
    audio: {
        sampleRate: 22050,
        channelCount: 1,
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
    },
}

let isRecording1 = false;
let isSending = false;

export const getMedia = async () => {
    navigator.mediaDevices.getUserMedia(constraints)
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

            setInterval(() => {

                mediaRecorder.start();
                setTimeout(() => {
                    mediaRecorder.stop();
                }, 19997);
            }, 20000)
        });
}

const sendData = (data) => {
    const audioBlob = new Blob(data);
    const audioUrl = URL.createObjectURL(audioBlob);
    socket.emit("sendAudio", { audio: audioBlob });
    return audioUrl;
}
