import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

// Match view: fetch similar users from backend and render them like cards
export default function Match() {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userId } = useAuth();

  useEffect(() => {
    const storedUserId = userId || localStorage.getItem("user_id");
    if (!storedUserId) {
      setError("Not logged in. Please log in to see matches.");
      setLoading(false);
      return;
    }

    let canceled = false;
    const base = "http://localhost:8000";

    (async () => {
      try {
        const res = await fetch(`${base}/users/${storedUserId}/similar`);
        if (!res.ok) {
          throw new Error(`Failed to fetch similar users: ${res.status}`);
        }
        const data = await res.json();
        const similar = data.similar_users || {};
        const ids = Object.keys(similar).filter((id) => id !== storedUserId);

        // Fetch each user's details
        const users = await Promise.all(
          ids.map(async (id) => {
            try {
              const r = await fetch(`${base}/users/${id}`);
              if (!r.ok) return null;
              return await r.json();
            } catch (e) {
              return null;
            }
          })
        );

        const cleaned = users
          .filter(Boolean)
          .map((u) => {
            // normalize fields: split on commas and whitespace, trim, remove empties
            const normalize = (val) => {
              if (!val) return [];
              if (Array.isArray(val)) {
                return val
                  .map((x) => String(x))
                  .flatMap((x) => x.split(/[,;]+/))
                  .map((s) => s.trim())
                  .filter(Boolean);
              }
              return String(val)
                .split(/[,;]+/)
                .map((s) => s.trim())
                .filter(Boolean);
            };

            const skills = normalize(u.skills);
            const preferences = normalize(u.preferences);
            const interests = normalize(u.interests);

            return {
              id: u.id,
              username: u.username,
              skills,
              preferences,
              interests,
              skill: skills.length ? skills[0] : "",
              major: u.major || "",
            };
          })
          // Extra filter to be safe: remove any profile matching current user id
          .filter((p) => p.id !== storedUserId);

        if (!canceled) {
          setProfiles(cleaned.length ? cleaned : []);
          setLoading(false);
        }
      } catch (e) {
        if (!canceled) {
          setError(e.message);
          setLoading(false);
        }
      }
    })();

    return () => {
      canceled = true;
    };
  }, [userId]);

  const handleDecision = (accepted) => {
    // TODO: optionally POST decision to backend
    setCurrentIndex((prev) => prev + 1);
  };

  if (loading) return <p className="center-message">Loading matches...</p>;
  if (error) return <p className="center-message">{error}</p>;
  if (!profiles.length || !profiles[currentIndex]) return <p className="center-message">No more profiles!</p>;

  const currentProfile = profiles[currentIndex];

  // helper to collapse multiple spaces into one and trim
  const clean = (val) => {
    if (val === null || val === undefined) return "";
    // collapse any whitespace runs, normalize repeated commas and ensure single-space after commas
    return String(val)
      .replace(/,+/g, ",")            // collapse repeated commas
      .replace(/,\s*/g, ", ")        // single space after comma
      .replace(/\s+/g, " ")          // collapse whitespace
      .trim();
  };

  // format lists (array or comma/semicolon-separated string) into a clean, single-spaced
  // comma-separated string (e.g. "Node, js, python")
  const formatList = (raw) => {
    if (!raw && raw !== 0) return "";
    let parts = [];
    if (Array.isArray(raw)) {
      parts = raw.flatMap((r) => String(r).split(/[;,]+/));
    } else {
      parts = String(raw).split(/[;,]+/);
    }
    const tokens = parts
      .map((t) => String(t).replace(/\s+/g, " ").trim())
      .filter(Boolean);
    return tokens.join(", ");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
  <h2 style={{ margin: 0 }}>{clean(currentProfile.username)}</h2>
  <p style={{ margin: '6px 0' }}><strong>Skills:</strong> {formatList(currentProfile.skills)}</p>
  <p style={{ margin: '6px 0' }}><strong>Preferences:</strong> {formatList(currentProfile.preferences)}</p>
  <p style={{ margin: '6px 0' }}><strong>Interests:</strong> {formatList(currentProfile.interests)}</p>
  <p style={{ margin: '6px 0' }}><strong>Skill:</strong> {clean(currentProfile.skill)}</p>
  <p style={{ margin: '6px 0' }}><strong>Major:</strong> {clean(currentProfile.major)}</p>

        <div style={styles.buttonContainer}>
          <button
            style={{ ...styles.button, backgroundColor: "#f44336" }}
            onClick={() => handleDecision(false)}
          >
            Reject
          </button>
          <button
            style={{ ...styles.button, backgroundColor: "#4CAF50" }}
            onClick={() => handleDecision(true)}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "75vh",
    backgroundColor: "#ececec",
  },
  card: {
    width: "360px",
    height: "400px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },
};
