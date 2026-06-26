import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import axiosClient from '../api/axiosClient';
import VideoFeed from '../components/VideoFeed';

export default function Home() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axiosClient.get('/videos');
        setVideos(response.data.videos);
      } catch (error) {
        console.error('Failed to fetch videos', error);
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) {
      fetchVideos();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw', backgroundColor: 'black' }}>
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 50, display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span style={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>@{user?.username}</span>
        <button 
          onClick={() => dispatch(logout())}
          style={{ padding: '0.5rem 1rem', borderRadius: '20px', border: 'none', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(10px)', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
      
      {loading ? (
        <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
          Loading...
        </div>
      ) : (
        <VideoFeed videos={videos} />
      )}
    </div>
  );
}
