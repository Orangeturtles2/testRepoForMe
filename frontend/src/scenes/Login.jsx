import { useNavigate } from "react-router-dom"
import Form from "../components/Form" 
import axios from "axios"
import { useAuth } from "../context/AuthContext"

const handleSubmit = async (data, navigate, login) => {
  try {
    const newData = {
      username: data.username,
      password: data.password
    };

    const res = await axios.post("http://localhost:8000/login", newData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true //need credentials for cookies
    })
    if (res.status == 200) {
      // Use AuthContext to record login state and persist user id
      if (res.data && res.data.user_id) {
        try {
          login(res.data.user_id)
        } catch (e) {
          // fallback
          localStorage.setItem('user_id', res.data.user_id)
        }
      }
      navigate("/match")
    }
  }
  catch(e) {
    console.error(`Error Logging in ${e}`)
  }
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  return (
    <Form type="login" submit={(data) => {
      handleSubmit(data, navigate, login)
    }}/>
  )
}