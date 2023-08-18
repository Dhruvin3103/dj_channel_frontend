import React from 'react';

function RemoteVideo({ peerUsername }) {
  return (
    <div className="video-wrapper">
      <video id={`${peerUsername}-video`} autoPlay playsInline />
    </div>
  );
}

export default RemoteVideo;
