import React, { useState, useEffect, useRef } from 'react';
import './videoapp.css'; // Make sure to import your CSS file
// import MainJS from './main.js'; // Make sure to import your JavaScript file

const VideoApp = () => {
    const backendurl = "127.0.0.1:8000/"
    const pathname = 'chat/'
    const [username, setUsername] = useState('');
    const [connected, setConnected] = useState(false);
    const [btn,setBTN] = useState(false);
    const [input, setInput] = useState(true);
    const [mapPeers, useMapPeers] = useState({});
    const [ws,setWs] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const videoRef = useRef(null)

    // video element
    useEffect(() => {
        const constraints = {
          audio: true,
          video: true,
        };
    
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then((stream) => {
            console.log('video elemtt')
            setLocalStream(stream);
            const audioTrack = stream.getAudioTracks()[0];
            const videoTrack = stream.getVideoTracks()[0];
            audioTrack.enabled = true;
            videoTrack.enabled = true;
            if (videoRef.current) {
              videoRef.current.srcObject = stream; // Display the stream in the video element
            }
          })
          .catch((error) => {
            console.log('Error: ', error);
          });
      }, []);

    const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    localStream.getAudioTracks()[0].enabled = !audioEnabled;
    };

    const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    localStream.getVideoTracks()[0].enabled = !videoEnabled;
    };

    useEffect(() => {
      if (ws) {
          ws.addEventListener('open', () => {
              console.log("ws opened");
              sendSignal('new-peer', {});
          });

          ws.addEventListener('message', (event) => {
              console.log("ws messages");
              handleWebSocketMessage(event);
          });

          ws.addEventListener('close', () => {
              console.log("ws closes");
              setConnected(false);
          });

          ws.addEventListener('error', () => {
              console.log('Error Occurred');
          });
      }
  }, [ws]); // Effect will run whenever 'ws' changes

  const handleStart = (e) => {
      e.preventDefault();
      setInput(true);
      setConnected(true);

      const loc = window.location;
      const wsStart = loc.protocol === 'https:' ? 'wss://' : 'ws://';
      const endpoint = `${wsStart}${backendurl}${pathname}`;
      const newWebSocket = new WebSocket(endpoint);
      setWs(newWebSocket);

      // Rest of your handleStart logic...
  };

    // on click start btn
    // const handleStart = (e) => {
    //     e.preventDefault();
    //     setInput(true)
    //     setConnected(true);
    
    //     const loc = window.location;
    //     const wsStart = loc.protocol === 'https:' ? 'wss://' : 'ws://';
    //     const endpoint = `${wsStart}${backendurl}${pathname}`;
    //     console.log(endpoint)
    //     const newWebSocket = new WebSocket(endpoint);
    
    //     newWebSocket.addEventListener('open', () => {
    //       console.log("ws opened")
    //       sendSignal('new-peer', {});
    //     });
    
    //     newWebSocket.addEventListener('message', (event) => {
    //       console.log("ws messages")
    //       handleWebSocketMessage(event);
    //     });
    
    //     newWebSocket.addEventListener('close', () => {
    //       console.log("ws closes")
    //       setConnected(false);
    //     });
    
    //     newWebSocket.addEventListener('error', () => {
    //       console.log('Error Occurred');
    //     });
    
    //     setWs(newWebSocket);
    // };
    
    // when wss messages
    const handleWebSocketMessage = (event) => {
        const parsedData = JSON.parse(event.data);
        const peerUsername = parsedData['peer'];
        const action = parsedData['action'];
    
        // Rest of your message handling logic...
        console.log(parsedData['message']);
        console.log(peerUsername)
      };
    
    const sendSignal = (action, message) => {
      // console.log(action,message)
      if (!ws) {
        console.log('no websocket')
        return;
      }
  
      const jsonStr = JSON.stringify({
        'peer': username,
        'action': action,
        'message': message,
      });
      console.log(jsonStr)
      ws.send(jsonStr);
    };

    return (
        <>
            <h1>{username}</h1>
            {input ? (
                <form onSubmit={handleStart}>
                    <input
                        type='text'
                        required
                        autoFocus
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <button type='submit'>Start</button>
                </form>
            ) : (
                null
            )}

            <div>
                <video id="local-video" autoPlay playsInline muted ref={videoRef}/>
                <button id="btn-toggle-audio" onClick={toggleAudio}>
                    {audioEnabled ? 'Audio mute' : 'Audio unmute'}
                </button>
                <button id="btn-toggle-video" onClick={toggleVideo}>
                    {videoEnabled ? 'Video mute' : 'Video unmute'}
                </button>
            </div>
        </>
    );
};

export default VideoApp;
