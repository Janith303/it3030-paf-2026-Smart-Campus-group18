import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/user"); // redirect to user dashboard after login
    } else {
      navigate("/login");
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