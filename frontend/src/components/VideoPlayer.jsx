import { useRef, useEffect, useState } from 'react';
import InteractionOverlay from './InteractionOverlay';
import BottomSheet from './BottomSheet';

export default function VideoPlayer({ video, index }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(e => console.log('Autoplay prevented', e));
          setIsPlaying(true);
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.7 } // Play when 70% visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="video-container" ref={containerRef}>
      <video
        ref={videoRef}
        src={`http://localhost:5000/uploads/${video.file_path}`}
        loop
        playsInline
        onClick={togglePlay}
      />
      
      <div style={{ 
        position: 'absolute', 
        bottom: '2rem', 
        left: '1rem', 
        width: 'calc(100% - 80px)',
        zIndex: 10,
        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
      }}>
        <h3 style={{ marginBottom: '0.5rem' }}>{video.title}</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{video.description}</p>
        <span style={{ display: 'inline-block', marginTop: '0.5rem', backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
          {video.category}
        </span>
      </div>

      <InteractionOverlay 
        video={video} 
        onCommentClick={() => setShowComments(true)} 
      />

      {showComments && (
        <BottomSheet 
          videoId={video.id} 
          onClose={() => setShowComments(false)} 
        />
      )}
    </div>
  );
}
