import React, { useState, useEffect, useRef, useContext } from "react";
import "./videoapp.css"; // Make sure to import your CSS file
import VideoContext from "./context/VideoContext";
import { useParams } from "react-router-dom";
import AuthContext from "./context/AuthProvider";
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
  } = useContext(VideoContext);

  const { userData } = useContext(AuthContext);

  const { id } = useParams();

  useEffect(() => {});

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
     
    setUsername(userData.username);
  }, []);

  return (
    <>
      {userData ? <h1>{userData.username}</h1> : null}

      {input ? (
        <form onSubmit={() => handleStart(id,userData.username)}>
          {/* <input
            type="text"
            required
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          /> */}
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
