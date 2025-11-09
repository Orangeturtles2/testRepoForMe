// frontend/src/scenes/Register.jsx
import { useNavigate } from "react-router-dom";
import Form from "../components/Form";
import axios from "axios";

const handleSubmit = async (data, navigate) => {
  
  try {
    const res = await axios.post("http://localhost:8000/users/", data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true
    })
    if (res.status === 201) {
      navigate("/success")
    }
  } catch (e) {
    // This will now catch the specific "Username already registered" error from main.py
    console.error("Error registering user:", e.response?.data || e.message);
    alert(e.response?.data?.detail || e.message);
  }
};

export default function Register() {
  const navigate = useNavigate();

  return (
    <Form
      type="register"
      submit={(data) => handleSubmit(data, navigate)}
    />
  );
}