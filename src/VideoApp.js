import React, { useState, useEffect, useRef, useContext } from "react";
import "./videoapp.css"; // Make sure to import your CSS file
import VideoContext from "./context/VideoContext";
import { useParams } from "react-router-dom";
import AuthContext from "./context/AuthProvider";
import Errorpage from "./components/Errorpage";
import axios from "./api/axios";
import { useNavigate } from "react-router-dom";
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
    setLocalStream,
    err,
    setErr,
    disBtn,
    setDisBtn,
    disconnectVideo,
    mapPeers
  } = useContext(VideoContext);

  const { userData, loading } = useContext(AuthContext);
  const [name, setName] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const disconnectOnUnload = (event) => {
      // Prompt the user to confirm leaving the page
      event.preventDefault();
      event.returnValue = '';
      console.log('hello disconnect')
      // Disconnect from the video chat (you should replace this with your actual disconnection logic)
      disconnectVideo(username);
    };

    window.addEventListener('beforeunload', disconnectOnUnload);

    return () => {
      // Remove the event listener when the component is unmounted
      window.removeEventListener('beforeunload', disconnectOnUnload);
    };
  }, []);
  
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
    // console.log(userData.username);
    if (!userData) {
      const storedUserData = JSON.parse(localStorage.getItem("userData"));
      if (storedUserData) {
        setUsername(storedUserData.username);
      }
    } else {
      setUsername(userData.username);
      localStorage.setItem("userData", JSON.stringify(userData));
    }
  }, []);

  useEffect(() => {
    const checkParam = async () => {
      setErr("");
      const formData = new FormData();
      console.log(id);
      formData.append("lobby_id", id);
      try {
        const response = await axios.post("/chat/lobbycheck/", formData, {
          withCredentials: true,
        });
        console.log("pass", response);
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          console.log(status);
          if (status === 404) {
            setErr(data.error);
          }
        } else {
          setErr("An Error Occured");
          console.log(error);
        }
      }
    };

    checkParam();
  }, []);
  return (
    <>
      {err ? (
        <Errorpage error={err} />
      ) : (
        <>
          {loading ? (
            <p>Loading...</p>
          ) : userData ? (
            <>
              <h1>{userData.username}</h1>
              {input ? (
                <form onSubmit={() => handleStart(id, userData.username)}>
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
              {disBtn?(<button onClick={()=>disconnectVideo(userData.username)}>
                disconnect
              </button>):null}
            </>
          ) : (
            <p>kuch to gadbad hai !! </p>
          )}
        </>
      )}
    </>
  );
};

export default VideoApp;
