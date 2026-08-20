import { useState, useEffect } from "react";

const C = {
  bg: "#0B1622",
  card: "#142236",
  white: "#FFFFFF",
  dim: "#8899AA",
  teal: "#00B4D8",
  mint: "#02C39A",
  amber: "#F2C94C",
  coral: "#E74C3C",
  purple: "#A855F7",
  slate: "#475569",
};

const spectrum = [
  {
    id: 1, label: "Modulación\nAlgorítmica", color: C.teal, pem: "PEM 5",
    short: "Soft power algorítmico",
    desc: "Sistemas de recomendación, dark patterns, engagement loops y microtargeting que explotan sesgos neurocognitivos para manipular preferencias, emociones y decisiones.",
    examples: ["Sistemas de recomendación", "Dark patterns / engagement loops", "Microtargeting político", "Perfilado conductual"],
    regulation: "Parcialmente cubierto por EU AI Act (alto riesgo) y RGPD (perfilado). No cubre consecuencia cognitiva.",
    vector: "Digital / Conductual",
    risk: 35,
  },
  {
    id: 2, label: "Entrainment\nNeuronal", color: C.amber, pem: "PEM 4",
    short: "Sincronización forzada",
    desc: "Sincronización forzada de oscilaciones cerebrales mediante estímulos repetitivos diseñados. Documentado en peer-review desde 1976 (Bawin & Adey, PNAS).",
    examples: ["Frecuencias de arrastre ELF", "Estímulos flickering/strobing", "Modulación de ondas cerebrales", "Binaural beats dirigidos"],
    regulation: "Sin regulación específica. Caen en brecha entre telecomunicaciones y salud.",
    vector: "Electromagnético / Sensorial",
    risk: 55,
  },
  {
    id: 3, label: "Disrupción\nNeurofisiológica", color: C.coral, pem: "PEM 3–4",
    short: "Alteración funcional",
    desc: "Alteración del eje hipotálamo-GHRH, sueño de onda lenta, cortisol sostenido. Documentado en literatura clínica y en contratos FOIA verificables.",
    examples: ["Disrupción del sueño de onda lenta", "Elevación crónica de cortisol", "Alteración eje hipotálamo-GHRH", "Cascada IDPI™ (7 componentes)"],
    regulation: "Sin instrumentos forenses para documentar la conexión causal entre exposición y disrupción.",
    vector: "Biofísico / Endocrino",
    risk: 75,
  },
  {
    id: 4, label: "Bioefectos\nDocumentados", color: C.purple, pem: "PEM 5",
    short: "Hard power biofísico",
    desc: "Nanoporación celular, daño ADN/ARN, audición inducida por microondas (efecto Frey, 1962), daño cerebral. Contrato FOIA FA8650-13-D-6368.",
    examples: ["Efecto Frey (audición por microondas)", "Nanoporación celular por RF", "Daño ADN/ARN documentado", "Silent Guardian (despliegue civil)"],
    regulation: "NDAA FY2026 §4201 presupuesta $44.3M pero sin restricciones de exportación de tecnologías.",
    vector: "Electromagnético / Acústico / Ionizante",
    risk: 95,
  },
];

const convergence = {
  title: "Convergencia Multi-Espectral (AT-MSA)",
  desc: "Las señales combinadas actúan por mecanismos cualitativamente diferentes al de las exposiciones individuales.",
  layers: [
    { label: "Celular", detail: "Estrés oxidativo + resonancia mecánica → disfunción Ca²⁺", color: C.coral },
    { label: "SNA", detail: "Degradación parasimpática + perturbación vagal → doble ataque", color: C.amber },
    { label: "Vestibular", detail: "Efecto Frey + resonancia otolítica → perturbación clínica", color: C.teal },
  ],
};

function OrbVisualization({ spectrum: items, active, onSelect }) {
  return (
    <svg viewBox="0 0 900 280" style={{ width: "100%", maxHeight: 240 }}>
      <defs>
        {items.map((s, i) => (
          <radialGradient key={`g${i}`} id={`orbGrad${i}`} cx="35%" cy="35%">
            <stop offset="0%" stopColor="#fff" stopOpacity={0.3} />
            <stop offset="40%" stopColor={s.color} stopOpacity={0.8} />
            <stop offset="100%" stopColor={s.color} stopOpacity={0.15} />
          </radialGradient>
        ))}
      </defs>

      {/* Background gradient bar */}
      <linearGradient id="spectrumBar" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={C.teal} stopOpacity={0.15} />
        <stop offset="50%" stopColor={C.amber} stopOpacity={0.15} />
        <stop offset="100%" stopColor={C.purple} stopOpacity={0.15} />
      </linearGradient>
      <rect x={80} y={130} width={740} height={4} rx={2} fill="url(#spectrumBar)" />

      {/* Labels */}
      <text x={80} y={260} fill={C.teal} fontSize={10} fontStyle="italic" opacity={0.7}>Soft power algorítmico</text>
      <text x={820} y={260} fill={C.purple} fontSize={10} fontStyle="italic" textAnchor="end" opacity={0.7}>Hard power biofísico</text>

      {/* Connecting lines */}
      {items.map((s, i) => {
        if (i < 3) {
          const x1 = 110 + i * 210 + 45;
          const x2 = 110 + (i + 1) * 210 - 45;
          return (
            <line key={`l${i}`} x1={x1} y1={132} x2={x2} y2={132}
              stroke={s.color} strokeWidth={1.5} opacity={0.3}
              strokeDasharray="6 4" />
          );
        }
        return null;
      })}

      {/* Orbs */}
      {items.map((s, i) => {
        const cx = 110 + i * 210;
        const cy = 132;
        const isActive = active === i;
        const baseR = 32 + (s.risk / 100) * 18;
        const r = isActive ? baseR + 8 : baseR;

        return (
          <g key={i} style={{ cursor: "pointer" }} onClick={() => onSelect(i)}>
            {/* Outer glow */}
            <circle cx={cx} cy={cy} r={r * 1.8} fill={s.color} opacity={0.04}>
              <animate attributeName="r" values={`${r*1.6};${r*2.2};${r*1.6}`} dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.06;0.02;0.06" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
            </circle>
            {/* Mid glow */}
            <circle cx={cx} cy={cy} r={r * 1.2} fill={s.color} opacity={0.08}>
              <animate attributeName="opacity" values="0.05;0.12;0.05" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
            {/* Main orb */}
            <circle cx={cx} cy={cy} r={r} fill={`url(#orbGrad${i})`}
              stroke={isActive ? s.color : "none"} strokeWidth={isActive ? 2 : 0} />
            {/* Highlight */}
            <circle cx={cx - r * 0.2} cy={cy - r * 0.2} r={r * 0.25} fill="#fff" opacity={0.2} />
            {/* PEM badge */}
            <rect x={cx - 22} y={cy + r + 8} width={44} height={18} rx={4} fill={s.color} opacity={0.25} />
            <text x={cx} y={cy + r + 20} textAnchor="middle" fill={s.color} fontSize={9} fontWeight="700">{s.pem}</text>
            {/* Label */}
            {s.label.split("\n").map((line, li) => (
              <text key={li} x={cx} y={cy - r - 16 + li * 14} textAnchor="middle" fill={isActive ? "#fff" : C.dim} fontSize={11} fontWeight={isActive ? "700" : "500"}>
                {line}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

export default function SpectrumVisualization() {
  const [active, setActive] = useState(null);
  const [showConvergence, setShowConvergence] = useState(false);

  const detail = active !== null ? spectrum[active] : null;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.white, overflowY: "auto", height: "100vh" }}>
      {/* Header */}
      <div style={{ padding: "24px 32px 8px", borderBottom: `1px solid ${C.slate}33` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <span style={{ background: C.coral, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 4, letterSpacing: 1 }}>PEM ECOSYSTEM</span>
          <span style={{ color: C.dim, fontSize: 12 }}>Espectro de Afectación Neurofuncional</span>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: "8px 0 4px", letterSpacing: -0.5 }}>
          Del Algoritmo al Bioefecto
        </h1>
        <p style={{ color: C.dim, fontSize: 13, margin: 0 }}>
          El espectro completo de afectación neurofuncional documentada — cada esfera representa la magnitud del riesgo
        </p>
      </div>

      {/* Orb visualization */}
      <div style={{ padding: "8px 24px 0" }}>
        <OrbVisualization spectrum={spectrum} active={active} onSelect={(i) => setActive(active === i ? null : i)} />
      </div>

      {/* Detail panel */}
      <div style={{ padding: "0 32px 16px" }}>
        {detail ? (
          <div style={{
            background: C.card, borderRadius: 12, padding: 24,
            border: `1px solid ${detail.color}33`,
            animation: "fadeIn 0.3s ease"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 12, height: 12, borderRadius: "50%",
                  background: detail.color, boxShadow: `0 0 12px ${detail.color}66`
                }} />
                <span style={{ fontSize: 18, fontWeight: 700 }}>{detail.label.replace("\n", " ")}</span>
                <span style={{ color: C.dim, fontSize: 13 }}>— {detail.short}</span>
              </div>
              {/* Risk indicator */}
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: C.dim, marginBottom: 2 }}>RIESGO CONVERGENTE</div>
                <div style={{ width: 120, height: 6, background: `${C.slate}33`, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    width: `${detail.risk}%`, height: "100%", borderRadius: 3,
                    background: `linear-gradient(90deg, ${C.teal}, ${detail.color})`
                  }} />
                </div>
              </div>
            </div>
            <p style={{ color: C.dim, fontSize: 13, lineHeight: 1.6, margin: "0 0 16px" }}>
              {detail.desc}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: detail.color, marginBottom: 8, letterSpacing: 1 }}>MANIFESTACIONES</div>
                {detail.examples.map((ex, i) => (
                  <div key={i} style={{ fontSize: 11.5, color: C.dim, padding: "3px 0" }}>• {ex}</div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: detail.color, marginBottom: 8, letterSpacing: 1 }}>VECTOR</div>
                <div style={{ fontSize: 12, color: "#fff", marginBottom: 12 }}>{detail.vector}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: detail.color, marginBottom: 8, letterSpacing: 1 }}>NIVEL PEM</div>
                <span style={{ background: detail.color, color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 4 }}>{detail.pem}</span>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: detail.color, marginBottom: 8, letterSpacing: 1 }}>ESTADO REGULATORIO</div>
                <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.5 }}>{detail.regulation}</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: C.card, borderRadius: 12, padding: 20, border: `1px solid ${C.slate}33`, textAlign: "center" }}>
            <p style={{ color: C.dim, fontSize: 14, margin: 0 }}>Selecciona una esfera para explorar cada nivel del espectro</p>
          </div>
        )}
      </div>

      {/* Convergence toggle */}
      <div style={{ padding: "0 32px 24px" }}>
        <button onClick={() => setShowConvergence(!showConvergence)} style={{
          background: showConvergence ? C.card : "transparent",
          border: `1px solid ${C.amber}44`,
          color: C.amber, fontSize: 12, fontWeight: 600,
          padding: "10px 20px", borderRadius: 8, cursor: "pointer",
          width: "100%", textAlign: "left",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span>⚡ {convergence.title}</span>
          <span style={{ fontSize: 18 }}>{showConvergence ? "−" : "+"}</span>
        </button>
        {showConvergence && (
          <div style={{ background: C.card, borderRadius: "0 0 12px 12px", padding: 20, border: `1px solid ${C.amber}22`, borderTop: "none", animation: "fadeIn 0.3s ease" }}>
            <p style={{ color: C.dim, fontSize: 12, lineHeight: 1.5, margin: "0 0 16px" }}>{convergence.desc}</p>
            <div style={{ display: "flex", gap: 12 }}>
              {convergence.layers.map((layer, i) => (
                <div key={i} style={{ flex: 1, background: `${layer.color}11`, borderRadius: 8, padding: "12px 14px", borderLeft: `3px solid ${layer.color}` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: layer.color, marginBottom: 6 }}>Nivel {i + 1}: {layer.label}</div>
                  <div style={{ fontSize: 11, color: C.dim, lineHeight: 1.4 }}>{layer.detail}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: "10px 14px", background: `${C.coral}11`, borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: C.coral, fontWeight: 600 }}>Arquitectura de invisibilidad: </div>
              <div style={{ fontSize: 11, color: C.dim, marginTop: 4 }}>
                Vector imperceptible (RF + infrasonido) → Cuadro clínico mimético (SII, ansiedad, fibromialgia) → Atribución imposible por vías convencionales
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Key insight */}
      <div style={{ padding: "0 32px 20px" }}>
        <div style={{ background: C.card, borderRadius: 10, padding: "14px 20px", textAlign: "center", border: `1px solid ${C.amber}22` }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.amber }}>
            Cada nivel está regulado por separado. Ninguna regulación cubre la convergencia entre niveles.
          </span>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "8px 0 16px", borderTop: `1px solid ${C.slate}22` }}>
        <span style={{ fontSize: 10, color: C.slate }}>NeuroEthics Research Lab — NeuroEthics.cl — PEM Ecosystem v11</span>
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
