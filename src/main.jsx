import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import NDFVisualization from './views/NDF';
import BHSVisualization from './views/BHS';
import RielesVisualization from './views/RIELES';
import PLEAPipeline from './views/plea-pipeline';
import SpectrumBioeffect from './views/spectrum-bioeffect';
import EcosystemMap from './views/ecosystem-map';

// ============================================================
// SECURITY GATE — PIN + Access Log
// ============================================================
const CORRECT_PIN = "2741";
const MAX_ATTEMPTS = 5;
const STORAGE_KEY = "pem-access-log";
const SESSION_KEY = "pem-unlocked";

async function logAccess(type, details) {
  try {
    const entry = {
      timestamp: new Date().toISOString(),
      type,
      details,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      screen: window.screen.width + "x" + window.screen.height,
    };
    let log = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) log = JSON.parse(stored);
    } catch (e) {}
    log.push(entry);
    if (log.length > 200) log = log.slice(-200);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  } catch (e) {}
}

function LockScreen({ onUnlock }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    logAccess("screen_shown", "PIN gate displayed");
  }, []);

  const handleSubmit = () => {
    if (locked) return;
    if (pin === CORRECT_PIN) {
      logAccess("access_granted", "Correct PIN");
      sessionStorage.setItem(SESSION_KEY, "true");
      onUnlock();
    } else {
      const next = attempts + 1;
      setAttempts(next);
      logAccess("access_denied", "Attempt " + next + "/" + MAX_ATTEMPTS);
      if (next >= MAX_ATTEMPTS) {
        setLocked(true);
        setError("Acceso bloqueado por exceso de intentos.");
        logAccess("lockout", "Locked after " + next + " attempts");
      } else {
        setError("PIN incorrecto. Intento " + next + "/" + MAX_ATTEMPTS);
      }
      setPin("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div style={{
      width: "100vw", height: "100vh",
      background: "#08080e",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    }}>
      <div style={{
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: 16,
        padding: "48px 40px",
        maxWidth: 380,
        width: "90%",
        textAlign: "center",
      }}>
        {/* Lock icon */}
        <div style={{ marginBottom: 24 }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.5" style={{ opacity: locked ? 0.3 : 0.8 }}>
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>

        <h2 style={{ color: "#e2e8f0", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
          PEM Ecosystem v11
        </h2>
        <p style={{ color: "#64748b", fontSize: 12, marginBottom: 28, lineHeight: 1.5 }}>
          NeuroEthics Research Lab<br />Acceso restringido
        </p>

        {locked ? (
          <div style={{
            background: "#ef444415",
            border: "1px solid #ef444430",
            borderRadius: 8,
            padding: "16px",
            color: "#ef4444",
            fontSize: 13,
          }}>
            {error}
          </div>
        ) : (
          <>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={pin}
              onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setError(""); }}
              onKeyDown={handleKeyDown}
              placeholder="PIN"
              autoFocus
              style={{
                width: "100%",
                padding: "14px 16px",
                fontSize: 18,
                letterSpacing: "0.3em",
                textAlign: "center",
                background: "#1e293b",
                border: "1px solid " + (error ? "#ef4444" : "#334155"),
                borderRadius: 8,
                color: "#e2e8f0",
                outline: "none",
                boxSizing: "border-box",
                marginBottom: 16,
              }}
            />
            <button
              onClick={handleSubmit}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: 14,
                fontWeight: 600,
                background: "#f59e0b",
                color: "#000",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Verificar
            </button>
            {error && (
              <p style={{ color: "#ef4444", fontSize: 12, marginTop: 12 }}>{error}</p>
            )}
          </>
        )}

        <p style={{ color: "#334155", fontSize: 9, marginTop: 24 }}>
          Los accesos son registrados
        </p>
      </div>
    </div>
  );
}

// ============================================================
// APP WITH GATE
// ============================================================
function GatedApp() {
  const [unlocked, setUnlocked] = useState(
    sessionStorage.getItem(SESSION_KEY) === "true"
  );

  if (!unlocked) {
    return <LockScreen onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/ndf" element={<NDFVisualization />} />
        <Route path="/bhs" element={<BHSVisualization />} />
        <Route path="/rieles" element={<RielesVisualization />} />
        <Route path="/plea" element={<PLEAPipeline />} />
        <Route path="/spectrum" element={<SpectrumBioeffect />} />
        <Route path="/ecosystem" element={<EcosystemMap />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GatedApp />
  </React.StrictMode>
);
