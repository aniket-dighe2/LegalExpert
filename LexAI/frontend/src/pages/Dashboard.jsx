import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "../context/AuthContext"
import UploadCard from "../components/UploadCard"

export default function Dashboard() {
  const navigate = useNavigate()
  const chatEndRef = useRef(null)

  const { user, logout } = useAuth()

  const [status, setStatus] = useState("")
  const [filename, setFilename] = useState("")
  const [question, setQuestion] = useState("")
  const [chat, setChat] = useState([])

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chat])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  // ================= FILE UPLOAD =================
  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      setStatus("Uploading document...")

      // 1️⃣ Upload file
      const uploadRes = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      })

      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) throw new Error()

      setFilename(uploadData.filename)
      setStatus("Indexing document...")

      // 2️⃣ Index document
      const indexRes = await fetch("http://127.0.0.1:8000/upload-and-index", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: uploadData.filename,
          user_id: user.id,
        }),
      })

      if (!indexRes.ok) throw new Error()

      setStatus("Document ready for questions")
    } catch {
      setStatus("Upload or indexing failed")
    }
  }

  // ================= ASK QUESTION =================
  const askQuestion = async () => {
    if (!question.trim()) return

    setChat((prev) => [...prev, { role: "user", text: question }])
    const currentQuestion = question
    setQuestion("")

    try {
      const res = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion,
          user_id: user.id,
        }),
      })

      const data = await res.json()

      setChat((prev) => [
        ...prev,
        { role: "ai", text: data.answer || "I don't know" },
      ])
    } catch {
      setChat((prev) => [
        ...prev,
        { role: "ai", text: "Error answering question" },
      ])
    }
  }

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.logo}>LexAI</h2>
        <button onClick={handleLogout} style={styles.logout}>
          Logout
        </button>
      </div>

      {/* Main */}
      <div style={styles.center}>
        <div style={styles.card}>
          <h3 style={styles.welcome}>Welcome, {user?.name}</h3>
          <h1 style={styles.title}>LexAI Dashboard</h1>

          {/* Upload Card */}
          <UploadCard onUpload={handleUpload} status={status} />

          {/* Chat */}
          {filename && (
            <>
              <div style={styles.chatBox}>
                {chat.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.message,
                      alignSelf:
                        msg.role === "user" ? "flex-end" : "flex-start",
                      background:
                        msg.role === "user" ? "#ef4444" : "#e5e7eb",
                      color: msg.role === "user" ? "#fff" : "#000",
                    }}
                  >
                    {msg.text}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div style={styles.askBar}>
                <input
                  style={styles.input}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && askQuestion()}
                  placeholder="Ask a question about the document..."
                />
                <button style={styles.askBtn} onClick={askQuestion}>
                  Ask
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}


const styles = {
  page: { height: "100vh", background: "#f8fafc" },

  navbar: {
    height: 64,
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  logo: { color: "#ef4444", fontWeight: 700 },

  logout: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer",
  },

  center: { display: "flex", justifyContent: "center", marginTop: 40 },

  card: {
    width: 800,
    background: "#fff",
    padding: 40,
    borderRadius: 16,
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  },

  welcome: { color: "#64748b" },
  title: { marginBottom: 20 },

  mainButton: {
    background: "#ef4444",
    color: "#fff",
    padding: "14px 40px",
    border: "none",
    borderRadius: 50,
    fontSize: 16,
    cursor: "pointer",
  },

  status: { marginTop: 15 },

  chatBox: {
    marginTop: 30,
    height: 260,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: 10,
    border: "1px solid #e5e7eb",
    borderRadius: 10,
  },

  message: {
    padding: 12,
    borderRadius: 12,
    maxWidth: "70%",
  },

  askBar: {
    display: "flex",
    gap: 10,
    marginTop: 15,
  },

  input: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    border: "1px solid #cbd5e1",
  },

  askBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "0 20px",
    borderRadius: 8,
    cursor: "pointer",
  },
}
