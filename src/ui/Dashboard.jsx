import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api";

function nfmt(x) { if (x === null || x === undefined) return "-"; return Math.round(x).toLocaleString(); }
function dotClass(bucket) {
  const b = (bucket || "").toLowerCase();
  if (b === "red" || b === "high") return "dot red";
  if (b === "yellow" || b === "medium") return "dot yellow";
  return "dot green";
}

export default function Dashboard({ me }) {
  const [forecast, setForecast] = useState(null);
  const [heatmap, setHeatmap] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    try {
      const f = await api.get("/insights/revenue-forecast?months=3");
      const h = await api.get("/insights/portfolio-heatmap?limit=8");
      const fu = await api.get("/insights/top-followups?limit=8");
      setForecast(f.data);
      setHeatmap(h.data);
      setFollowups(fu.data);
    } catch (e) {
      setErr(e?.response?.data?.detail || e.message);
    }
  }

  useEffect(() => { load(); }, []);

  const totals = useMemo(() => {
    if (!forecast) return { prem: 0, comm: 0 };
    const prem = (forecast.expected_premium || []).reduce((a, b) => a + (b || 0), 0);
    const comm = (forecast.expected_commission || []).reduce((a, b) => a + (b || 0), 0);
    return { prem, comm };
  }, [forecast]);

  return (
    <div className="grid" style={{ marginTop: 16 }}>
      <div>
        <div className="card">
          <div className="row">
            <div>
              <h2>Dashboard</h2>
              <p className="sub">Forecast + heatmap + priority calls.</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn" onClick={load}>Refresh</button>
              <button className="btn primary" onClick={async () => {
                try { await api.post("/insights/recompute"); await load(); }
                catch (e) { setErr(e?.response?.data?.detail || e.message); }
              }}>Recompute Scores</button>
            </div>
          </div>

          {err ? <div style={{ marginTop: 10 }}>{err}</div> : null}

          <div className="kpis">
            <div className="kpi"><div className="label">3‑Month Expected Premium</div><div className="value">{nfmt(totals.prem)}</div></div>
            <div className="kpi"><div className="label">3‑Month Expected Commission</div><div className="value">{nfmt(totals.comm)}</div></div>
            <div className="kpi"><div className="label">Tenant</div><div className="value">{me?.tenant?.name || "—"}</div></div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 14 }}>
          <div className="row">
            <h2>Revenue Forecast (3 months)</h2>
            <span className="sub">Rule-based v1</span>
          </div>
          <table className="table">
            <thead><tr><th>Month</th><th>Expected Premium</th><th>Expected Commission</th></tr></thead>
            <tbody>
              {forecast?.months?.map((m, i) => (
                <tr key={m}>
                  <td>{m}</td>
                  <td>{nfmt(forecast.expected_premium?.[i])}</td>
                  <td>{nfmt(forecast.expected_commission?.[i])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="card">
          <h2>Top Risk Clients</h2>
          <p className="sub">Coverage gaps + concentration + engagement.</p>
          <table className="table">
            <thead><tr><th>Client</th><th>Risk</th></tr></thead>
            <tbody>
              {heatmap.map(r => (
                <tr key={r.client_id}>
                  <td>{r.client_name}</td>
                  <td>
                    <span className="badge">
                      <span className={dotClass(r.bucket)} />
                      {Math.round(r.risk_score)} • {String(r.bucket).toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ marginTop: 14 }}>
          <h2>Top Follow-ups</h2>
          <p className="sub">Who to call this week.</p>
          <table className="table">
            <thead><tr><th>Client</th><th>Score</th></tr></thead>
            <tbody>
              {followups.map(r => (
                <tr key={r.client_id}>
                  <td>{r.client_name}</td>
                  <td>
                    <span className="badge">
                      <span className={dotClass(r.bucket)} />
                      {Math.round(r.followup_score)} • {String(r.bucket).toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
