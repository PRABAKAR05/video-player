import { useState } from 'react';
import { Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import axiosClient from '../api/axiosClient';

export default function InteractionOverlay({ video, onCommentClick }) {
  const [liked, setLiked] = useState(false); // In a real app, initialize from user data
  const [likeCount, setLikeCount] = useState(video.like_count);
  const [bookmarked, setBookmarked] = useState(false);

  const handleLike = async () => {
    // Optimistic UI
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);

    try {
      await axiosClient.post(`/videos/${video.id}/like`);
    } catch (error) {
      // Revert if failed
      setLiked(!liked);
      setLikeCount(prev => liked ? prev + 1 : prev - 1);
      console.error('Like failed', error);
    }
  };

  const handleBookmark = async () => {
    setBookmarked(!bookmarked);
    try {
      await axiosClient.post(`/videos/${video.id}/bookmark`);
    } catch (error) {
      setBookmarked(!bookmarked);
      console.error('Bookmark failed', error);
    }
  };

  const iconStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    cursor: 'pointer',
    color: 'white',
    filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.8))'
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '2rem',
      right: '1rem',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 20
    }}>
      <div style={iconStyle} onClick={handleLike}>
        <div style={{ 
          padding: '0.7rem', 
          backgroundColor: 'rgba(0,0,0,0.4)', 
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Heart fill={liked ? 'var(--accent-color)' : 'none'} color={liked ? 'var(--accent-color)' : 'white'} size={28} />
        </div>
        <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{likeCount}</span>
      </div>

      <div style={iconStyle} onClick={onCommentClick}>
        <div style={{ 
          padding: '0.7rem', 
          backgroundColor: 'rgba(0,0,0,0.4)', 
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <MessageCircle size={28} />
        </div>
        <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Reply</span>
      </div>

      <div style={iconStyle} onClick={handleBookmark}>
        <div style={{ 
          padding: '0.7rem', 
          backgroundColor: 'rgba(0,0,0,0.4)', 
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Bookmark fill={bookmarked ? 'white' : 'none'} size={28} />
        </div>
        <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Save</span>
      </div>
      
      <div style={iconStyle}>
        <div style={{ 
          padding: '0.7rem', 
          backgroundColor: 'rgba(0,0,0,0.4)', 
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Share2 size={28} />
        </div>
        <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Share</span>
      </div>
    </div>
  );
}
