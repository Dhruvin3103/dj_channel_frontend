import React, { useState, useEffect } from 'react';

import './videoapp.css'; // Make sure to adjust the path to your CSS file

function VideoApp() {
  const [username, setUsername] = useState('');
  const [webSocket, setWebSocket] = useState(null);
  const [localStream, setLocalStream] = useState(new MediaStream());

  useEffect(() => {
    // Initialize WebSocket connection
    if (webSocket === null) {
      const loc = window.location;
      const wsstart = loc.protocol === 'https:' ? 'wss://' : 'ws://';
      const endpoint = `${wsstart}${loc.host}${loc.pathname}`;

      const socket = new WebSocket(endpoint);
      setWebSocket(socket);

      socket.addEventListener('open', () => {
        console.log('Connection opened');
        sendSignal('new-peer', {});
      });

      socket.addEventListener('message', webSocketOnMessage);

      socket.addEventListener('close', () => {
        console.log('Connection closed');
      });

      socket.addEventListener('error', () => {
        console.log('Error occurred');
      });
    }

    // Get user media
    const constraints = {
      audio: true,
      video: true,
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        setLocalStream(stream);
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  }, [webSocket]);

  const webSocketOnMessage = (event) => {
    const parsedData = JSON.parse(event.data);
    const peerUsername = parsedData.peer;
    const action = parsedData.action;

    // Rest of your logic for handling WebSocket messages
    // ...

    console.log('Action:', action);
  };

  const sendSignal = (action, message) => {
    const jsonStr = JSON.stringify({
      peer: username,
      action: action,
      message: message,
    });

    if (webSocket !== null) {
      webSocket.send(jsonStr);
    }
  };

  return (
    <div className="App">
      <h3 id="label-username">{username || 'Username'}</h3>

      {!username ? (
        <div>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            id="btn-join"
            onClick={() => {
              if (username === '') {
                return;
              }

              const usernameInput = document.querySelector('#username');
              const btnJoin = document.querySelector('#btn-join');

              usernameInput.disabled = true;
              btnJoin.disabled = true;

              // Rest of your logic for joining the room
              // ...

              setUsername('');
            }}
          >
            Join Room
          </button>
        </div>
      ) : (
        <div className="main-grid-container">
          <div id="video-container">
            <div>
              <video
                id="local-video"
                style={{ float: 'left' }}
                autoPlay
                playsInline
                muted
              />
            </div>
            {/* Rest of your local video controls */}
            {/* ... */}
          </div>

          <div id="chat">
            <h3>Chat</h3>
            <div id="message">
              <ul id="mess-list">{/* Display chat messages here */}</ul>
            </div>

            <div>
              <input id="msg" />
              <button
                id="send-mess"
                onClick={() => {
                  // Send chat message logic
                  // ...
                }}
              >
                Send message
              </button>
            </div>

            <button
              id="btm-share-screen"
              onClick={() => {
                // Share screen logic
                // ...
              }}
            >
              Share Screen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoApp;
