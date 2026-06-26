import { useState } from 'react';
import { Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosClient from '../api/axiosClient';

export default function InteractionOverlay({ video, onCommentClick }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.like_count);
  const [bookmarked, setBookmarked] = useState(false);

  const handleLike = async () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);

    try {
      await axiosClient.post(`/videos/${video.id}/like`);
    } catch (error) {
      setLiked(!liked);
      setLikeCount(prev => liked ? prev + 1 : prev - 1);
    }
  };

  const handleBookmark = async () => {
    setBookmarked(!bookmarked);
    try {
      await axiosClient.post(`/videos/${video.id}/bookmark`);
    } catch (error) {
      setBookmarked(!bookmarked);
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
      <motion.div style={iconStyle} onClick={handleLike} whileTap={{ scale: 0.8 }} whileHover={{ scale: 1.1 }}>
        <div style={{ 
          padding: '0.7rem', 
          backgroundColor: 'rgba(0,0,0,0.4)', 
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <motion.div animate={{ scale: liked ? [1, 1.2, 1] : 1 }}>
            <Heart fill={liked ? 'var(--accent-color)' : 'none'} color={liked ? 'var(--accent-color)' : 'white'} size={28} />
          </motion.div>
        </div>
        <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{likeCount}</span>
      </motion.div>

      <motion.div style={iconStyle} onClick={onCommentClick} whileTap={{ scale: 0.8 }} whileHover={{ scale: 1.1 }}>
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
      </motion.div>

      <motion.div style={iconStyle} onClick={handleBookmark} whileTap={{ scale: 0.8 }} whileHover={{ scale: 1.1 }}>
        <div style={{ 
          padding: '0.7rem', 
          backgroundColor: 'rgba(0,0,0,0.4)', 
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <motion.div animate={{ scale: bookmarked ? [1, 1.2, 1] : 1 }}>
            <Bookmark fill={bookmarked ? 'white' : 'none'} size={28} />
          </motion.div>
        </div>
        <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Save</span>
      </motion.div>
      
      <motion.div style={iconStyle} whileTap={{ scale: 0.8 }} whileHover={{ scale: 1.1 }}>
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
      </motion.div>
    </div>
  );
}
