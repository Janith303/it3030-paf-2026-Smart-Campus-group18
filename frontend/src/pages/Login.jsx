export default function Login() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      height: "100vh", background: "#f0f4f8"
    }}>
      <div style={{
        background: "white", padding: "48px",
        borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        textAlign: "center", maxWidth: "400px", width: "100%"
      }}>
        <h1 style={{ marginBottom: "8px", color: "#1a202c" }}>
          Smart Campus
        </h1>
        <p style={{ color: "#718096", marginBottom: "32px" }}>
          Operations Hub — Please sign in to continue
        </p>
        <button
          onClick={handleGoogleLogin}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "12px", width: "100%", padding: "12px 24px",
            background: "white", border: "2px solid #e2e8f0",
            borderRadius: "8px", cursor: "pointer", fontSize: "16px",
            fontWeight: "500", color: "#1a202c",
            transition: "all 0.2s"
          }}
          onMouseOver={e => e.currentTarget.style.background = "#f7fafc"}
          onMouseOut={e => e.currentTarget.style.background = "white"}
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            width="20" height="20"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}