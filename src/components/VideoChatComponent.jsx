import React, { useEffect, useRef } from 'react';

function VideoChatComponent({ streams }) {
  useEffect(() => {
    // Iterate through the streams object and create video elements for each stream
    Object.keys(streams).forEach((peerUsername) => {
      const videoElement = document.createElement('video');
      videoElement.srcObject = streams[peerUsername];
      videoElement.autoPlay = true;
      videoElement.playsInline = true;

      const videoContainer = document.createElement('div');
      videoContainer.className = 'video-container';
      
      const usernameElement = document.createElement('div');
      usernameElement.textContent = peerUsername;
      usernameElement.className = 'username';

      videoContainer.appendChild(videoElement);
      videoContainer.appendChild(usernameElement);
      
      document.getElementById('video-grid').appendChild(videoContainer);
    });
  }, [streams]);

  return <div id="video-grid" />;
}

export default VideoChatComponent;
