import { useState } from "react";

const C = { bg:"#0B1622", card:"#142236", cardHover:"#1A2E48", white:"#FFFFFF", dim:"#8899AA", teal:"#00B4D8", mint:"#02C39A", amber:"#F2C94C", coral:"#E74C3C", purple:"#A855F7", slate:"#475569" };

const threatLayers = [
  { label:"Capa Física", desc:"Infraestructura electromagnética, acústica e ionizante. Señales imperceptibles para los sentidos humanos que operan en frecuencias fuera del rango de percepción consciente.", character:"Invisible · Imperceptible · Continua", color:C.coral, icon:"◉" },
  { label:"Capa Digital", desc:"Algoritmos de modulación conductual, perfilado neurocognitivo, dark patterns. Operan dentro de plataformas de uso cotidiano sin que el usuario perciba la manipulación.", character:"Ubicua · Normalizada · Adictiva", color:C.amber, icon:"◈" },
  { label:"Capa Institucional", desc:"Marcos regulatorios fragmentados que normalizan la exposición. Cada sector regulado por separado; la convergencia entre sectores queda sin cobertura.", character:"Estructural · Sistémica · Legítima", color:C.teal, icon:"§" },
];

const capabilities = [
  { req:"Infraestructura de radiofrecuencia de banda ancha con capacidad de focalización", icon:"⟐", color:C.coral },
  { req:"Acceso a redes de telecomunicaciones y plataformas de monitoreo masivo", icon:"⟐", color:C.coral },
  { req:"Presupuesto sostenido en el orden de cientos de millones de dólares anuales", icon:"⟐", color:C.amber },
  { req:"Personal técnico con clearance de seguridad y protocolos de investigación en sujetos humanos", icon:"⟐", color:C.amber },
  { req:"Capacidad de operar sin supervisión judicial ni consentimiento informado", icon:"⟐", color:C.purple },
  { req:"Mecanismos de denegabilidad institucionalizada y clasificación de información", icon:"⟐", color:C.purple },
];

const timeline = [
  {
    period:"1950–1960s", phase:"Experimentación directa",
    tech:"Administración farmacológica (LSD, mescalina), electroshock, privación sensorial, electrodos cerebrales implantados",
    civilians:"Civiles no informados, pacientes psiquiátricos, prisioneros",
    evidence:"Desclasificación completa. 20,000+ páginas. Admisión institucional ante Congreso.",
    sources:"Church Committee (1975) · CIA Inspector General Report (1963)",
    pem:"Nivel 5 — Evidencia primaria", color:C.coral,
  },
  {
    period:"1970–1980s", phase:"Transición electromagnética",
    tech:"Efecto auditivo por microondas (Frey, 1962), investigación EM de baja intensidad, primeros sistemas experimentales de voz dirigida",
    civilians:"Whistleblowers, disidentes, personal militar, familias de sujetos de fases anteriores",
    evidence:"Peer-reviewed (Frey 1962, Bawin & Adey 1976 PNAS). Programa Pandora documentado (DIA).",
    sources:"Frey (1962) J. Applied Physiology · Bawin & Adey (1976) PNAS",
    pem:"Nivel 4 — Parcial verificable", color:C.amber,
  },
  {
    period:"1990–2000s", phase:"Operación remota y convergencia",
    tech:"Active Denial System (95 GHz, desclasificado), torres celulares, satélites, entrainment neuronal por ELF, neuroestimulación transcraneal",
    civilians:"Expansión documentada a civiles en contextos de denuncia y exposición de corrupción institucional",
    evidence:"ADS: desclasificado y desplegado. Vigilancia masiva: confirmada (Snowden/NSA, 2013).",
    sources:"NAS (2020) Assessment of Ill Health · NAS-DIA (2008) Bioeffects of Selected NLW",
    pem:"Nivel 3–5 — Mixta", color:C.teal,
  },
  {
    period:"2010–2026", phase:"Convergencia IA + Neurotecnología",
    tech:"5G/6G, satélites LEO, drones, IoT, wearables neurotecnológicos, IA para análisis conductual, bioamplificación de espectro expandido",
    civilians:"Whistleblowers, activistas, periodistas, civiles. Escala y sistematicidad crecientes.",
    evidence:"Contrato FOIA FA8650-13-D-6368: protocolos de investigación biomédica en sujetos humanos. Nanoporación celular, daño ADN/ARN, audición por microondas.",
    sources:"NDAA FY2026 §4201 · NATO STO HFM-311 · Contrato FOIA FA8650-13-D-6368",
    pem:"Nivel 2–5 — Variable", color:C.purple,
  },
];

const budgetLines = [
  { program:"High Energy Laser (HEL)", amount:"$345.2M", source:"RDTE Army FY2026", color:C.coral },
  { program:"Directed Energy Weapons (DE)", amount:"$287.6M", source:"RDTE Navy/AF FY2026", color:C.coral },
  { program:"Counter-Electronics HPM", amount:"$89.4M", source:"RDTE Army FY2026", color:C.amber },
  { program:"Acoustic/Non-Lethal Weapons", amount:"$67.8M", source:"JNLWD FY2026", color:C.amber },
  { program:"Cognitive Security / EW", amount:"$160.0M+", source:"DARPA / IARPA FY2026", color:C.purple },
];

const response = [
  { stage:"DOCUMENTAR", desc:"Registro sistemático de la situación con evidencia instrumental verificable y cadena de custodia digital.", color:C.teal, icon:"1" },
  { stage:"ANALIZAR", desc:"Evaluación cuantitativa de convergencia mediante instrumentos calibrados que detectan patrones invisibles al ojo humano.", color:C.amber, icon:"2" },
  { stage:"ARTICULAR", desc:"Transformación de evidencia forense en estructura jurídica admisible, con respaldo normativo internacional.", color:C.coral, icon:"3" },
  { stage:"PROTEGER", desc:"Mecanismos de protección procesal contra desestimación, con admisibilidad progresiva compatible con estándares laborales.", color:C.mint, icon:"4" },
];

function PulsingOrb({ x, y, r, color }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r*2} fill={color} opacity={0.04}>
        <animate attributeName="r" values={`${r*1.5};${r*2.5};${r*1.5}`} dur="4s" repeatCount="indefinite"/>
      </circle>
      <circle cx={x} cy={y} r={r} fill={color} opacity={0.6}>
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx={x-r*0.2} cy={y-r*0.2} r={r*0.3} fill="#fff" opacity={0.2}/>
    </g>
  );
}

export default function EcosystemPublic() {
  const [view, setView] = useState("threat");
  const [expandedPhase, setExpandedPhase] = useState(null);

  return (
    <div style={{ background:C.bg, minHeight:"100vh", height:"100vh", overflowY:"auto", fontFamily:"'Segoe UI',system-ui,sans-serif", color:C.white }}>
      <div style={{ padding:"24px 32px 12px", borderBottom:`1px solid ${C.slate}33` }}>
        <h1 style={{ fontSize:26, fontWeight:700, margin:"8px 0 4px", letterSpacing:-0.5 }}>
          Ecosistema Forense: Amenaza y Respuesta
        </h1>
        <p style={{ color:C.dim, fontSize:13, margin:0 }}>
          Comprender la arquitectura de la amenaza para diseñar la respuesta forense adecuada
        </p>
      </div>

      {/* Tab navigation */}
      <div style={{ display:"flex", gap:8, padding:"16px 32px 0", flexWrap:"wrap" }}>
        {[
          { key:"threat", label:"Arquitectura de la Amenaza", color:C.coral },
          { key:"trace", label:"Trazabilidad Documentada", color:C.amber },
          { key:"civil", label:"Participación Civil", color:C.purple },
          { key:"response", label:"Respuesta Forense", color:C.mint },
        ].map(t => (
          <button key={t.key} onClick={() => setView(t.key)} style={{
            background: view===t.key ? C.card : "transparent",
            border: `1px solid ${view===t.key ? t.color+"55" : C.slate+"33"}`,
            borderRadius:8, color: view===t.key ? t.color : C.dim,
            fontSize:12, fontWeight: view===t.key?700:500,
            padding:"10px 20px", cursor:"pointer", transition:"all 0.2s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ============ THREAT VIEW ============ */}
      {view === "threat" && (
        <div style={{ padding:"20px 32px", animation:"fadeIn 0.3s ease" }}>
          <div style={{ textAlign:"center", marginBottom:20 }}>
            <span style={{ fontSize:12, color:C.coral, fontWeight:600 }}>COGNITIVE WARFARE LAYERED ARCHITECTURE</span>
            <p style={{ color:C.dim, fontSize:12, marginTop:4 }}>Las amenazas operan en capas superpuestas — cada una invisible por diseño</p>
          </div>

          <svg viewBox="0 0 800 200" style={{ width:"100%", maxHeight:180, marginBottom:16 }}>
            {threatLayers.map((l,i) => {
              const y = 30 + i*60;
              const w = 700 - i*80;
              const x = (800-w)/2;
              return (
                <g key={i}>
                  <rect x={x} y={y} width={w} height={50} rx={8} fill={l.color} opacity={0.08} stroke={l.color} strokeWidth={1} strokeOpacity={0.2}/>
                  <PulsingOrb x={x+30} y={y+25} r={12} color={l.color}/>
                  <text x={x+52} y={y+22} fill={l.color} fontSize={12} fontWeight="700">{l.label}</text>
                  <text x={x+52} y={y+38} fill={C.dim} fontSize={10}>{l.character}</text>
                </g>
              );
            })}
          </svg>

          {threatLayers.map((l,i) => (
            <div key={i} style={{ background:C.card, borderRadius:10, padding:"16px 20px", marginBottom:10, borderLeft:`3px solid ${l.color}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <span style={{ fontSize:14, fontWeight:700, color:l.color }}>{l.label}</span>
                <span style={{ fontSize:10, color:l.color, background:`${l.color}15`, padding:"3px 10px", borderRadius:4 }}>{l.character}</span>
              </div>
              <p style={{ fontSize:12, color:C.dim, lineHeight:1.6, margin:0 }}>{l.desc}</p>
            </div>
          ))}

          <div style={{ background:C.card, borderRadius:10, padding:"14px 20px", textAlign:"center", border:`1px solid ${C.coral}22`, marginTop:12 }}>
            <span style={{ fontSize:12, color:C.coral, fontWeight:600 }}>
              La arquitectura de invisibilidad: vector imperceptible → cuadro clínico mimético → atribución imposible por vías convencionales
            </span>
          </div>
        </div>
      )}

      {/* ============ TRACEABILITY VIEW ============ */}
      {view === "trace" && (
        <div style={{ padding:"20px 32px", animation:"fadeIn 0.3s ease" }}>

          {/* CAPABILITIES */}
          <div style={{ marginBottom:24 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:C.coral }}/>
              <span style={{ fontSize:14, fontWeight:700, color:C.white }}>¿Qué se necesita para desplegar estas tecnologías?</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {capabilities.map((cap,i) => (
                <div key={i} style={{ background:C.card, borderRadius:8, padding:"10px 14px", borderLeft:`2px solid ${cap.color}`, display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ color:cap.color, fontSize:14 }}>{cap.icon}</span>
                  <span style={{ fontSize:11.5, color:C.dim, lineHeight:1.4 }}>{cap.req}</span>
                </div>
              ))}
            </div>
            <div style={{ textAlign:"center", marginTop:10 }}>
              <span style={{ fontSize:11, color:C.amber, fontStyle:"italic" }}>
                El universo de actores con estas capacidades simultáneas es extremadamente reducido.
              </span>
            </div>
          </div>

          {/* BUDGET */}
          <div style={{ marginBottom:24 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:C.amber }}/>
              <span style={{ fontSize:14, fontWeight:700, color:C.white }}>Presupuesto documentado FY2026 — solo programas públicos, un solo país</span>
            </div>
            <div style={{ background:C.card, borderRadius:10, padding:"16px 20px", border:`1px solid ${C.amber}22` }}>
              {budgetLines.map((b,i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom: i < budgetLines.length-1 ? `1px solid ${C.slate}22` : "none" }}>
                  <div>
                    <span style={{ fontSize:12, color:C.white, fontWeight:600 }}>{b.program}</span>
                    <span style={{ fontSize:10, color:C.dim, marginLeft:10 }}>{b.source}</span>
                  </div>
                  <span style={{ fontSize:14, color:b.color, fontWeight:700, fontFamily:"monospace" }}>{b.amount}</span>
                </div>
              ))}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:12, marginTop:8, borderTop:`2px solid ${C.amber}33` }}>
                <span style={{ fontSize:13, color:C.amber, fontWeight:700 }}>Total documentado (programas públicos)</span>
                <span style={{ fontSize:18, color:C.amber, fontWeight:700, fontFamily:"monospace" }}>$950M+</span>
              </div>
            </div>
            <div style={{ textAlign:"center", marginTop:8 }}>
              <span style={{ fontSize:10, color:C.slate }}>Fuente: ASAFM J-Books, NDAA FY2026, RDTE Budget Justification Documents · No incluye programas clasificados</span>
            </div>
          </div>

          {/* HISTORICAL PATTERN */}
          <div style={{ marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:C.purple }}/>
              <span style={{ fontSize:14, fontWeight:700, color:C.white }}>Patrón histórico documentado — 7 décadas, misma constante</span>
            </div>

            {/* Timeline SVG */}
            <svg viewBox="0 0 900 80" style={{ width:"100%", maxHeight:70, marginBottom:8 }}>
              <line x1={50} y1={35} x2={850} y2={35} stroke={C.slate} strokeWidth={1} opacity={0.3}/>
              {timeline.map((t,i) => {
                const cx = 100 + i * 210;
                return (
                  <g key={i} style={{ cursor:"pointer" }} onClick={() => setExpandedPhase(expandedPhase===i ? null : i)}>
                    <PulsingOrb x={cx} y={35} r={expandedPhase===i ? 18 : 14} color={t.color}/>
                    <text x={cx} y={33} textAnchor="middle" fill="#fff" fontSize={10} fontWeight="700" dominantBaseline="middle">{i+1}</text>
                    <text x={cx} y={65} textAnchor="middle" fill={t.color} fontSize={9} fontWeight="600">{t.period}</text>
                  </g>
                );
              })}
            </svg>

            {expandedPhase !== null ? (
              <div style={{ background:C.card, borderRadius:10, padding:"18px 20px", border:`1px solid ${timeline[expandedPhase].color}33`, animation:"fadeIn 0.2s ease" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                  <div style={{ background:timeline[expandedPhase].color, color:"#fff", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:4 }}>Fase {expandedPhase+1}</div>
                  <span style={{ fontSize:15, fontWeight:700 }}>{timeline[expandedPhase].phase}</span>
                  <span style={{ fontSize:12, color:C.dim }}>{timeline[expandedPhase].period}</span>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  <div>
                    <div style={{ fontSize:10, fontWeight:700, color:timeline[expandedPhase].color, marginBottom:6, letterSpacing:0.5 }}>TECNOLOGÍAS DOCUMENTADAS</div>
                    <p style={{ fontSize:11.5, color:C.dim, lineHeight:1.5, margin:0 }}>{timeline[expandedPhase].tech}</p>

                    <div style={{ fontSize:10, fontWeight:700, color:timeline[expandedPhase].color, marginBottom:6, marginTop:14, letterSpacing:0.5 }}>NIVEL DE EVIDENCIA</div>
                    <span style={{ fontSize:11, color:C.white, background:`${timeline[expandedPhase].color}20`, padding:"4px 10px", borderRadius:4 }}>{timeline[expandedPhase].pem}</span>
                  </div>
                  <div>
                    <div style={{ fontSize:10, fontWeight:700, color:C.coral, marginBottom:6, letterSpacing:0.5 }}>POBLACIONES CIVILES AFECTADAS</div>
                    <p style={{ fontSize:11.5, color:C.white, lineHeight:1.5, margin:"0 0 10px", fontWeight:600 }}>{timeline[expandedPhase].civilians}</p>

                    <div style={{ fontSize:10, fontWeight:700, color:timeline[expandedPhase].color, marginBottom:6, letterSpacing:0.5 }}>EVIDENCIA VERIFICABLE</div>
                    <p style={{ fontSize:11, color:C.dim, lineHeight:1.5, margin:"0 0 10px" }}>{timeline[expandedPhase].evidence}</p>

                    <div style={{ fontSize:10, fontWeight:700, color:C.slate, marginBottom:4, letterSpacing:0.5 }}>FUENTES</div>
                    <p style={{ fontSize:10, color:C.slate, lineHeight:1.4, margin:0 }}>{timeline[expandedPhase].sources}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ background:C.card, borderRadius:10, padding:"16px 20px", textAlign:"center", border:`1px solid ${C.slate}33` }}>
                <p style={{ color:C.dim, fontSize:12, margin:0 }}>Seleccione una fase para ver el detalle documentado</p>
              </div>
            )}
          </div>

          {/* THE CONSTANT */}
          <div style={{ background:C.card, borderRadius:10, padding:"16px 20px", textAlign:"center", border:`1px solid ${C.purple}22` }}>
            <p style={{ fontSize:13, color:C.white, fontWeight:600, margin:"0 0 6px" }}>
              En cada fase, las tecnologías cambian. La constante que no cambia:
            </p>
            <p style={{ fontSize:14, color:C.amber, fontWeight:700, margin:0 }}>
              Población civil afectada sin consentimiento · Evidencia desclasificada décadas después · Ningún marco regulatorio vigente al momento de la exposición
            </p>
          </div>
        </div>
      )}

      {/* ============ CIVIL PARTICIPATION VIEW ============ */}
      {view === "civil" && (
        <div style={{ padding:"20px 32px", animation:"fadeIn 0.3s ease" }}>

          {/* Intro */}
          <div style={{ textAlign:"center", marginBottom:20 }}>
            <span style={{ fontSize:12, color:C.purple, fontWeight:600 }}>EL ESLABÓN MENOS VISIBLE DE LA CADENA</span>
            <p style={{ color:C.dim, fontSize:13, marginTop:6, maxWidth:700, margin:"6px auto 0", lineHeight:1.6 }}>
              Entre quien ordena y quien se beneficia, existe un actor que no es profesional, no es técnico y no es comercial. Es un civil instrumentalizado — consciente o inconscientemente — para facilitar el despliegue local.
            </p>
          </div>

          {/* What it is NOT */}
          <div style={{ display:"flex", gap:10, marginBottom:16, justifyContent:"center", flexWrap:"wrap" }}>
            {[
              { label:"No es operador", desc:"No tiene formación técnica ni acceso a sistemas de control", color:C.coral },
              { label:"No es intermediario", desc:"No opera comercialmente ni provee infraestructura", color:C.amber },
              { label:"No es beneficiario", desc:"No obtiene la ventaja estratégica de la operación", color:C.teal },
            ].map((n,i) => (
              <div key={i} style={{ background:C.card, borderRadius:8, padding:"10px 16px", border:`1px solid ${n.color}22`, flex:"1 1 200px", maxWidth:260 }}>
                <div style={{ fontSize:12, fontWeight:700, color:n.color, marginBottom:4 }}>✗ {n.label}</div>
                <div style={{ fontSize:11, color:C.dim }}>{n.desc}</div>
              </div>
            ))}
          </div>

          {/* What it IS */}
          <div style={{ background:C.card, borderRadius:10, padding:"18px 22px", border:`1px solid ${C.purple}33`, marginBottom:16 }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.purple, marginBottom:10 }}>¿Qué es entonces?</div>
            <p style={{ fontSize:13, color:C.white, lineHeight:1.7, margin:"0 0 10px" }}>
              Es una persona del entorno inmediato del target — vecino, compañero de trabajo, prestador de servicios, conocido casual — que es reclutada para realizar acciones específicas que facilitan la operación sin que necesariamente comprenda su propósito real.
            </p>
            <p style={{ fontSize:12, color:C.dim, lineHeight:1.6, margin:0 }}>
              Su participación cumple dos funciones simultáneas: reduce los costos operativos del despliegue (no se necesita personal profesional en terreno permanente) y aumenta la denegabilidad de la cadena de mando (la acción se diluye entre civiles sin perfil operacional).
            </p>
          </div>

          {/* Mechanisms */}
          <div style={{ marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:C.amber }}/>
              <span style={{ fontSize:14, fontWeight:700, color:C.white }}>Mecanismos de instrumentalización documentados</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[
                { mode:"Incentivo económico", desc:"Compensación directa o indirecta a cambio de acciones específicas: instalar dispositivos, reportar movimientos, facilitar acceso a espacios.", color:C.amber, icon:"$" },
                { mode:"Coerción", desc:"Presión mediante información comprometedora, amenaza implícita, o dependencia laboral/económica preexistente. El participante actúa por temor, no por convicción.", color:C.coral, icon:"!" },
                { mode:"Desconocimiento del alcance", desc:"Se le asigna una tarea aparentemente inocua — 'monitorear', 'reportar si sale', 'dejar encendido este equipo' — sin revelar su función real dentro de la cadena.", color:C.teal, icon:"?" },
                { mode:"Ideologización", desc:"Convencimiento de que el target representa una amenaza o merece vigilancia. Se construye una narrativa que justifica la participación como un acto cívico o de seguridad.", color:C.purple, icon:"◈" },
              ].map((m,i) => (
                <div key={i} style={{ background:C.card, borderRadius:10, padding:"14px 16px", borderLeft:`3px solid ${m.color}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                    <div style={{ width:24, height:24, borderRadius:"50%", background:`${m.color}25`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:m.color, fontWeight:700 }}>{m.icon}</div>
                    <span style={{ fontSize:12, fontWeight:700, color:m.color }}>{m.mode}</span>
                  </div>
                  <p style={{ fontSize:11, color:C.dim, lineHeight:1.5, margin:0 }}>{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Judicial relevance */}
          <div style={{ marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:C.coral }}/>
              <span style={{ fontSize:14, fontWeight:700, color:C.white }}>¿Por qué importa para el juez laboral?</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
              {[
                { point:"Dilución de la atribución", desc:"La participación de civiles dificulta identificar quién es responsable. La cadena de mando se oculta detrás de actores sin perfil operacional.", color:C.coral },
                { point:"Testigos convertidos en actores", desc:"Personas que podrían ser testigos del fenómeno se convierten en participantes, eliminando fuentes de corroboración independiente.", color:C.amber },
                { point:"Evidencia documentable", desc:"La participación civil deja rastros: patrones de coordinación, comunicaciones, dispositivos instalados, cambios de rutina. El ecosistema forense puede documentarlos.", color:C.mint },
              ].map((p,i) => (
                <div key={i} style={{ background:C.card, borderRadius:10, padding:"14px 16px", borderTop:`3px solid ${p.color}` }}>
                  <div style={{ fontSize:12, fontWeight:700, color:p.color, marginBottom:6 }}>{p.point}</div>
                  <p style={{ fontSize:11, color:C.dim, lineHeight:1.5, margin:0 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pattern */}
          <div style={{ background:C.card, borderRadius:10, padding:"16px 20px", textAlign:"center", border:`1px solid ${C.purple}22` }}>
            <p style={{ fontSize:12, color:C.dim, margin:"0 0 8px" }}>
              Este patrón está documentado desde la Fase I (1950s): civiles reclutados como intermediarios locales en programas de experimentación sin consentimiento.
            </p>
            <p style={{ fontSize:13, color:C.purple, fontWeight:700, margin:0 }}>
              La participación civil no es una anomalía. Es una característica estructural de la cadena de mando que se repite en cada fase tecnológica documentada.
            </p>
          </div>
        </div>
      )}

      {/* ============ RESPONSE VIEW ============ */}
      {view === "response" && (
        <div style={{ padding:"20px 32px", animation:"fadeIn 0.3s ease" }}>
          <p style={{ color:C.dim, fontSize:13, lineHeight:1.6, marginBottom:20 }}>
            Ante amenazas invisibles, silenciosas y distribuidas, la respuesta forense debe ser sistemática, verificable y progresiva.
          </p>

          <svg viewBox="0 0 800 120" style={{ width:"100%", maxHeight:100, marginBottom:16 }}>
            {response.map((r,i) => {
              const cx = 110+i*180;
              return (
                <g key={i}>
                  <PulsingOrb x={cx} y={55} r={22} color={r.color}/>
                  <text x={cx} y={52} textAnchor="middle" fill="#fff" fontSize={14} fontWeight="700" dominantBaseline="middle">{r.icon}</text>
                  <text x={cx} y={92} textAnchor="middle" fill={r.color} fontSize={10} fontWeight="700" letterSpacing={0.5}>{r.stage}</text>
                  {i<3 && (
                    <g>
                      <line x1={cx+28} y1={55} x2={cx+152} y2={55} stroke={r.color} strokeWidth={1.5} opacity={0.3}/>
                      <polygon points={`${cx+148},50 ${cx+155},55 ${cx+148},60`} fill={r.color} opacity={0.3}/>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {response.map((r,i) => (
              <div key={i} style={{ background:C.card, borderRadius:10, padding:"16px 20px", borderLeft:`3px solid ${r.color}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                  <div style={{ width:28,height:28,borderRadius:"50%",background:r.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#fff" }}>{r.icon}</div>
                  <span style={{ fontSize:14, fontWeight:700, color:r.color }}>{r.stage}</span>
                </div>
                <p style={{ fontSize:12, color:C.dim, lineHeight:1.6, margin:0 }}>{r.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ background:C.card, borderRadius:10, padding:"14px 20px", textAlign:"center", border:`1px solid ${C.mint}22`, marginTop:16 }}>
            <span style={{ fontSize:12, color:C.dim }}>Respaldado por </span>
            <span style={{ fontSize:12, color:C.mint, fontWeight:600 }}>más de 47 fuentes científicas peer-reviewed</span>
            <span style={{ fontSize:12, color:C.dim }}> y soporte normativo de </span>
            <span style={{ fontSize:12, color:C.amber, fontWeight:600 }}>ONU · NATO · Corte IDH</span>
          </div>
        </div>
      )}

      <div style={{ textAlign:"center", padding:"12px 0 16px", borderTop:`1px solid ${C.slate}22` }}>
        <span style={{ fontSize:10, color:C.slate }}>NeuroEthics Research Lab — NeuroEthics.cl — PEM Ecosystem v11</span>
      </div>
      <style>{`@keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  );
}
