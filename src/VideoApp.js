import React, { useState, useEffect } from 'react';
import '../index.css'; // Make sure to import your CSS file
// import MainJS from './main.js'; // Make sure to import your JavaScript file

const VideoApp = () => {
    const [username, setUsername] = useState('');
    const [connected, setConnected] = useState(false);
    const [btn,setBTN] = useState(false);
    const [input, setInput] = useState(true);
    const [mapPeers, useMapPeers] = useState({});
    const [ws,setWs] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);

    useEffect(() => {
        const constraints = {
          audio: true,
          video: true,
        };
    
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then((stream) => {
            setLocalStream(stream);
    
            const audioTrack = stream.getAudioTracks()[0];
            const videoTrack = stream.getVideoTracks()[0];
    
            audioTrack.enabled = true;
            videoTrack.enabled = true;
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

    const handleStart = (e) => {
        e.preventDefault();
        setBTN(true)
        setConnected(true);
    
        const loc = window.location;
        const wsStart = loc.protocol === 'https:' ? 'wss://' : 'ws://';
        const endpoint = `${wsStart}${loc.host}${loc.pathname}`;
        const newWebSocket = new WebSocket(endpoint);
    
        newWebSocket.addEventListener('open', () => {
          sendSignal('new-peer', {});
        });
    
        newWebSocket.addEventListener('message', (event) => {
          handleWebSocketMessage(event);
        });
    
        newWebSocket.addEventListener('close', () => {
          setConnected(false);
        });
    
        newWebSocket.addEventListener('error', () => {
          console.log('Error Occurred');
        });
    
        setWs(newWebSocket);
      };
    
    const handleWebSocketMessage = (event) => {
        const parsedData = JSON.parse(event.data);
        const peerUsername = parsedData['peer'];
        const action = parsedData['action'];
    
        // Rest of your message handling logic...
        console.log(action);
      };
    
      const sendSignal = (action, message) => {
        if (!ws) {
          return;
        }
    
        const jsonStr = JSON.stringify({
          'peer': username,
          'action': action,
          'message': message,
        });
    
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
                <video id="local-video" autoPlay muted playsInline />
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
