import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Alert, Button, Container, Form } from 'react-bootstrap'
import socket from '../util/socket'


interface IMessage {
  username?: string;
  text?: string;
  time?: string;
}
interface IUserData {
  final? : {
    username? : string;
  },
  pre? : {
    username? : string;
  },
}

const Home: NextPage = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [message, setMessage] = useState<string>('Hello');
  const [recieved, setRecieved] = useState<IMessage>({});
  const [userDetails, setDetails] = useState<IUserData>({});
  


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
    socket.emit("listen", { Data: "something here" })
  })


  useEffect(() => {

    socket.on("hasMessage", (args) => {
      setRecieved(args);
    })

  }, [])

  useEffect(() => {
    const txts = messages.map((m: any) => m?.text);
    if (!txts.includes(recieved)) {
      setMessages([...messages, recieved])
      console.log("LOG:::current Messages", messages)
    }

  }, [recieved])
  return (
    <>
      {!userDetails?.final && (
        <>  
          <h1>Your details</h1>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control onChange={(value) => {  setDetails({pre:{username :  value.target.value}}) }} type="email" placeholder="user name " />
          </Form.Group>
          <Button onClick={()=>{setDetails({final:{username : userDetails?.pre?.username}})}} variant='primary'>Get Started</Button>

        </>
      ) || (<>
        <h1>SodaHouse</h1>
        {messages.map((message: IMessage) => {
          return <Alert key={message?.text} variant={message.username == 'you' ? 'primary' : 'warning'}>
            {message?.username}-{message?.text}
          </Alert>
        })}


        <Form.Control onChange={(value) => { setMessage(value.target.value) }} type="email" placeholder="Message here" />
        <Button onClick={handleSendMessage} variant='primary'>Send Message</Button>
      </>)
      }
    </>

  )
}

export default Home
