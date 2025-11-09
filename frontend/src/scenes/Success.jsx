import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';

export default function SuccessPage(){
  const navigate = useNavigate();
  return (
    <div className="main-container">
      <main className="main-content">
        <h1>Registration Successful</h1>
  <p>Account creation successful! Get ready to start finding the perfect hackathon teammate by logging in.</p>
        <button className="cta-button" onClick={() => navigate('/login')}>Go to Login</button>
      </main>
    </div>
  )
}
