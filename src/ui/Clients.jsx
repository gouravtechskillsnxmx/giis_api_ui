import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";

export default function Clients() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    try {
      const res = await api.get("/clients");
      setRows(res.data || []);
    } catch (e) {
      setErr(e?.response?.data?.detail || e.message);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => rows.filter(r => (r.name || "").toLowerCase().includes(q.toLowerCase())), [rows, q]);

  return (
    <div style={{ marginTop: 16 }}>
      <div className="card">
        <div className="row">
          <div>
            <h2>Clients</h2>
            <p className="sub">Search and open client 360.</p>
          </div>
          <button className="btn" onClick={load}>Refresh</button>
        </div>

        <div style={{ marginTop: 10 }}>
          <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name…" />
        </div>

        {err ? <div style={{ marginTop: 10 }}>{err}</div> : null}

        <table className="table">
          <thead><tr><th>Name</th><th>City</th><th>Risk</th><th>Action</th></tr></thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.city || "-"}</td>
                <td>{Math.round(r.risk_score)}</td>
                <td><Link className="btn" to={`/clients/${r.id}`}>Open</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
