import { resolveObjectURL } from 'buffer';
import type { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import { Alert, Button, Container, Form } from 'react-bootstrap'
import socket from '../util/socket'
import { getMedia } from '../util/webrtc';

const Home: NextPage = () => {

  const [mainAudio, setMainAudio] = useState<any>();
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    mainAudio.pause();
    mainAudio.currentTime = 0;
    mainAudio?.play();
    console.log("LOG::: manual play")
  }

  useEffect(() => {
    document.body.style.backgroundColor = "black"
    const username = "pholosho";
    socket.auth = { username };
    socket.connect()
    socket.connected ? console.log("connected") : console.log("not connected!")

  })


  useEffect(() => {
    socket.on("recieveAudio", (args: any) => {
      const blob = new Blob([args.audio])
      const srcBlob = URL.createObjectURL(blob);
      const audio = new Audio(srcBlob);
      setIsPlaying(true);
      setMainAudio(audio);
    })

  }, [])

  useEffect(() => {
    mainAudio?.play();
  }, [mainAudio])

  return (
    <div style={{ background: 'black', color: 'white', textAlign: 'center' }}>
      <br />
      <h1>SodaHouse Radio</h1>


      <p>Listen to some fine tunes</p>
      {isPlaying && <>
        <img height={250} onClick={handlePlay} src={'https://media2.giphy.com/media/TqsLxad921AYMHmLXg/giphy-downsized-large.gif'}></img>
        <h3>Now Listening.. .</h3>
        <p>[Press here to Play if audio not playing]</p>

      </> || <>

          <img height={250} src={'https://miro.medium.com/max/1400/1*e_Loq49BI4WmN7o9ItTADg.gif'}></img>
          <h3>Please Wait ...</h3>
        </>}


    </div>

  )
}



export default Home
