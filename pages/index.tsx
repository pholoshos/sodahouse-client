import { notification } from "antd";
import { resolveObjectURL } from "buffer";
import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { Alert, Button, Container, Form, Modal } from "react-bootstrap";
import { makeRandom } from "../util/makeRandom";
import socket from "../util/socket";
import { getMedia } from "../util/webrtc";
const { Howl, Howler } = require("howler");

const Home: NextPage = () => {
  const [mainAudio, setMainAudio] = useState<any>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [users, setUsers] = useState("🧑🏾‍💻🤨 we getting number of listeners");
  const audioRef = useRef<any>(null);

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
    var sound = new Howl({
      format: ['ogg'],
      html5: true,
      src: [mainAudio?.src],
    });

    sound.play();
  };

  const manual = () => {
    var sound = new Howl({
      src: ['/test.mp3'],
      html5: true,
    });
    sound.play();
  };

  useEffect(() => {
    document.body.style.backgroundColor = "black";
    const username = makeRandom(18);
    socket.auth = { username };
    socket.connect();
    socket.connected ? console.log("connected") : console.log("not connected!");
    setCanPlay(true);
  });

  useEffect(() => {
    socket.on("recieveAudio", (args: any) => {
      const blob = new Blob([args.audio]);
      const srcBlob = URL.createObjectURL(blob);
      const audio = new Audio(srcBlob);
      setIsPlaying(true);
      setMainAudio(audio);
    });

    socket.on("users", (args: any) => {
      console.log("LOG:::users", args.users);
      setUsers("😎 " + args.users + " people listening");
    });
  }, []);

  useEffect(() => {
    socket.on("shoutOut", (args: any) => {
      if (args?.description !== notifyRecieve?.description) {
        setNotifyRecieve({
          message: args?.message,
          description: args?.description,
        });
        notification.destroy("not");
        notification.open({
          message: <p>📢🚨{args.message}</p>,
          description: args?.description,
          key: "not",
        });
      }
    });
  }, []);

  useEffect(() => {
    var sound = new Howl({
      format: ['ogg'],
      src: [mainAudio?.src],
      html5: true,
    });
    sound.play();
  }, [mainAudio]);

  const onShoutOut = () => {
    notification.destroy();
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
    setShowInput(false);
  };

  return (
    <div style={{ background: "black", color: "white", textAlign: "center" }}>
      <br />
      <h1>🥤SodaHouse Radio</h1>

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
          <small style={{ color: "blue" }}>{users}</small>
          <h3>🎧Now Listening.. .</h3>
          <p onClick={manual}>[Press here to Play if audio not playing]</p>
          <Button onClick={() => setShowInput(true)}>📢🔥Shout Out</Button>

          <Modal show={showInput} onHide={() => setShowInput(false)}>
            <Modal.Header closeButton>
              <Modal.Title>📢🔥Shout Out!!!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Control
                  onChange={({ target }) =>
                    setNotify({ ...notify, description: target.value })
                  }
                  placeholder="🌎📻😀something for the people listening.."
                ></Form.Control>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowInput(false)}>
                😭🚶🏻Cancel
              </Button>
              <Button variant="primary" onClick={hanldeShoutOut}>
                📢😀Share
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
          <h3>🥺🙏🏻Please Wait ...</h3>
        </>
      )}
      <Button
        variant="secondary"
        style={{ marginLeft: 10 }}
        onClick={() => {
          setMainAudio(null);
          manual();
          setIsPlaying(false);
        }}
      >
        😀🧨🚀Test Radio!
      </Button>
    </div>
  );
};

export default Home;
