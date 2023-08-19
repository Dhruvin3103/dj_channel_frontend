import React, { useState, useEffect, useRef, useContext } from "react";
import "./videoapp.css"; // Make sure to import your CSS file
import VideoContext from "./context/VideoContext";

const VideoApp = ({}) => {
  const {
    handleStart,
    setUsername,
    username,
    videoRef,
    toggleAudio,
    toggleVideo,
    input,
    audioEnabled,
    setAudioEnabled,
    videoEnabled,
    setVideoEnabled,
    setLocalStream
  } = useContext(VideoContext)
  // const backendurl = "127.0.0.1:8000/";
  // const pathname = "chat/";
  // const localVideoRef = useRef(null);
  // const videoContainerRef = useRef(null);
  // const [username, setUsername] = useState("");
  // const [connected, setConnected] = useState(false);
  // const [btn, setBTN] = useState(false);
  // const [input, setInput] = useState(true);
  // const [mapPeers, setMapPeers] = useState({});
  // const [ws, setWs] = useState(null);
  // const [localStream, setLocalStream] = useState();
  // const [audioEnabled, setAudioEnabled] = useState(true);
  // const [videoEnabled, setVideoEnabled] = useState(true);
  // const videoRef = useRef(null);

  // video element
  useEffect(() => {
    const constraints = {
      audio: true,
      video: true,
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        console.log("video elemtt");
        setLocalStream(stream);
        const audioTrack = stream.getAudioTracks()[0];
        const videoTrack = stream.getVideoTracks()[0];
        audioTrack.enabled = true;
        videoTrack.enabled = true;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true; // Display the stream in the video element
        }
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  }, []);

  // const toggleAudio = () => {
  //   setAudioEnabled(!audioEnabled);
  //   localStream.getAudioTracks()[0].enabled = !audioEnabled;
  // };

  // const toggleVideo = () => {
  //   setVideoEnabled(!videoEnabled);
  //   localStream.getVideoTracks()[0].enabled = !videoEnabled;
  // };

  // useEffect(() => {
  //   if (ws) {
  //     ws.addEventListener("open", () => {
  //       console.log("ws opened");
  //       sendSignal("new-peer", {});
  //     });

  //     ws.addEventListener("message", (event) => {
  //       console.log("ws messages");
  //       handleWebSocketMessage(event);
  //     });

  //     ws.addEventListener("close", () => {
  //       console.log("ws closes");
  //       setConnected(false);
  //     });

  //     ws.addEventListener("error", () => {
  //       console.log("Error Occurred");
  //     });
  //   }
  // }, [ws]); // Effect will run whenever 'ws' changes

  // const handleStart = (e) => {
  //   e.preventDefault();
  //   setInput(true);
  //   setConnected(true);

  //   const loc = window.location;
  //   const wsStart = loc.protocol === "https:" ? "wss://" : "ws://";
  //   const endpoint = `${wsStart}${backendurl}${pathname}`;
  //   const newWebSocket = new WebSocket(endpoint);
  //   setWs(newWebSocket);
  // };

  // // when wss messages
  // const handleWebSocketMessage = (event) => {
  //   const parsedData = JSON.parse(event.data);
  //   const peerUsername = parsedData["peer"];
  //   const message = parsedData["message"];
  //   const action = parsedData["action"];
  //   console.log(action);
  //   if (username === peerUsername) {
  //     return;
  //   }
  //   const receiver_channel_name =
  //     parsedData["message"]["receiver_channel_name"];

  //   if (action === "new-peer") {
  //     console.log("new_peer");
  //     createOfferer(peerUsername, receiver_channel_name);
  //     return;
  //   }

  //   if (action === "new-offer") {
  //     console.log("new offer");
  //     const offer = parsedData["message"]["sdp"];
  //     createAnswerer(offer, peerUsername, receiver_channel_name);
  //     return;
  //   }

  //   if (action === "new-answer") {
  //     console.log("new answer");
  //     const answer = parsedData["message"]["sdp"];
  //     setMapPeers((prevMapPeers) => {
  //       const updatedMapPeers = { ...prevMapPeers };
  //       const peer = updatedMapPeers[peerUsername][0];
  //       if (
  //         peer.signalingState === "have-local-offer" ||
  //         peer.signalingState === "stable"
  //       ) {
  //         peer
  //           .setRemoteDescription(answer)
  //           .then(() => {
  //             console.log("Remote description set successfully", answer, peer);
  //           })
  //           .catch((error) => {
  //             console.error(
  //               "Error setting remote description:",
  //               error,
  //               peer.signalingState
  //             );
  //           });
  //       } else {
  //         console.warn(
  //           "Tried to set remote description in the wrong state:",
  //           peer.signalingState
  //         );
  //       }
  //     });
  //   }

  //   console.log("mess : " + message);
  // };

  // const sendSignal = (action, message) => {
  //   // console.log(action,message)
  //   if (!ws) {
  //     console.log("no websocket");
  //     return;
  //   }
  //   console.log(action);
  //   const jsonStr = JSON.stringify({
  //     peer: username,
  //     action: action,
  //     message: message,
  //   });
  //   // console.log(jsonStr)
  //   ws.send(jsonStr);
  // };

  // const addMapPeers = async (peer, localStream, peerUsername) => {
  //   console.log(peerUsername);
  //   const updatedMapPeers = {
  //     ...mapPeers,
  //     [peerUsername]: [peer, localStream],
  //   };
  //   setMapPeers(updatedMapPeers);
  // };

  // const createOfferer = async (peerUsername, receiver_channel_name) => {
  //   console.log("creating offer");
  //   console.log(peerUsername, receiver_channel_name);

  //   const peer = new RTCPeerConnection(null);
  //   addLocalTracks(peer);
  //   const remoteVideo = createVideo(peerUsername);
  //   await addMapPeers(peer, localStream, peerUsername);
  //   setOnTracks(peer, remoteVideo);
  //   console.log(mapPeers);
  //   peer.addEventListener("iceconnectionstatechange", () => {
  //     const iceConnectionState = peer.iceConnectionState;
  //     if (
  //       iceConnectionState === "failed" ||
  //       iceConnectionState === "disconnected" ||
  //       iceConnectionState === "closed"
  //     ) {
  //       if (iceConnectionState !== "closed") {
  //         peer.close();
  //       }
  //       const updatedMapPeers = { ...mapPeers };
  //       delete updatedMapPeers[peerUsername];
  //       setMapPeers(updatedMapPeers);
  //       removeVideo(remoteVideo);
  //     }
  //   });

  //   peer.addEventListener("icecandidate", (event) => {
  //     if (event.candidate) {
  //       // console.log('New',JSON.stringify(peer.localDescription));
  //       return;
  //     }
  //     sendSignal("new-offer", {
  //       sdp: peer.localDescription,
  //       receiver_channel_name: receiver_channel_name,
  //     });
  //   });

  //   peer
  //     .createOffer()
  //     .then((e) => peer.setLocalDescription(e))
  //     .then(() => {
  //       console.log("local descr set successfully");
  //     })
  //     .catch((error) => {
  //       console.error("Error accessing media devices:", error);
  //     });
  // };

  // const createAnswerer = async (offer, peerUsername, receiver_channel_name) => {
  //   const peer = new RTCPeerConnection(null);
  //   addLocalTracks(peer);
  //   const remoteVideo = createVideo(peerUsername);
  //   await addMapPeers(peer, localStream, peerUsername);
  //   setOnTracks(peer, remoteVideo);
  //   console.log(mapPeers);
  //   peer.addEventListener("iceconnectionstatechange", () => {
  //     const iceConnectionState = peer.iceConnectionState;
  //     if (
  //       iceConnectionState === "failed" ||
  //       iceConnectionState === "disconnected" ||
  //       iceConnectionState === "closed"
  //     ) {
  //       if (iceConnectionState !== "closed") {
  //         peer.close();
  //       }
  //       const updatedMapPeers = { ...mapPeers };
  //       delete updatedMapPeers[peerUsername];
  //       setMapPeers(updatedMapPeers);
  //       removeVideo(remoteVideo);
  //     }
  //   });

  //   peer.addEventListener("icecandidate", (event) => {
  //     if (event.candidate) {
  //       // console.log('New',JSON.stringify(peer.localDescription));
  //       return;
  //     }
  //     sendSignal("new-answer", {
  //       sdp: peer.localDescription,
  //       receiver_channel_name: receiver_channel_name,
  //     });
  //   });

  //   peer
  //     .setRemoteDescription(offer)
  //     .then(() => {
  //       console.log("remote descr is sett for %s .", peerUsername);
  //       peer.createAnswer();
  //     })
  //     .then((a) => {
  //       console.log("Answer Created !!");
  //       addMapPeers(peer, localStream, peerUsername);
  //       peer.setLocalDescription(a);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  // const addLocalTracks = (peer) => {
  //   localStream.getTracks().forEach((track) => {
  //     peer.addTrack(track, localStream);
  //   });
  // };

  // const createVideo = (peerUsername) => {
  //   const videoContainer = document.querySelector("#video-container");

  //   var remoteVideo = document.createElement("video");
  //   remoteVideo.id = peerUsername + "-video";
  //   remoteVideo.autoplay = true;
  //   remoteVideo.playsInline = true;

  //   const videowrapper = document.createElement("div");

  //   videoContainer.appendChild(videowrapper);

  //   videowrapper.appendChild(remoteVideo);

  //   return remoteVideo;
  // };

  // const removeVideo = (video) =>{
  //     const videowrapper = video.parentNode;
  //     videowrapper.parentNode.removeChild(videowrapper);
  // }

  // const setOnTracks = (peer, remoteVideo) => {
  //   const stream = new MediaStream();
  //   remoteVideo.srcObject = stream;
  //   peer.addEventListener("track", (event) => {
  //     stream.addTrack(event.track, stream);
  //     console.log("track : ", event.track, stream);
  //   });
  // };

  return (
    <>
      <h1>{username}</h1>
      {input ? (
        <form onSubmit={handleStart}>
          <input
            type="text"
            required
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="submit">Start</button>
        </form>
      ) : null}

      <div>
        <video id="local-video" autoPlay playsInline ref={videoRef} />

        <button id="btn-toggle-audio" onClick={toggleAudio}>
          {audioEnabled ? "Audio mute" : "Audio unmute"}
        </button>
        <button id="btn-toggle-video" onClick={toggleVideo}>
          {videoEnabled ? "Video mute" : "Video unmute"}
        </button>
      </div>
      <div id="video-container"></div>
    </>
  );
};

export default VideoApp;
