import React, { useEffect, useState } from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { api } from "../api";
import { loadToken, loadMe, saveMe, clearToken } from "../auth";

import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";
import Clients from "./Clients.jsx";
import ClientDetail from "./ClientDetail.jsx";

function TopBar({ me, onLogout }) {
  return (
    <div className="topbar">
      <div className="brand">
        <div className="logo" />
        <div>
          <h1>GIIS — GouravNxMx</h1>
          <p>Mumbai-first Insurance Intelligence • scalable to USA</p>
        </div>
      </div>

      <div className="nav">
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>Dashboard</NavLink>
        <NavLink to="/clients" className={({ isActive }) => (isActive ? "active" : "")}>Clients</NavLink>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {me ? <span style={{ color: "rgba(234,240,255,0.72)", fontSize: 12 }}>{me.name}</span> : null}
        {me ? <button className="btn" onClick={onLogout}>Logout</button> : null}
      </div>
    </div>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [me, setMe] = useState(loadMe());
  const navigate = useNavigate();

  useEffect(() => {
    loadToken();
    async function boot() {
      const token = localStorage.getItem("giis_token_v1");
      if (token) {
        try {
          const res = await api.get("/me");
          saveMe(res.data);
          setMe(res.data);
        } catch {
          clearToken();
          setMe(null);
        }
      }
      setReady(true);
    }
    boot();
  }, []);

  function logout() {
    clearToken();
    setMe(null);
    navigate("/login");
  }

  if (!ready) return <div className="container"><div className="card">Loading…</div></div>;

  return (
    <div className="container">
      <TopBar me={me} onLogout={logout} />

      <Routes>
        <Route path="/" element={<Login onAuthed={(m) => { setMe(m); navigate("/dashboard"); }} />} />
        <Route path="/login" element={<Login onAuthed={(m) => { setMe(m); navigate("/dashboard"); }} />} />
        <Route path="/dashboard" element={<Dashboard me={me} />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/clients/:id" element={<ClientDetail />} />
        <Route path="*" element={<div className="card" style={{ marginTop: 16 }}>Not found</div>} />
      </Routes>

      <div className="footer">
        © {new Date().getFullYear()} GouravNxMx • Built for agents who want predictable commissions.
      </div>
    </div>
  );
}
