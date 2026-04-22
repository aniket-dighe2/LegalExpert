export default function Topbar({ user }) {
  return (
    <div style={styles.topbar}>
      <h3>Dashboard</h3>
      <div style={styles.user}>
        {user.name}
      </div>
    </div>
  )
}

const styles = {
  topbar: {
    height: "60px",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 30px",
    boxShadow: "0 1px 8px rgba(0,0,0,0.1)"
  },
  user: {
    background: "#e0e7ff",
    padding: "6px 14px",
    borderRadius: "20px"
  }
}
