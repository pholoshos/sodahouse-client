import { notification } from "antd";
import { resolveObjectURL } from "buffer";
import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { Alert, Button, Container, Form, Modal } from "react-bootstrap";
import { makeRandom } from "../util/makeRandom";
import socket from "../util/socket";
import { getMedia } from "../util/webrtc";

const Home: NextPage = () => {
  const [mainAudio, setMainAudio] = useState<any>();
  const [isPlaying, setIsPlaying] = useState(false);

  const [notify, setNotify] = useState({
    message: "Shout Out!",
    description: "",
  });
  const [notifyRecieve, setNotifyRecieve] = useState({
    message: "Shout Out!",
    description: "",
  });
  const [notifyRecieve2, setNotifyRecieve2] = useState({
    message: "Shout Out!",
    description: "",
  });
  const [showInput, setShowInput] = useState(false);
  const [canPlay, setCanPlay] = useState(false);


  const handlePlay = () => {
    mainAudio.pause();
    mainAudio.currentTime = 0;
    mainAudio?.play();
    console.log("LOG::: manual play");
  };

  useEffect(() => {
    document.body.style.backgroundColor = "black";
    const username = makeRandom(18);
    console.log("LOG:::usename", username.toLocaleLowerCase());
    socket.auth = { username };
    socket.connect();
    socket.connected ? console.log("connected") : console.log("not connected!");
    setCanPlay(true)
    
  },);

  useEffect(() => {
      socket.on("recieveAudio", (args: any) => {
        const blob = new Blob([args.audio]);
        const srcBlob = URL.createObjectURL(blob);
        const audio = new Audio(srcBlob);
        setIsPlaying(true);
        setMainAudio(audio);  
      });
  }, []);

  useEffect(() => {
    socket.on("shoutOut", (args: any) => {
      if (args?.description !== notifyRecieve?.description) {
        setNotifyRecieve({
          message: args?.message,
          description: args?.description,
        });
        notification.open({
          message: <p>📢🚨{args.message}</p>,
          description: args?.description,
        });
      }
    });
  }, []);

  useEffect(() => {
    mainAudio?.play();
  }, [mainAudio]);

  const onShoutOut = () => {
    notification.open({
      message: <p>📢🚨{notifyRecieve.message}</p>,
      description: notifyRecieve?.description,
    });
  };

  const hanldeShoutOut = () => {
    socket.emit("shoutOut", {
      message: notify.message,
      description: notify.description,
    });

    notification.open({
      message: <p>🤩🚀Shout Out sent!!</p>,
    });
  };

  return (
    <div style={{ background: "black", color: "white", textAlign: "center" }}>
      <br />
      <h1>SodaHouse Radio</h1>

      <p>Listen to some fine tunes</p>
      {(isPlaying && (
        <>
          <img
            height={250}
            onClick={handlePlay}
            src={
              "https://media2.giphy.com/media/TqsLxad921AYMHmLXg/giphy-downsized-large.gif"
            }
          ></img>
          <br></br>
          <small style={{ color: "blue" }}>10 people Listening</small>
          <h3>Now Listening.. .</h3>
          <p>[Press here to Play if audio not playing]</p>
          <Button onClick={() => setShowInput(true)}>Shout Out</Button>

          <Modal show={showInput} onHide={() => setShowInput(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Shout Out!!!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Control
                  onChange={({ target }) =>
                    setNotify({ ...notify, description: target.value })
                  }
                  placeholder="something for the people listening.."
                ></Form.Control>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowInput(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={hanldeShoutOut}>
                Share
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )) || (
        <>
          <img
            height={250}
            src={
              "https://miro.medium.com/max/1400/1*e_Loq49BI4WmN7o9ItTADg.gif"
            }
          ></img>
          <h3>Please Wait ...</h3>
        </>
      )}
    </div>
  );
};

export default Home;
