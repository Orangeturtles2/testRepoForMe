import React from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css"
import teamWork from "../images/teamwork.png"
import techyimage from "../images/techyimage.jpg"
import brainyimage from "../images/brainyimage.jpg"
import Header from "../components/Header"

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div className = "main-container">
      <Header />

      <main className = "main-content">
        <h1>Welcome to HackrMatch!</h1>
        
        <p>
          HackrMatch helps developers and students find and join teams for hackathons and
          projects! Connect with like-minded individuals,
          collaborate, and build amazing things together!
        </p>
        <button className="cta-button" onClick={() => navigate("/register")}>
          Get Started
        </button>
      </main>

      <section className="features">
        <div className="feature-tile">
          <img src={teamWork} alt="Smart Team Matching" className="feature-image" />
          <h3>Smart Team Matching</h3>
          <p>Personalized matches using profile similarity, skills and interests to assemble balanced teams fast.</p>
        </div>
        <div className="feature-tile">
          <img src={techyimage} alt="Project Discovery" className="feature-image" />
          <h3>Project Discovery</h3>
          <p>Find projects and teammates that align with your goals and discover opportunities that match your skillset.</p>
        </div>
        <div className="feature-tile">
          <img src={brainyimage} alt="Collaboration Tools" className="feature-image" />
          <h3>Collaboration Tools</h3>
          <p>Built-in workflows and shared links to help your team prototype, coordinate, and ship faster.</p>
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 HackrMatch. All rights reserved.</p>
      </footer>
    </div>
  );
}


