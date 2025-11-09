import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

export default function Form({ type, submit }) {
  const [data, setData] = useState({
    username: "", 
    password: "",
    linkedin_link: "",
    interests: "",
    skills: "",
    major: "",
    preferences: ""
  });
  const [error, setError] = useState("");

  const changeValue = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      await submit(data);
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login-form">
        <form onSubmit={submitForm} className="form" method="post">
          <h2 className="login-title">HackrMatch</h2> 
          <h3 className="login-type">{type === "login" ? "Login" : "Register"}</h3>
            <input 
              name="username"
              className="user-input" 
              placeholder="Username"
              value={data.username}
              onChange={changeValue}
              minLength="3"
              maxLength="20"
              required
            />
            <br />
            
            <input
              name="password"
              type="password"
              className="password-input"
              placeholder="Password"
              value={data.password}
              onChange={changeValue}
              minLength="8"
              maxLength="20"
              required
            />
            <br />
            {type === "register" && (
              <>
                <input 
                  name="linkedin_link"
                  className="user-input"
                  placeholder="LinkedIn Profile URL"
                  value={data.linkedin_link}
                  onChange={changeValue}
                  type="url"
                  required
                />
                <br />
                <input 
                  name="interests"
                  className="user-input"
                  placeholder="Interests (e.g., AI, Web Dev, Mobile Apps)"
                  value={data.interests}
                  onChange={changeValue}
                  required
                />
                <br />
                <input 
                  name="skills"
                  className="user-input"
                  placeholder="Skills (e.g., Python, React, Node.js)"
                  value={data.skills}
                  onChange={changeValue}
                  required
                />
                <br />
                <input 
                  name="major"
                  className="user-input"
                  placeholder="Major (e.g., Computer Science)"
                  value={data.major}
                  onChange={changeValue}
                  required
                />
                <br />
                <input 
                  name="preferences"
                  className="user-input"
                  placeholder="Team Preferences (e.g., Backend, Java, UI/UX)"
                  value={data.preferences}
                  onChange={changeValue}
                  required
                />
                <br />
              </>
            )}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
          <div className="submit-wrapper">
            <button className="submit" type="submit">
              {type === "login" ? "Login" : "Register"}
            </button>
          </div>

          <p className="form-footer">
            {type === "login" ? "Don't have an account?" : "Already have an account?"}
            <Link 
              to={type === "login" ? "/register" : "/login"}
              className="auth-link"
            >
              {type === "login" ? " Register here" : " Login here"}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
