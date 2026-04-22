export default function UploadCard({ onUpload, status }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2>Upload Legal Document</h2>

        <p style={styles.text}>
          Upload a PDF, image, or text file and ask AI questions about it.
        </p>

        <label style={styles.uploadBtn}>
           Upload file
          <input
            type="file"
            hidden
            accept=".pdf,.txt,.png,.jpg,.jpeg"
            onChange={onUpload}
          />
        </label>

        {status && <p style={styles.status}>{status}</p>}

        <div style={styles.icons}>
          <span title="Cloud upload">☁️</span>
          <span title="Local file">📁</span>
          <span title="Link upload">🔗</span>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: "40px",
  },

  card: {
    width: "800px",
    padding: "50px",
    borderRadius: "18px",
    background: "#ffffff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    textAlign: "center",
  },

  text: {
    color: "#6b7280",
    marginBottom: "30px",
  },

  uploadBtn: {
    display: "inline-block",
    background: "#ef4444",
    color: "#fff",
    padding: "14px 40px",
    borderRadius: "999px",
    fontSize: "16px",
    cursor: "pointer",
  },

  status: {
    marginTop: "20px",
    fontSize: "14px",
  },

  icons: {
    marginTop: "30px",
    fontSize: "22px",
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    opacity: 0.8,
  },
}
