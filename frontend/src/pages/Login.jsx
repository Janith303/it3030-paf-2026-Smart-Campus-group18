import { Building2, Calendar, AlertCircle, BarChart3, ShieldCheck } from 'lucide-react';

export default function Login() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google?prompt=select_account";
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "system-ui, sans-serif" }}>
      
      {/* Left Half — Indigo gradient with features */}
      <div style={{
        flex: 1,
        background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "64px",
        color: "white",
        position: "relative",
        overflow: "hidden"
      }}>

        {/* Background decoration circles */}
        <div style={{
          position: "absolute", top: "-80px", right: "-80px",
          width: "300px", height: "300px", borderRadius: "50%",
          background: "rgba(255,255,255,0.05)"
        }} />
        <div style={{
          position: "absolute", bottom: "-60px", left: "-60px",
          width: "250px", height: "250px", borderRadius: "50%",
          background: "rgba(255,255,255,0.05)"
        }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "48px" }}>
          <div style={{
            background: "rgba(255,255,255,0.2)", padding: "10px",
            borderRadius: "12px", display: "flex"
          }}>
            <Building2 size={28} color="white" />
          </div>
          <span style={{ fontSize: "22px", fontWeight: "700" }}>Smart Campus</span>
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: "40px", fontWeight: "800",
          lineHeight: "1.2", marginBottom: "16px"
        }}>
          Manage Your<br />Campus Operations<br />
          <span style={{ color: "#86efac" }}>Effortlessly</span>
        </h1>

        <p style={{
          fontSize: "16px", color: "rgba(255,255,255,0.8)",
          marginBottom: "48px", lineHeight: "1.6", maxWidth: "400px"
        }}>
          A comprehensive platform for managing university facilities, resource bookings, and maintenance tickets.
        </p>

        {/* Feature list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { icon: <Calendar size={18} />, text: "Smart resource booking & scheduling" },
            { icon: <AlertCircle size={18} />, text: "Real-time incident tracking" },
            { icon: <BarChart3 size={18} />, text: "Comprehensive analytics dashboard" },
            { icon: <ShieldCheck size={18} />, text: "Enterprise-grade security" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                background: "rgba(255,255,255,0.2)",
                padding: "8px", borderRadius: "8px", display: "flex"
              }}>
                {item.icon}
              </div>
              <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{
          display: "flex", gap: "32px", marginTop: "48px",
          paddingTop: "32px", borderTop: "1px solid rgba(255,255,255,0.2)"
        }}>
          {[
            { value: "500+", label: "Resources" },
            { value: "10K+", label: "Bookings" },
            { value: "98%", label: "Uptime" },
          ].map((stat, i) => (
            <div key={i}>
              <div style={{ fontSize: "24px", fontWeight: "800" }}>{stat.value}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Half — Login form */}
      <div style={{
        flex: 1, background: "#f8fafc",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "64px"
      }}>
        <div style={{
          background: "white", borderRadius: "20px",
          padding: "48px", width: "100%", maxWidth: "420px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          border: "1px solid #e2e8f0"
        }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{
              background: "#eef2ff", width: "56px", height: "56px",
              borderRadius: "16px", display: "flex",
              alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px"
            }}>
              <Building2 size={28} color="#6366f1" />
            </div>
            <h2 style={{
              fontSize: "24px", fontWeight: "700",
              color: "#0f172a", marginBottom: "8px"
            }}>
              Welcome Back
            </h2>
            <p style={{ color: "#64748b", fontSize: "14px" }}>
              Sign in to access Smart Campus Operations Hub
            </p>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleLogin}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "12px", width: "100%", padding: "14px 24px",
              background: "white", border: "2px solid #e2e8f0",
              borderRadius: "12px", cursor: "pointer", fontSize: "15px",
              fontWeight: "600", color: "#1a202c",
              transition: "all 0.2s", marginBottom: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
            }}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = "#6366f1";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)";
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
            }}
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              width="20" height="20"
            />
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{
            display: "flex", alignItems: "center",
            gap: "12px", marginBottom: "24px"
          }}>
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
            <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "500" }}>
              SECURE LOGIN
            </span>
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
          </div>

          {/* Info text */}
          <div style={{
            background: "#f8fafc", borderRadius: "12px",
            padding: "16px", textAlign: "center"
          }}>
            <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.6" }}>
              By signing in, you agree to our terms of service. 
              Your role will be assigned by your administrator.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p style={{ marginTop: "24px", fontSize: "12px", color: "#94a3b8" }}>
          © 2026 Smart Campus Operations Hub. All rights reserved.
        </p>
      </div>
    </div>
  );
}