import { useState, useEffect, useRef } from "react";

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

const levels = [
  {
    id: "L1", title: "Situation", color: C.teal,
    subtitle: "Documentación del fenómeno",
    desc: "Documentar el fenómeno como situación antes de afirmar perpetrador. Registro ambiental, contextual e instrumental.",
    inputs: ["Bitácora V4.2", "Datos instrumentales TSCM", "Registro ambiental"],
    pemLink: "Capas 1–2 PEM",
    seaLink: "Tier Básico SEA-PEM",
    chain: "Evidencia",
    principle: "Se investiga primero la situación, no el caso",
  },
  {
    id: "L2", title: "Pattern", color: C.teal,
    subtitle: "Identificación de patrones",
    desc: "Identificar patrones recurrentes en la evidencia acumulada. Correlaciones temporales, espaciales y conductuales.",
    inputs: ["Correlación temporal multi-instrumento", "Análisis de frecuencia", "Patrones de recurrencia"],
    pemLink: "Capa 3 PEM + RIELES",
    seaLink: "Tier Estándar SEA-PEM",
    chain: "Inferencia",
    principle: "El patrón emerge de los datos, no se impone sobre ellos",
  },
  {
    id: "L3", title: "Mechanism", color: C.amber,
    subtitle: "Plausibilidad mecanística",
    desc: "Establecer mecanismos plausibles de afectación con soporte científico. Conexión entre exposición documentada y efecto observado.",
    inputs: ["AT-DEW-E / AT-SAW-E / AT-MSA", "PEM Bioeffect Simulator", "Literatura peer-reviewed"],
    pemLink: "NDF + BHS + IDPI™",
    seaLink: "Tier Premium SEA-PEM",
    chain: "Hipótesis",
    principle: "El mecanismo debe ser falsable y verificable",
  },
  {
    id: "L4", title: "Attribution", color: C.coral,
    subtitle: "Atribución de responsabilidad",
    desc: "Atribuir responsabilidad a actores identificados en la cadena causal. Responsabilidad diferenciada (E-1→E-4).",
    inputs: ["Cadena de mando E-1→E-4", "AT-05/CIS documentado", "Análisis de capacidades"],
    pemLink: "ICGS + OCRI™ + AT-06",
    seaLink: "Tier Forense SEA-PEM",
    chain: "Atribución",
    principle: "La responsabilidad distribuida no es argumento para la impunidad",
  },
  {
    id: "L5", title: "Individual Case", color: C.mint,
    subtitle: "Caso judicial admisible",
    desc: "Integrar toda la evidencia en un caso judicial admisible. Convergencia de todos los niveles en estándar probatorio.",
    inputs: ["Querella multi-fase", "Blindaje V1–V10", "Argumentación Toulmin-Atienza"],
    pemLink: "Capa 5 PEM + PLEA completo",
    seaLink: "Todos los tiers integrados",
    chain: "Responsabilidad jurídica",
    principle: "La evidencia progresiva es compatible con el estándar de prueba",
  },
];

const anchors = [
  { label: "A/HRC/43/49", sub: "Melzer, 2020 — Cibertortura", color: C.coral },
  { label: "NATO STO-P5", sub: "Tecnología documentada", color: C.amber },
  { label: "CAJAR v. Col.", sub: "Corte IDH, 2024", color: C.teal },
];

function NeuralOrb({ x, y, r, color, pulse, delay }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r * 2.5} fill={color} opacity={0.04}>
        {pulse && <animate attributeName="r" values={`${r*2};${r*3.5};${r*2}`} dur="4s" begin={`${delay}s`} repeatCount="indefinite" />}
        {pulse && <animate attributeName="opacity" values="0.06;0.02;0.06" dur="4s" begin={`${delay}s`} repeatCount="indefinite" />}
      </circle>
      <circle cx={x} cy={y} r={r * 1.4} fill={color} opacity={0.1}>
        {pulse && <animate attributeName="r" values={`${r*1.2};${r*1.8};${r*1.2}`} dur="3s" begin={`${delay+0.5}s`} repeatCount="indefinite" />}
      </circle>
      <circle cx={x} cy={y} r={r} fill={color} opacity={0.7}>
        {pulse && <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.5s" begin={`${delay}s`} repeatCount="indefinite" />}
      </circle>
      <circle cx={x} cy={y} r={r * 0.5} fill="#fff" opacity={0.3} />
    </g>
  );
}

function ConnectorLine({ x1, y1, x2, y2, color, active }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={active ? 2.5 : 1} opacity={active ? 0.8 : 0.2} strokeDasharray={active ? "none" : "4 4"}>
        {active && <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />}
      </line>
    </g>
  );
}

export default function PLEAPipeline() {
  const [active, setActive] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const orbPositions = [
    { x: 100, y: 200 },
    { x: 280, y: 200 },
    { x: 460, y: 200 },
    { x: 640, y: 200 },
    { x: 820, y: 200 },
  ];

  const detail = active !== null ? levels[active] : null;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.white, padding: 0 }}>
      {/* Header */}
      <div style={{ padding: "24px 32px 8px", borderBottom: `1px solid ${C.slate}33` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <span style={{ background: C.purple, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 4, letterSpacing: 1 }}>PLEA v1.7</span>
          <span style={{ color: C.dim, fontSize: 12 }}>PEM Legal Evidence Architecture</span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: "8px 0 4px", letterSpacing: -0.5 }}>
          Arquitectura Legal de Evidencia Progresiva
        </h1>
        <p style={{ color: C.dim, fontSize: 13, margin: 0 }}>
          Inspirada en la distinción <em>situation/case</em> de la Corte Penal Internacional (Estatuto de Roma)
        </p>
      </div>

      {/* Neural Orb Visualization */}
      <div style={{ padding: "16px 32px 0" }}>
        <svg viewBox="0 0 920 400" style={{ width: "100%", maxHeight: 320 }}>
          {/* Connection lines */}
          {orbPositions.map((pos, i) => {
            if (i < 4) {
              const next = orbPositions[i + 1];
              const isActive = active !== null && (active === i || active === i + 1);
              return <ConnectorLine key={`c${i}`} x1={pos.x + 40} y1={pos.y} x2={next.x - 40} y2={next.y} color={levels[i].color} active={isActive} />;
            }
            return null;
          })}

          {/* Orbs */}
          {orbPositions.map((pos, i) => (
            <g key={i} style={{ cursor: "pointer" }} onClick={() => setActive(active === i ? null : i)}>
              <NeuralOrb x={pos.x} y={pos.y} r={active === i ? 38 : 30} color={levels[i].color} pulse={active === i || active === null} delay={i * 0.5} />
              <text x={pos.x} y={pos.y - 2} textAnchor="middle" fill="#fff" fontSize={14} fontWeight="700" dominantBaseline="middle">
                {levels[i].id}
              </text>
              <text x={pos.x} y={pos.y + 60} textAnchor="middle" fill={levels[i].color} fontSize={12} fontWeight="600">
                {levels[i].title}
              </text>
              <text x={pos.x} y={pos.y + 78} textAnchor="middle" fill={C.dim} fontSize={9.5}>
                {levels[i].subtitle}
              </text>

              {/* Chain label below */}
              <rect x={pos.x - 42} y={pos.y + 92} width={84} height={20} rx={4} fill={levels[i].color} opacity={0.15} />
              <text x={pos.x} y={pos.y + 105} textAnchor="middle" fill={levels[i].color} fontSize={9} fontWeight="600">
                {levels[i].chain}
              </text>
            </g>
          ))}

          {/* Flow arrow label */}
          <text x={460} y={360} textAnchor="middle" fill={C.dim} fontSize={10} fontStyle="italic">
            Evidencia → Inferencia → Hipótesis → Atribución → Responsabilidad jurídica
          </text>
        </svg>
      </div>

      {/* Detail Panel */}
      <div style={{ padding: "0 32px 16px" }}>
        {detail ? (
          <div style={{
            background: C.card, borderRadius: 12, padding: 24,
            border: `1px solid ${detail.color}33`,
            animation: "fadeIn 0.3s ease"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{
                background: detail.color, color: "#fff", fontSize: 13, fontWeight: 700,
                padding: "4px 14px", borderRadius: 6
              }}>{detail.id}</span>
              <span style={{ fontSize: 20, fontWeight: 700 }}>{detail.title}</span>
              <span style={{ color: C.dim, fontSize: 13 }}>— {detail.subtitle}</span>
            </div>
            <p style={{ color: C.dim, fontSize: 14, lineHeight: 1.6, margin: "0 0 20px" }}>
              {detail.desc}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: detail.color, marginBottom: 8, letterSpacing: 1 }}>INPUTS</div>
                {detail.inputs.map((inp, i) => (
                  <div key={i} style={{ fontSize: 12, color: C.dim, padding: "4px 0", borderBottom: `1px solid ${C.slate}22` }}>
                    {inp}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: detail.color, marginBottom: 8, letterSpacing: 1 }}>INSTRUMENTOS PEM</div>
                <div style={{ fontSize: 12, color: "#fff", padding: "4px 0" }}>{detail.pemLink}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: detail.color, marginBottom: 8, marginTop: 12, letterSpacing: 1 }}>SEA-PEM</div>
                <div style={{ fontSize: 12, color: "#fff", padding: "4px 0" }}>{detail.seaLink}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: detail.color, marginBottom: 8, letterSpacing: 1 }}>PRINCIPIO</div>
                <div style={{ fontSize: 13, color: "#fff", fontStyle: "italic", lineHeight: 1.5 }}>
                  "{detail.principle}"
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            background: C.card, borderRadius: 12, padding: 20,
            border: `1px solid ${C.slate}33`, textAlign: "center"
          }}>
            <p style={{ color: C.dim, fontSize: 14, margin: 0 }}>
              Selecciona un nivel para explorar su contenido
            </p>
          </div>
        )}
      </div>

      {/* Tríada normativa */}
      <div style={{ padding: "0 32px 24px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.dim, marginBottom: 10, letterSpacing: 1 }}>TRÍADA NORMATIVA</div>
        <div style={{ display: "flex", gap: 12 }}>
          {anchors.map((a, i) => (
            <div key={i} style={{
              flex: 1, background: C.card, borderRadius: 8, padding: "12px 16px",
              borderLeft: `3px solid ${a.color}`
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: a.color }}>{a.label}</div>
              <div style={{ fontSize: 11, color: C.dim, marginTop: 4 }}>{a.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, textAlign: "center" }}>
          <span style={{ fontSize: 11, color: C.dim, fontStyle: "italic" }}>
            Para desmontar el caso, el contra-perito debe argumentar simultáneamente que las tres anclas no aplican.
          </span>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "8px 0 16px", borderTop: `1px solid ${C.slate}22` }}>
        <span style={{ fontSize: 10, color: C.slate }}>NeuroEthics Research Lab — NeuroEthics.cl — PLEA v1.7</span>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
