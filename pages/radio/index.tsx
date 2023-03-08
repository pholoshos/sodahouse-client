import { resolveObjectURL } from "buffer";
import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import socket from "../../util/socket";
import { getMedia } from "../../util/webrtc";

interface IMessage {
  username?: string;
  text?: string;
  time?: string;
}
interface IUserData {
  final?: {
    username?: string;
  };
  pre?: {
    username?: string;
  };
}

const Home: NextPage = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [message, setMessage] = useState<string>("Hello");
  const [recieved, setRecieved] = useState<IMessage>({});
  const [user, setUser] = useState({ host: "", key: "" });
  const [userDetails, setDetails] = useState<IUserData>({});
  let myRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState("");
  const [audio, setAudio] = useState("");
  const hosts = [
    { host: "pholosho", key: "l0vesod@" },
    { host: "other", key: "l0vesod@" },
  ];

  const [isAuthed, setIsAuthed] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  //console.log("LOG::: ref ",myRef?.current?.value);

  const record = () => {
    getMedia();
  };

  const onLogin = () => {
    const isTrue = !!hosts.find(
      (host) => host.host === user.host && host.key === user.key
    );
    setIsAuthed(isTrue);
  };

  const handleSendMessage = () => {
    const data = {
      text: " " + message,
      username: userDetails?.final?.username,
      time: Date.now().toString(),
    };
    setMessages([...messages, { ...data, username: "you" }]);
    socket.emit("sendMessage", data);
  };

  useEffect(() => {
    const username = user.host;
    socket.auth = { username };
    socket.connect();
    socket.connected ? console.log("connected") : console.log("not connected!");
  });

  useEffect(() => {
    socket.on("hasMessage", (args: any) => {
      setRecieved(args);
    });
    socket.on("recieveImage", (args: any) => {
      const blob = new Blob([args.image]);
      const srcBlob = URL.createObjectURL(blob);
      setImage(srcBlob);
    });
  }, []);

  useEffect(() => {
    const txts = messages.map((m: any) => m?.text);
    if (!txts.includes(recieved)) {
      setMessages([...messages, recieved]);
      //console.log("LOG:::current Messages", messages)
    }
  }, [recieved]);
  return (
    <>
      {(isAuthed && (
        <>
          <h1>SodaHouse</h1>
          <Alert variant={isRecording ? "success" : "warning"}>
            {isRecording ? "on air!" : "offline"}
          </Alert>

          <Button
            disabled={isRecording}
            onClick={() => {
              setIsRecording(true);
              record();
            }}
          >
            Start Broadcasting .
          </Button>

          <Button
            onClick={() => {
              setIsRecording(false);
            }}
          >
            Stop Broadcasting .
          </Button>
          <audio autoPlay src={audio}></audio>
        
        </>
      )) || (
        <>
          <br></br>
          <h1>Welcome to sodahouse</h1>
          <p>Enter details below</p>

          <Form>
            <Form.Label>Host name</Form.Label>
            <Form.Control onChange={({target})=>setUser({...user,host:target.value})} placeholder="host name here"></Form.Control>

            <Form.Label>Radio Key</Form.Label>
            <Form.Control onChange={({target})=>setUser({...user,key:target.value})}  placeholder="Enter key"></Form.Control>
            <br></br>
            <Button onClick={onLogin} variant="outline-success">Lets go</Button>
          </Form>
        </>
      )}
    </>
  );
};

export default Home;
