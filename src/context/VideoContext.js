import { createContext, useEffect, useRef, useState } from "react";

const VideoContext = createContext({});

export const VideoProvider = ({ children }) => {
  const backendurl = "127.0.0.1:8000/";
  const pathname = "chat/";
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const [input, setInput] = useState(true);
  const [mapPeers, setMapPeers] = useState({});
  const [ws, setWs] = useState(null);
  const [localStream, setLocalStream] = useState();
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [err, setErr] = useState("");
  const [disBtn, setDisBtn] = useState(false);
  const [userPeer,setUserPeer] = useState({});
  const videoRef = useRef(null);

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
      ws.addEventListener("open", () => {
        console.log("ws opened");
        sendSignal("new-peer", {});
      });

      ws.addEventListener("message", (event) => {
        const message = JSON.parse(event.data)["message"];
        const status = JSON.parse(event.data)["status"];
        if (status === 404 && message === "Room does not exist") {
          setErr("Room Does Not Exist");
        }
        console.log("ws messages");
        handleWebSocketMessage(event);
      });

      ws.addEventListener("close", () => {
        console.log("ws closes");
        setConnected(false);
        setInput(true);
      });

      ws.addEventListener("error", (event) => {
        console.log(event);
        console.log("Error Occurred");
      });
    }
  }, [ws]); // Effect will run whenever 'ws' changes

  const handleStart = (lobby_name, username) => {
    setInput(false);
    setDisBtn(true);
    const loc = window.location;
    const ws_url = "ws/";
    const wsStart = loc.protocol === "https:" ? "wss://" : "ws://";
    const endpoint = `${wsStart}${backendurl}ws/${lobby_name}/${username}`;
    console.log(endpoint);
    const newWebSocket = new WebSocket(endpoint);
    setWs(newWebSocket);
  };

  // when wss messages
  const handleWebSocketMessage = (event) => {
    const parsedData = JSON.parse(event.data);
    const peerUsername = parsedData["peer"];
    const message = parsedData["message"];
    const action = parsedData["action"];
    const peerObj = parsedData["mapPeers"];
    const updatedMapPeers = {...peerObj,...mapPeers}
    console.log(updatedMapPeers)
    // setMapPeers(updatedMapPeers)
    console.log(action);
    if (username === peerUsername) {
      console.log('added to object')
      
      return;
    }
    const receiver_channel_name =
      parsedData["message"]["receiver_channel_name"];

    if (action === "new-peer") {
      console.log("new_peer");
      createOfferer(peerUsername, receiver_channel_name);
      return;
    }

    if (action === "new-offer") {
      console.log("new offer");
      const offer = parsedData["message"]["sdp"];
      createAnswerer(offer, peerUsername, receiver_channel_name);
      return;
    }

    if (action === "new-answer") {
      console.log("new answer");
      const answer = parsedData["message"]["sdp"];
      // const peer = mapPeers[peerUsername][0];
      // peer.setRemoteDescription(answer)
      console.log('out setmap peers', mapPeers);
      setMapPeers((prevMapPeers) => {
        const updatedMapPeers = { ...prevMapPeers };
        console.log('inside ', updatedMapPeers);
        const peer = updatedMapPeers[peerUsername][0];
        if (
          peer.signalingState === "have-local-offer" ||
          peer.signalingState === "stable"
        ) {
          peer
            .setRemoteDescription(answer)
            .then(() => {
              console.log("Remote description set successfully", answer, peer);
            })
            .catch((error) => {
              console.error(
                "Error setting remote description:",
                error,
                peer.signalingState
              );
            });
        } else {
          console.warn(
            "Tried to set remote description in the wrong state:",
            peer.signalingState
          );
        }
      });
      console.log('after', mapPeers);
    }

    console.log("mess : " + message);
  };

  const sendSignal = (action, message) => {
    // console.log(action,message)
    if (!ws) {
      console.log("no websocket");
      return;
    }
    console.log(action);
    const jsonStr = JSON.stringify({
      peer: username,
      action: action,
      message: message,
      mapPeers:mapPeers
    });
    // console.log(jsonStr)
    ws.send(jsonStr);
  };

  useEffect(() => {
    console.log('mapPeers has been updated:', mapPeers);
    // You can perform additional actions here with the updated mapPeers
  }, [mapPeers]);

  const addMapPeers = async (peer, localStream, peerUsername) => {
    
    const updatedMapPeers = {
      ...mapPeers,
      [peerUsername]: [peer, localStream],
    };
    setMapPeers(updatedMapPeers);
    console.log('added : ',updatedMapPeers,mapPeers);
  };

  const createOfferer = async (peerUsername, receiver_channel_name) => {
    console.log("creating offer");
    console.log(peerUsername, receiver_channel_name);

    const peer = new RTCPeerConnection(null);
    setUserPeer(peer);
    addLocalTracks(peer);
    const remoteVideo = createVideo(peerUsername);
    await addMapPeers(peer, localStream, peerUsername);
    setOnTracks(peer, remoteVideo);
    console.log(mapPeers);
    peer.addEventListener("iceconnectionstatechange", () => {
      const iceConnectionState = peer.iceConnectionState;
      console.log('changed');
      if (
        iceConnectionState === "failed" ||
        iceConnectionState === "disconnected" ||
        iceConnectionState === "closed"
      ) {
        if (iceConnectionState !== "closed") {
          peer.close();
        }

        const updatedMapPeers = { ...mapPeers };
        delete updatedMapPeers[peerUsername];
        console.log('updated obj : ',updatedMapPeers);
        setMapPeers(updatedMapPeers);
        removeVideo(remoteVideo);
      }
    });

    peer.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        // console.log('New',JSON.stringify(peer.localDescription));
        return;
      }
      sendSignal("new-offer", {
        sdp: peer.localDescription,
        receiver_channel_name: receiver_channel_name,
      });
    });

    peer
      .createOffer()
      .then((e) => peer.setLocalDescription(e))
      .then(() => {
        console.log("local descr set successfully");
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  };

  const createAnswerer = async (offer, peerUsername, receiver_channel_name) => {
    const peer = new RTCPeerConnection(null);
    setUserPeer(peer);
    addLocalTracks(peer);
    const remoteVideo = createVideo(peerUsername);
    await addMapPeers(peer, localStream, peerUsername);
    setOnTracks(peer, remoteVideo);
    console.log(mapPeers);
    peer.addEventListener("iceconnectionstatechange", () => {
      console.log('changed');
      const iceConnectionState = peer.iceConnectionState;
      if (
        iceConnectionState === "failed" ||
        iceConnectionState === "disconnected" ||
        iceConnectionState === "closed"
      ) {
        if (iceConnectionState !== "closed") {
          peer.close();
        }
        const updatedMapPeers = { ...mapPeers };
        delete updatedMapPeers[peerUsername];
        console.log('updated obj : ',updatedMapPeers);
        setMapPeers(updatedMapPeers);
        removeVideo(remoteVideo);
      }
    });

    peer.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        // console.log('New',JSON.stringify(peer.localDescription));
        return;
      }
      sendSignal("new-answer", {
        sdp: peer.localDescription,
        receiver_channel_name: receiver_channel_name,
      });
    });

    peer
      .setRemoteDescription(offer)
      .then(() => {
        console.log("remote descr is sett for %s .", peerUsername);
        peer.createAnswer();
      })
      .then((a) => {
        console.log("Answer Created !!");
        addMapPeers(peer, localStream, peerUsername);
        peer.setLocalDescription(a);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addLocalTracks = (peer) => {
    localStream.getTracks().forEach((track) => {
      peer.addTrack(track, localStream);
    });
  };

  const createVideo = (peerUsername) => {
    const videoContainer = document.querySelector("#video-container");

    const remoteVideo = document.createElement("video");
    const h1_username = document.createElement("h1");

    remoteVideo.id = peerUsername + "-video";
    remoteVideo.autoplay = true;
    remoteVideo.playsInline = true;
    h1_username.textContent = peerUsername;

    const videowrapper = document.createElement("div");

    videoContainer.appendChild(videowrapper);

    videowrapper.appendChild(h1_username);
    videowrapper.appendChild(remoteVideo);

    return remoteVideo;
  };

  const removeVideo = (video) => {
    console.log(video)
    const videowrapper = video.parentNode;
    videowrapper.parentNode.removeChild(videowrapper);
  };

  const setOnTracks = (peer, remoteVideo) => {
    const stream = new MediaStream();
    remoteVideo.srcObject = stream;
    peer.addEventListener("track", (event) => {
      stream.addTrack(event.track, stream);
      console.log("track : ", event.track, stream);
    });
  };

  const disconnectVideo = (username) => {
    console.log(userPeer)
    const updatedMapPeers = { ...mapPeers };
    delete updatedMapPeers[username];
    const remoteVideo = document.getElementById("video-container");
    const videoElements = remoteVideo.querySelectorAll('video');
    try {
      userPeer.close();
    } catch (error) {
      console.log(error)
    }
    
    videoElements.forEach(videoElement =>{
      removeVideo(videoElement)
    })
    console.log(remoteVideo);
    window.location.reload();
    // console.log('updated obj : ',updatedMapPeers);
    // setMapPeers(updatedMapPeers);
    // removeVideo(remoteVideo);
    
    // peer.close();
  };
  return (
    <VideoContext.Provider
      value={{
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
        setLocalStream,
        err,
        setErr,
        disconnectVideo,
        disBtn,
        setDisBtn,
        mapPeers
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export default VideoContext;
