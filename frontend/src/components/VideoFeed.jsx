import { useRef, useEffect, useState } from 'react';
import VideoPlayer from './VideoPlayer';

export default function VideoFeed({ videos }) {
  const containerRef = useRef(null);
  
  if (!videos || videos.length === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
        No videos available. Make sure to upload them to the backend.
      </div>
    );
  }

  return (
    <div className="video-feed-container" ref={containerRef}>
      {videos.map((video, index) => (
        <VideoPlayer key={video.id} video={video} index={index} />
      ))}
    </div>
  );
}
