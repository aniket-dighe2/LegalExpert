export default function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>LexAI</h2>

      <nav>
        <p style={styles.active}>Dashboard</p>
        <p style={styles.item}>Upload Documents</p>
        <p style={styles.item}>Ask AI</p>
        <p style={styles.item}>History</p>
      </nav>

      <button
        style={styles.logout}
        onClick={() => {
          localStorage.clear()
          window.location.href = "/login"
        }}
      >
        Logout
      </button>
    </div>
  )
}

const styles = {
  sidebar: {
    width: "250px",
    background: "#0f172a",
    color: "#fff",
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  logo: {
    fontSize: "26px",
    fontWeight: "bold"
  },
  item: {
    padding: "12px 0",
    cursor: "pointer",
    opacity: 0.8
  },
  active: {
    padding: "12px 0",
    fontWeight: "bold"
  },
  logout: {
    background: "#1e293b",
    border: "none",
    color: "white",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer"
  }
}
