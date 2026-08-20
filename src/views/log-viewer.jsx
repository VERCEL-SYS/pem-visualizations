import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "pem-access-log";

export default function LogViewer() {
  const navigate = useNavigate();
  const [log, setLog] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const entries = JSON.parse(stored);
        setLog(entries.reverse());
      }
    } catch (e) {}
  }, []);

  const filtered = filter === "all" ? log : log.filter((e) => e.type === filter);

  const typeColor = (type) => {
    switch (type) {
      case "access_granted": return "#22c55e";
      case "access_denied": return "#ef4444";
      case "lockout": return "#ef4444";
      case "screen_shown": return "#64748b";
      default: return "#94a3b8";
    }
  };

  const typeLabel = (type) => {
    switch (type) {
      case "access_granted": return "ACCESO";
      case "access_denied": return "DENEGADO";
      case "lockout": return "BLOQUEADO";
      case "screen_shown": return "VISTA";
      default: return type;
    }
  };

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });
    } catch { return "-"; }
  };

  const formatTime = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch { return "-"; }
  };

  const parseBrowser = (ua) => {
    if (!ua) return "Desconocido";
    if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
    if (ua.includes("Edg")) return "Edge";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
    return "Otro";
  };

  const parseOS = (ua, platform) => {
    if (!ua) return platform || "Desconocido";
    if (ua.includes("Windows")) return "Windows";
    if (ua.includes("Mac")) return "macOS";
    if (ua.includes("iPhone")) return "iPhone";
    if (ua.includes("Android")) return "Android";
    if (ua.includes("Linux")) return "Linux";
    return platform || "Otro";
  };

  const clearLog = () => {
    if (window.confirm("¿Borrar todo el log de accesos?")) {
      localStorage.removeItem(STORAGE_KEY);
      setLog([]);
    }
  };

  const exportLog = () => {
    const csv = [
      "Fecha,Hora,Tipo,Detalle,IP,Ciudad,País,Navegador,OS,Pantalla",
      ...log.map((e) =>
        [
          formatDate(e.timestamp),
          formatTime(e.timestamp),
          typeLabel(e.type),
          e.details || "",
          e.ip || "",
          e.city || "",
          e.country || "",
          parseBrowser(e.userAgent),
          parseOS(e.userAgent, e.platform),
          e.screen || "",
        ].map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pem-access-log-" + new Date().toISOString().slice(0, 10) + ".csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Stats
  const totalAccess = log.filter((e) => e.type === "access_granted").length;
  const totalDenied = log.filter((e) => e.type === "access_denied").length;
  const totalLockout = log.filter((e) => e.type === "lockout").length;
  const uniqueIPs = [...new Set(log.filter((e) => e.ip).map((e) => e.ip))].length;

  return (
    <div style={{
      background: "#08080e", minHeight: "100vh", color: "#e2e8f0",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      padding: "24px", overflowY: "auto",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => navigate("/")} style={{
              background: "#1e293b", border: "1px solid #334155", borderRadius: 6,
              color: "#94a3b8", fontSize: 12, padding: "6px 12px", cursor: "pointer",
            }}>← Volver</button>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Registro de Accesos</h1>
            <span style={{
              background: "#f59e0b20", color: "#f59e0b", fontSize: 10,
              fontWeight: 700, padding: "3px 8px", borderRadius: 4,
            }}>PEM Security</span>
          </div>
          <p style={{ color: "#64748b", fontSize: 12, marginTop: 6 }}>
            {log.length} registros · Último: {log.length > 0 ? formatDate(log[0].timestamp) + " " + formatTime(log[0].timestamp) : "—"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={exportLog} style={{
            background: "#1e293b", border: "1px solid #334155", borderRadius: 6,
            color: "#94a3b8", fontSize: 11, padding: "6px 14px", cursor: "pointer",
          }}>Exportar CSV</button>
          <button onClick={clearLog} style={{
            background: "#1e293b", border: "1px solid #ef444430", borderRadius: 6,
            color: "#ef4444", fontSize: 11, padding: "6px 14px", cursor: "pointer",
          }}>Borrar</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Accesos", val: totalAccess, color: "#22c55e" },
          { label: "Denegados", val: totalDenied, color: "#ef4444" },
          { label: "Bloqueos", val: totalLockout, color: "#ef4444" },
          { label: "IPs únicas", val: uniqueIPs, color: "#3b82f6" },
          { label: "Total eventos", val: log.length, color: "#f59e0b" },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1, background: "#0f172a", borderRadius: 8, padding: "14px 16px",
            border: "1px solid #1e293b",
          }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[
          { key: "all", label: "Todos" },
          { key: "access_granted", label: "Accesos" },
          { key: "access_denied", label: "Denegados" },
          { key: "lockout", label: "Bloqueos" },
          { key: "screen_shown", label: "Vistas" },
        ].map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            background: filter === f.key ? "#1e293b" : "transparent",
            border: "1px solid " + (filter === f.key ? "#f59e0b50" : "#1e293b"),
            borderRadius: 6, color: filter === f.key ? "#f59e0b" : "#64748b",
            fontSize: 11, padding: "5px 12px", cursor: "pointer",
          }}>{f.label}</button>
        ))}
      </div>

      {/* Log table */}
      <div style={{ background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e293b" }}>
              {["Fecha", "Hora", "Tipo", "Detalle", "IP", "Ubicación", "Navegador", "OS", "Pantalla"].map((h) => (
                <th key={h} style={{
                  padding: "10px 12px", textAlign: "left", color: "#64748b",
                  fontSize: 10, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ padding: 24, textAlign: "center", color: "#475569" }}>
                  Sin registros
                </td>
              </tr>
            ) : (
              filtered.map((e, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #1e293b10" }}>
                  <td style={{ padding: "8px 12px", color: "#94a3b8" }}>{formatDate(e.timestamp)}</td>
                  <td style={{ padding: "8px 12px", color: "#94a3b8", fontFamily: "monospace" }}>{formatTime(e.timestamp)}</td>
                  <td style={{ padding: "8px 12px" }}>
                    <span style={{
                      background: typeColor(e.type) + "18",
                      color: typeColor(e.type),
                      fontSize: 10, fontWeight: 700,
                      padding: "2px 8px", borderRadius: 4,
                    }}>{typeLabel(e.type)}</span>
                  </td>
                  <td style={{ padding: "8px 12px", color: "#94a3b8", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.details || "—"}</td>
                  <td style={{ padding: "8px 12px", color: "#3b82f6", fontFamily: "monospace", fontSize: 11 }}>{e.ip || "—"}</td>
                  <td style={{ padding: "8px 12px", color: "#94a3b8" }}>
                    {e.city && e.country ? e.city + ", " + e.country : e.country || "—"}
                  </td>
                  <td style={{ padding: "8px 12px", color: "#94a3b8" }}>{parseBrowser(e.userAgent)}</td>
                  <td style={{ padding: "8px 12px", color: "#94a3b8" }}>{parseOS(e.userAgent, e.platform)}</td>
                  <td style={{ padding: "8px 12px", color: "#64748b", fontFamily: "monospace", fontSize: 10 }}>{e.screen || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: "center", padding: "20px 0", fontSize: 9, color: "#334155" }}>
        PEM Security Log · NeuroEthics Research Lab · Buffer rotativo: 200 entradas máx.
      </div>
    </div>
  );
}
