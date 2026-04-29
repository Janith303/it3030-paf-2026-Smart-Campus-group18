import { useEffect } from "react";

export default function OAuthCallback() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      console.log("Token received:", token); // for debugging

      if (token && token.length > 0) {
        localStorage.setItem("token", token);
        console.log("Token saved, redirecting...");
        window.location.replace("/user");
      } else {
        console.log("No token found, redirecting to login...");
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