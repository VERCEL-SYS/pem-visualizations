import { useState } from "react";

const C = {
  bg: "#0B1622",
  card: "#142236",
  cardHover: "#1A2E48",
  white: "#FFFFFF",
  dim: "#8899AA",
  teal: "#00B4D8",
  mint: "#02C39A",
  amber: "#F2C94C",
  coral: "#E74C3C",
  purple: "#A855F7",
  slate: "#475569",
};

const stages = [
  {
    id: "entrada", label: "ENTRADA", color: C.teal, icon: "◉",
    modules: [
      {
        name: "Bitácora V4.2",
        desc: "Registro diario estructurado en 11 categorías incluyendo PSYOPS/OHC, audio+espectrograma FFT, actores/perpetradores, tracking vehículos. Modo Guardián con auto-detección por umbral dB.",
        feeds: "SEA-PEM Agent",
        detail: "La bitácora es la materia prima que inicia toda la cadena: sin bitácora no hay investigación."
      },
      {
        name: "Datos Instrumentales",
        desc: "Arquitectura TSCM completa: monitoreo RF multi-banda continuo, análisis espectral broadband, medición campo E/RF/ELF, dosimetría ionizante.",
        feeds: "Anexos Evidenciarios",
        detail: "Cadena de custodia SHA-256. Correlación temporal multi-instrumento."
      },
    ],
  },
  {
    id: "procesamiento", label: "PROCESAMIENTO", color: C.amber, icon: "⟳",
    modules: [
      {
        name: "PEM Bioeffect Simulator",
        desc: "Modelo computacional del exposoma sociotecnológico con 4 capas: Física (quad-domain), Digital/Cognitiva, Social/Contextual, Ambiental Clásica.",
        feeds: "Instrumentos PEM",
        detail: "8 cuadros clínicos simulados. Calibrado con datos reales de sesiones Guardian."
      },
      {
        name: "Anexos Evidenciarios",
        desc: "AT-DEW-E v0.4 (26 fuentes), AT-SAW-E v0.2 (21 fuentes), AT-MSA v0.1 (13 refs). Quad-domain forensic correlation: RF/EMF, ionizante, espectro, acústica.",
        feeds: "Instrumentos PEM",
        detail: "Verosimilitud AHI Tipo 1 por RF/EM pulsada: 82–93% (NASEM 2020)."
      },
    ],
  },
  {
    id: "analisis", label: "ANÁLISIS", color: C.coral, icon: "◈",
    modules: [
      {
        name: "8 Instrumentos PEM",
        desc: "GHE-QI (D₁–D₅) · IDPI™ (7 componentes, 0-100) · ANV/AIVV (17 vectores) · BHS (5 dominios) · NDF · RIELES v1.3 (15 vectores) · ICGS · OCRI™",
        feeds: "PLEA",
        detail: "Cada instrumento cuantifica una dimensión diferente de la exposición y el daño."
      },
      {
        name: "SEA-PEM Agent v14",
        desc: "Evaluación cuantitativa estructurada en 4 tiers: Básico (activa PLEA L1), Estándar (L1-L2), Premium (L1-L4), Forense (L1-L5).",
        feeds: "PLEA",
        detail: "Condiciones internas: RIELES ≥4 nucleares, OCRI GHE-QI ≥0.60"
      },
    ],
  },
  {
    id: "legal", label: "ARQ. LEGAL", color: C.purple, icon: "§",
    modules: [
      {
        name: "PLEA v1.7",
        desc: "5 niveles: Situation → Pattern → Mechanism → Attribution → Individual Case. Tríada normativa: Melzer + NATO P5 + CAJAR.",
        feeds: "Salidas Jurídicas",
        detail: "Inspirada en distinción situation/case de la CPI (Estatuto de Roma). Blindaje V1–V10."
      },
    ],
  },
  {
    id: "accion", label: "ACCIÓN", color: C.mint, icon: "⚖",
    modules: [
      {
        name: "Salidas Jurídicas",
        desc: "Querella multi-fase, Blindaje contra desestimación (10 vectores), Argumentación Toulmin-Atienza, Admisibilidad probatoria, Protocolo R-FDT v1.0.",
        feeds: null,
        detail: "La capa más robusta del ecosistema: 6+ instrumentos jurídicos integrados."
      },
    ],
  },
];

const metrics = [
  { val: "8", label: "Instrumentos PEM", color: C.teal },
  { val: "4", label: "Dominios forenses", color: C.amber },
  { val: "5", label: "Niveles PLEA", color: C.coral },
  { val: "15", label: "Rieles AT-07", color: C.mint },
  { val: "47+", label: "Fuentes científicas", color: C.purple },
  { val: "10", label: "Vectores blindaje", color: C.amber },
];

function Orb({ x, y, r, color, active }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r * 2} fill={color} opacity={0.05}>
        <animate attributeName="r" values={`${r*1.8};${r*2.5};${r*1.8}`} dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx={x} cy={y} r={r} fill={color} opacity={active ? 0.9 : 0.5}>
        <animate attributeName="opacity" values={`${active ? 0.7 : 0.3};${active ? 1 : 0.6};${active ? 0.7 : 0.3}`} dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx={x} cy={y} r={r * 0.4} fill="#fff" opacity={0.3} />
    </g>
  );
}

export default function EcosystemMap() {
  const [activeStage, setActiveStage] = useState(null);
  const [activeModule, setActiveModule] = useState(null);

  const stageData = activeStage !== null ? stages[activeStage] : null;
  const moduleData = stageData && activeModule !== null ? stageData.modules[activeModule] : null;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.white, overflowY: "auto", height: "100vh" }}>
      {/* Header */}
      <div style={{ padding: "24px 32px 12px", borderBottom: `1px solid ${C.slate}33` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <span style={{ background: C.mint, color: "#000", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 4, letterSpacing: 1 }}>ECOSISTEMA</span>
          <span style={{ color: C.dim, fontSize: 12 }}>Mapa del Pipeline Forense Integrado</span>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: "8px 0 4px", letterSpacing: -0.5 }}>
          Ecosistema de Seguridad PEM + PLEA
        </h1>
        <p style={{ color: C.dim, fontSize: 13, margin: 0 }}>
          De la bitácora a la acción judicial — pipeline completo de documentación forense
        </p>
      </div>

      {/* Neural pipeline visualization */}
      <div style={{ padding: "12px 16px 0" }}>
        <svg viewBox="0 0 940 180" style={{ width: "100%", maxHeight: 160 }}>
          {/* Connection lines */}
          {stages.map((s, i) => {
            if (i < 4) {
              const x1 = 95 + i * 185 + 35;
              const x2 = 95 + (i + 1) * 185 - 35;
              const isActive = activeStage !== null && (activeStage === i || activeStage === i + 1);
              return (
                <g key={`c${i}`}>
                  <line x1={x1} y1={90} x2={x2} y2={90} stroke={s.color} strokeWidth={isActive ? 2 : 1} opacity={isActive ? 0.6 : 0.15} strokeDasharray={isActive ? "none" : "6 4"}>
                    {isActive && <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />}
                  </line>
                  <polygon points={`${x2-6},85 ${x2},90 ${x2-6},95`} fill={s.color} opacity={isActive ? 0.5 : 0.15} />
                </g>
              );
            }
            return null;
          })}

          {/* Stage orbs */}
          {stages.map((s, i) => {
            const cx = 95 + i * 185;
            const isActive = activeStage === i;
            return (
              <g key={i} style={{ cursor: "pointer" }} onClick={() => { setActiveStage(activeStage === i ? null : i); setActiveModule(null); }}>
                <Orb x={cx} y={90} r={isActive ? 32 : 26} color={s.color} active={isActive} />
                <text x={cx} y={88} textAnchor="middle" fill="#fff" fontSize={16} fontWeight="600" dominantBaseline="middle">
                  {s.icon}
                </text>
                <rect x={cx - 45} y={130} width={90} height={20} rx={4} fill={s.color} opacity={isActive ? 0.3 : 0.12} />
                <text x={cx} y={143} textAnchor="middle" fill={isActive ? "#fff" : s.color} fontSize={9} fontWeight="700" letterSpacing={0.8}>
                  {s.label}
                </text>
                <text x={cx} y={168} textAnchor="middle" fill={C.dim} fontSize={9}>
                  {s.modules.length} módulo{s.modules.length > 1 ? "s" : ""}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Stage detail */}
      <div style={{ padding: "0 32px 12px" }}>
        {stageData ? (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ background: stageData.color, color: stageData.color === C.amber ? "#000" : "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 6 }}>{stageData.label}</span>
              <span style={{ color: C.dim, fontSize: 12 }}>Selecciona un módulo para ver detalle</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: stageData.modules.length > 1 ? "1fr 1fr" : "1fr", gap: 12 }}>
              {stageData.modules.map((mod, i) => {
                const isActive = activeModule === i;
                return (
                  <div key={i}
                    onClick={() => setActiveModule(isActive ? null : i)}
                    style={{
                      background: isActive ? C.cardHover : C.card,
                      borderRadius: 10, padding: 18, cursor: "pointer",
                      border: `1px solid ${isActive ? stageData.color + "55" : C.slate + "22"}`,
                      transition: "all 0.2s ease",
                    }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: stageData.color, marginBottom: 8 }}>
                      {mod.name}
                    </div>
                    <div style={{ fontSize: 11.5, color: C.dim, lineHeight: 1.5 }}>
                      {mod.desc}
                    </div>
                    {isActive && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.slate}33`, animation: "fadeIn 0.2s ease" }}>
                        <div style={{ fontSize: 11, color: stageData.color, fontWeight: 600, marginBottom: 4 }}>NOTA CLAVE</div>
                        <div style={{ fontSize: 12, color: "#fff", lineHeight: 1.5, fontStyle: "italic" }}>{mod.detail}</div>
                        {mod.feeds && (
                          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 10, color: C.dim }}>Alimenta →</span>
                            <span style={{ fontSize: 11, color: stageData.color, fontWeight: 600 }}>{mod.feeds}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ background: C.card, borderRadius: 12, padding: 20, border: `1px solid ${C.slate}33`, textAlign: "center" }}>
            <p style={{ color: C.dim, fontSize: 14, margin: 0 }}>Selecciona una etapa del pipeline para explorar sus módulos</p>
          </div>
        )}
      </div>

      {/* Metrics */}
      <div style={{ padding: "8px 32px 8px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.dim, marginBottom: 10, letterSpacing: 1 }}>MÉTRICAS DEL ECOSISTEMA</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
          {metrics.map((m, i) => (
            <div key={i} style={{ background: C.card, borderRadius: 8, padding: "10px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: m.color }}>{m.val}</div>
              <div style={{ fontSize: 9, color: C.dim, marginTop: 2 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Entities */}
      <div style={{ padding: "12px 32px 8px" }}>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          {["NeuroEthics Research Lab", "PAI LABS", "LIBERTECH"].map((e, i) => (
            <span key={i} style={{
              fontSize: 10, color: C.dim, padding: "4px 12px",
              border: `1px solid ${C.slate}33`, borderRadius: 4,
            }}>{e}</span>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "12px 0 16px", borderTop: `1px solid ${C.slate}22` }}>
        <span style={{ fontSize: 10, color: C.slate }}>NeuroEthics Research Lab — NeuroEthics.cl — PEM Ecosystem v11</span>
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
