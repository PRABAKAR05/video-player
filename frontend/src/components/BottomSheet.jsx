import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import axiosClient from '../api/axiosClient';

export default function BottomSheet({ videoId, onClose }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axiosClient.get(`/videos/${videoId}/comments`);
        setComments(response.data.comments);
      } catch (error) {
        console.error('Failed to fetch comments', error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [videoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axiosClient.post(`/videos/${videoId}/comment`, { content: newComment });
      // In a full implementation, we'd want the user's username returned from backend or from redux state to display immediately
      // Here we simulate optimistic addition using a placeholder username, or we can just fetch again
      const commentData = response.data.comment;
      setComments([{ ...commentData, username: 'You' }, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to post comment', error);
    }
  };

  return (
    <AnimatePresence>
      <div 
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 40
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60vh',
            backgroundColor: 'var(--bottom-sheet-bg)',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            padding: '1rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #333' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Comments</h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {loading ? (
              <p style={{ textAlign: 'center', color: 'gray' }}>Loading comments...</p>
            ) : comments.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'gray' }}>No comments yet. Be the first!</p>
            ) : (
              comments.map(c => (
                <div key={c.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'gray', fontWeight: '600' }}>@{c.username}</span>
                  <span style={{ fontSize: '0.95rem' }}>{c.content}</span>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSubmit} style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              placeholder="Add comment..." 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{
                flex: 1,
                padding: '0.8rem 1rem',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: '#333',
                color: 'white',
                outline: 'none'
              }}
            />
            <button type="submit" disabled={!newComment.trim()} style={{
              background: 'none',
              border: 'none',
              color: newComment.trim() ? 'var(--accent-color)' : 'gray',
              fontWeight: '600',
              cursor: newComment.trim() ? 'pointer' : 'default',
              padding: '0 0.5rem'
            }}>
              Post
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
