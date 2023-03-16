import React, { useState, useEffect } from "react";
import '../App.css';
import Grid from "./Grid";
import { over } from "stompjs";
import SockJS from "sockjs-client";



var stompClient = null;

function App() {

  const [userState, setUserState] = useState({
    currFocus: [],
    currCapture: [],
    alreadyFocused: [[]],
    alreadyCaptured: [[]]
  })
  const [prevActive, setPrevActive] = useState(0)
  const [active, setActive] = useState(0)

  useEffect(() => {
    console.log(active)

    const prev = document.getElementById(prevActive)
    if (prev) {
      prev.style.background = "lightgray"
    }

    const ele = document.getElementById(active)
    if (ele) {
      ele.style.background = "green"
      setPrevActive(active)
    }


  }, [active])

  const createConnection = () => {
    let Sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError)
  }

  const onConnected = () => {
    // console.log("Connected")
    setTimeout(() => {
      stompClient.subscribe("/userState/update", onUserStateUpdate)
      stompClient.subscribe("/userState/offset", onOffsetReceive)
      sendMove("getState")
      getOffsetFromBackend()
    }, 500)

  }

  const onError = (error) => {
    console.log("Connection error " + error)
  }

  const onUserStateUpdate = (payload) => {
    let payloadData = JSON.parse(payload.body)
    console.log("user state recieved from server")
    // console.log(payloadData)
    // setUserState({ currFocus: payloadData.currFocus, currCapture: payloadData.currCapture, alreadyFocused: payload.alreadyFocused, alreadyCaptured: payload.alreadyCaptured })
    setUserState(payloadData)
    // console.log(userState)
  }

  const onOffsetReceive = (payload) => {
    let payloadData = JSON.parse(payload.body)
    console.log("curr position recieved from server")
    // console.log(payloadData)
    setActive(payloadData)
  }

  const sendMove = (move) => {
    if (stompClient) {
      console.log("jatin sending data " + move)
      stompClient.send("/app/addMove", {}, move)
    }
  }

  const getOffsetFromBackend = () => {
    if (stompClient) {
      stompClient.send("/app/getOffset", {}, {})
    }
  }

  useEffect(() => {
    createConnection()
  }, [])



  return (
    <div className="App">
      <Grid sendMove={sendMove} active={active} setActive={setActive} userState={userState} />

    </div>
  );
}

export default App;
