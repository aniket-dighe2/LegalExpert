import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.detail || "Login failed")
        return
      }

      login(data.user)

      alert("Login successful")
      navigate("/dashboard")
    } catch (error) {
      alert("Server error")
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* LEFT SECTION */}
        <div style={styles.left}>
          <h1 style={styles.logo}>LexAI</h1>
          <h2 style={styles.heading}>AI-Powered Legal Assistant</h2>
          <p style={styles.text}>
            Search, analyze & understand legal documents
            using intelligent AI technology.
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div style={styles.card}>
          <h3 style={styles.title}>Welcome Back</h3>
          <p style={styles.subtitle}>Login to your account</p>

          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div style={styles.options}>
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <span style={styles.forgot}>Forgot password?</span>
          </div>

          <button style={styles.button} onClick={handleLogin}>
            Login
          </button>

          <p style={styles.signup}>
            Don’t have an account?{" "}
            <span
              style={styles.link}
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>

      </div>
    </div>
  )
}

const styles = {
  page: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #eef2ff, #e0f2fe)",
  },

  container: {
    width: "900px",
    height: "520px",
    display: "flex",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    background: "#fff",
  },

  left: {
    flex: 1,
    padding: "50px",
    background: "linear-gradient(160deg, #1e3a8a, #2563eb)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  logo: {
    fontSize: "36px",
    marginBottom: "10px",
  },

  heading: {
    fontSize: "22px",
    fontWeight: "400",
    marginBottom: "20px",
  },

  text: {
    fontSize: "15px",
    lineHeight: "1.6",
    opacity: 0.9,
  },

  card: {
    flex: 1,
    padding: "50px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  title: {
    fontSize: "26px",
    marginBottom: "5px",
  },

  subtitle: {
    color: "#64748b",
    marginBottom: "25px",
  },

  input: {
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
  },

  options: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    marginBottom: "20px",
  },

  forgot: {
    color: "#2563eb",
    cursor: "pointer",
  },

  button: {
    padding: "12px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    cursor: "pointer",
  },

  signup: {
    marginTop: "20px",
    fontSize: "14px",
  },

  link: {
    color: "#2563eb",
    cursor: "pointer",
  },
}
