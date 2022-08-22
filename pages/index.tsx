import { resolveObjectURL } from 'buffer';
import type { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import { Alert, Button, Container, Form } from 'react-bootstrap'
import socket from '../util/socket'
import { getMedia } from '../util/webrtc'

interface IMessage {
  username?: string;
  text?: string;
  time?: string;
}
interface IUserData {
  final?: {
    username?: string;
  },
  pre?: {
    username?: string;
  },
}

const Home: NextPage = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [message, setMessage] = useState<string>('Hello');
  const [recieved, setRecieved] = useState<IMessage>({});
  const [userDetails, setDetails] = useState<IUserData>({});
  let myRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState('')
  const [audio, setAudio] = useState('')
  //console.log("LOG::: ref ",myRef?.current?.value);

  const record = () => {
    getMedia()
  }
  const handleSendMessage = () => {

    const data = {
      text: " " + message,
      username: userDetails?.final?.username,
      time: Date.now().toString()
    }
    setMessages([...messages, { ...data, username: 'you' }])
    socket.emit('sendMessage', data)
  }

  useEffect(() => {
    const username = "pholosho";
    socket.auth = { username };
    socket.connect()
    socket.connected ? console.log("connected") : console.log("not connected!")

  })


  useEffect(() => {

    socket.on("hasMessage", (args) => {
      setRecieved(args);
    })
    socket.on("recieveImage", (args) => {

      const blob = new Blob([args.image])
      const srcBlob = URL.createObjectURL(blob);
      setImage(srcBlob)

    })

    socket.on("recieveAudio", (args) => {

      const blob = new Blob([args.audio])
      const srcBlob = URL.createObjectURL(blob);

      setAudio(srcBlob);

    })

  }, [])

  useEffect(() => {
    const txts = messages.map((m: any) => m?.text);
    if (!txts.includes(recieved)) {
      setMessages([...messages, recieved])
      //console.log("LOG:::current Messages", messages)
    }

  }, [recieved])
  return (
    <div>
      <h1>SodaHouse FM</h1>
      <p>Listen to some fine tunes</p>
      <audio autoPlay src={audio}></audio>
      <Alert>Be FREE</Alert>
    </div>

  )
}

export default Home
