import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function Signup() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("All fields are required")
      return
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        alert("Signup successful. Please login.")
        navigate("/login")
      } else {
        alert(data.detail || "Signup failed")
      }
    } catch (err) {
      alert("Backend not reachable")
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* LEFT SIDE */}
        <div style={styles.left}>
          <h1 style={styles.logo}>LexAI</h1>
          <h2 style={styles.heading}>Join LexAI Today</h2>
          <p style={styles.text}>
            Create your account to upload, analyze and
            query legal documents using AI.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div style={styles.card}>
          <h3 style={styles.title}>Create Account</h3>
          <p style={styles.subtitle}>Sign up to get started</p>

          <input
            style={styles.input}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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

          <input
            style={styles.input}
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button style={styles.button} onClick={handleSignup}>
            Sign Up
          </button>

          <p style={styles.login}>
            Already have an account?{" "}
            <span
              style={styles.link}
              onClick={() => navigate("/login")}
            >
              Login
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
    height: "540px",
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

  button: {
    padding: "12px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    cursor: "pointer",
  },

  login: {
    marginTop: "20px",
    fontSize: "14px",
  },

  link: {
    color: "#2563eb",
    cursor: "pointer",
  },
}
