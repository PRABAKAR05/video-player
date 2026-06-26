import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../redux/authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(registerUser({ username, password }));
    if (registerUser.fulfilled.match(resultAction)) {
      navigate('/');
    } else {
      alert(resultAction.payload || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>Sign up to start learning</p>
      
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
        <button type="submit">Sign Up</button>
      </form>
      <p style={{ marginTop: '2rem' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--accent-color)' }}>Log In</Link>
      </p>
    </div>
  );
}
