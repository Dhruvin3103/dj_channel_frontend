import React, { useState, useEffect, useRef, useContext } from "react";
import "./videoapp.css"; // Make sure to import your CSS file
import VideoContext from "./context/VideoContext";
import { useParams } from "react-router-dom";
import AuthContext from "./context/AuthProvider";
import Errorpage from "./components/Errorpage";
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
  } = useContext(VideoContext);

  const { userData, loading } = useContext(AuthContext);
  const [name, setName] = useState("");
  const { id } = useParams();

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
