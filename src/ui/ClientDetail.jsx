import React, { useEffect, useState } from "react";
import { api } from "../api";
import { useNavigate, useParams } from "react-router-dom";

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    try {
      const c = await api.get(`/clients/${id}`);
      const p = await api.get(`/clients/${id}/policies`);
      setClient(c.data);
      setPolicies(p.data || []);
    } catch (e) {
      setErr(e?.response?.data?.detail || e.message);
    }
  }

  useEffect(() => { load(); }, [id]);

  return (
    <div style={{ marginTop: 16 }}>
      <div className="card">
        <div className="row">
          <div>
            <h2>Client 360</h2>
            <p className="sub">
              {client ? `${client.name} • Risk ${Math.round(client.risk_score)} • Engagement ${Math.round(client.engagement_score)}` : "Loading…"}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" onClick={() => navigate("/clients")}>Back</button>
            <button className="btn danger" onClick={async () => {
              if (!confirm("Delete this client?")) return;
              try { await api.delete(`/clients/${id}`); navigate("/clients"); }
              catch (e) { setErr(e?.response?.data?.detail || e.message); }
            }}>Delete</button>
          </div>
        </div>

        {err ? <div style={{ marginTop: 10 }}>{err}</div> : null}

        <div className="card" style={{ marginTop: 14, background: "rgba(255,255,255,0.04)" }}>
          <h2>Policies</h2>
          <p className="sub">Premiums, frequency, commission rates.</p>

          <table className="table">
            <thead><tr><th>Type</th><th>Carrier</th><th>Premium</th><th>Frequency</th><th>Commission</th></tr></thead>
            <tbody>
              {policies.map(p => (
                <tr key={p.id}>
                  <td>{String(p.policy_type || "").toUpperCase()}</td>
                  <td>{p.carrier || "-"}</td>
                  <td>{Math.round(p.premium_amount || 0).toLocaleString()}</td>
                  <td>{p.premium_frequency}</td>
                  <td>{Math.round((p.commission_rate || 0) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 10, color: "rgba(234,240,255,0.70)", fontSize: 12 }}>
            Next: add policy creation/edit on web + meeting notes.
          </div>
        </div>
      </div>
    </div>
  );
}
