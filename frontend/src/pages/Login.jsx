import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(loginUser({ username, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      navigate('/');
    } else {
      alert(resultAction.payload || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Welcome Back</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>Sign in to continue</p>
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <button type="submit">Log In</button>
      </form>
      <p style={{ marginTop: '2rem' }}>
        Don't have an account? <Link to="/register" style={{ color: 'var(--accent-color)' }}>Register</Link>
      </p>
    </div>
  );
}
