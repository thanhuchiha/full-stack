import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/userSlice';
import '../styles/Login.css'; // Import CSS

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = () => {
    dispatch(loginUser({ phone, password }));
    // Handle login logic
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <div className="login-form">
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button onClick={handleLogin} className="login-button">Login</button>
        <div className="login-links">
          <a href="/forgot-password" className="login-link">Forgot Password?</a>
          <a href="/register" className="login-link">Register</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
