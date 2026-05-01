import { useEffect } from "react";

export default function OAuthCallback() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const userId = params.get("userId");

      if (token && token.length > 0) {
        localStorage.setItem("token", token);
        if (userId) localStorage.setItem("userId", userId);

        // Decode JWT to get the role
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role;

        // Redirect based on role
        if (role === 'ADMIN') {
          window.location.replace("/admin/dashboard");
        } else if (role === 'TECHNICIAN') {
          window.location.replace("/technician/tickets");
        } else {
          window.location.replace("/user");
        }

      } else {
        window.location.replace("/login");
      }
    } catch (err) {
      console.error("OAuth callback error:", err);
      window.location.replace("/login");
    }
  }, []);

  return (
    <div style={{
      display: "flex", alignItems: "center",
      justifyContent: "center", height: "100vh"
    }}>
      <p style={{ fontSize: "18px", color: "#718096" }}>
        Logging you in, please wait...
      </p>
    </div>
  );
}