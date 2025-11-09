import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <nav>
        <div className="nav-left">
          <ul>
            <li className="logo"><Link to="/">HackrMatch</Link></li>
          </ul>
        </div>
        <div className="nav-right">
          {!isLoggedIn && <Link to="/login" className="nav-link">Log In</Link>}
          {!isLoggedIn && <Link to="/register" className="nav-link">Sign Up</Link>}
          {isLoggedIn && <Link to="/match" className="nav-link">Matches</Link>}
          {isLoggedIn && <button className="logout-button" onClick={handleLogout}>Logout</button>}
        </div>
      </nav>
    </header>
  );
}