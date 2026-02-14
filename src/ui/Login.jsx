import React, { useState } from "react";
import { api } from "../api";
import { saveToken, saveMe } from "../auth";

export default function Login({ onAuthed }) {
  const [email, setEmail] = useState("admin@gouravnxmx.demo");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function seed() {
    setMsg("");
    setLoading(true);
    try {
      await api.post("/dev/seed");
      setMsg("Demo data created. Now login.");
    } catch (e) {
      setMsg(e?.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  }

  async function login(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      saveToken(res.data.access_token);
      const me = await api.get("/me");
      saveMe(me.data);
      onAuthed?.(me.data);
    } catch (e) {
      setMsg(e?.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid" style={{ marginTop: 16 }}>
      <div className="card">
        <h2>Agent Login</h2>
        <p className="sub">Use your GIIS credentials to access your dashboard.</p>

        <form onSubmit={login} style={{ marginTop: 12 }}>
          <div style={{ marginBottom: 10 }}>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          </div>
          <div style={{ marginBottom: 10 }}>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          </div>
          <button className="btn primary" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Please wait…" : "Login"}
          </button>
        </form>

        {msg ? <div style={{ marginTop: 10, color: "rgba(234,240,255,0.88)" }}>{msg}</div> : null}

        <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn" onClick={seed} disabled={loading}>Create Demo Data</button>
        </div>

        <div style={{ marginTop: 12, color: "rgba(234,240,255,0.70)", fontSize: 12 }}>
          Tip: Set <code>VITE_API_BASE_URL</code> to your Render backend URL.
        </div>
      </div>

      <div className="card">
        <h2>Made for Mumbai agents</h2>
        <p className="sub">Fast, clean, and focused on renewals + commissions (no clutter).</p>

        <div className="kpis">
          <div className="kpi"><div className="label">Focus list</div><div className="value">Top Follow-ups</div></div>
          <div className="kpi"><div className="label">Portfolio</div><div className="value">Risk Heatmap</div></div>
          <div className="kpi"><div className="label">Predictability</div><div className="value">3‑Month Forecast</div></div>
        </div>
      </div>
    </div>
  );
}
