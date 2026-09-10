import { useState } from "react";

const C = { bg:"#0B1622", card:"#142236", cardHover:"#1A2E48", white:"#FFFFFF", dim:"#8899AA", teal:"#00B4D8", mint:"#02C39A", amber:"#F2C94C", coral:"#E74C3C", purple:"#A855F7", slate:"#475569" };

const threatLayers = [
  { label:"Capa Física", desc:"Infraestructura electromagnética, acústica e ionizante. Señales imperceptibles para los sentidos humanos que operan en frecuencias fuera del rango de percepción consciente.", character:"Invisible · Imperceptible · Continua", color:C.coral, icon:"◉" },
  { label:"Capa Digital", desc:"Algoritmos de modulación conductual, perfilado neurocognitivo, dark patterns. Operan dentro de plataformas de uso cotidiano sin que el usuario perciba la manipulación.", character:"Ubicua · Normalizada · Adictiva", color:C.amber, icon:"◈" },
  { label:"Capa Institucional", desc:"Marcos regulatorios fragmentados que normalizan la exposición. Cada sector regulado por separado; la convergencia entre sectores queda sin cobertura.", character:"Estructural · Sistémica · Legítima", color:C.teal, icon:"§" },
];

const actors = [
  { role:"Comandante", desc:"Quien ordena o autoriza la operación de modulación. Puede ser institucional, corporativo o individual. Define objetivos y selecciona targets. Su distancia del punto de ejecución es parte de la arquitectura de denegabilidad.", color:C.coral, letter:"C" },
  { role:"Operador", desc:"Quien ejecuta y controla los parámetros técnicos de la exposición. Acceso directo a los sistemas de modulación. Despliega la infraestructura y calibra la intensidad, frecuencia y duración de la intervención.", color:C.amber, letter:"O" },
  { role:"Participante Civil", desc:"Persona reclutada o instrumentalizada para facilitar la operación sin necesariamente comprender su alcance. Puede actuar por incentivo, coerción o desconocimiento. Su participación dificulta la atribución y diluye la responsabilidad.", color:C.purple, letter:"P" },
  { role:"Intermediario", desc:"Data brokers, proveedores de infraestructura, plataformas de distribución y prestadores de servicios técnicos. Facilitan la cadena sin necesariamente conocer el uso final de sus capacidades.", color:C.teal, letter:"I" },
  { role:"Beneficiario", desc:"Quien obtiene ventaja de la modulación — comercial, política, institucional o personal. Puede ser distinto del comandante. Su interés es el motor económico o estratégico de la cadena.", color:C.mint, letter:"B" },
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
  const [view, setView] = useState("threat"); // threat | actors | response

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
      <div style={{ display:"flex", gap:8, padding:"16px 32px 0" }}>
        {[
          { key:"threat", label:"Arquitectura de la Amenaza", color:C.coral },
          { key:"actors", label:"Actores en la Cadena", color:C.amber },
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

      {/* THREAT VIEW */}
      {view === "threat" && (
        <div style={{ padding:"20px 32px", animation:"fadeIn 0.3s ease" }}>
          <div style={{ textAlign:"center", marginBottom:20 }}>
            <span style={{ fontSize:12, color:C.coral, fontWeight:600 }}>COGNITIVE WARFARE LAYERED ARCHITECTURE</span>
            <p style={{ color:C.dim, fontSize:12, marginTop:4 }}>Las amenazas operan en capas superpuestas — cada una invisible por diseño</p>
          </div>

          {/* Layered visualization */}
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
                  <text x={x+w-10} y={y+30} fill={l.color} fontSize={14} textAnchor="end" opacity={0.4}>{l.icon}</text>
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

      {/* ACTORS VIEW */}
      {view === "actors" && (
        <div style={{ padding:"20px 32px", animation:"fadeIn 0.3s ease" }}>
          <p style={{ color:C.dim, fontSize:13, lineHeight:1.6, marginBottom:20 }}>
            La convergencia tecnológica involucra una cadena de mando con roles diferenciados. La responsabilidad es distribuida — lo cual no equivale a su ausencia. Cada actor responde por su contribución.
          </p>

          <svg viewBox="0 0 900 180" style={{ width:"100%", maxHeight:160, marginBottom:16 }}>
            {/* Command chain arrow background */}
            <defs>
              <linearGradient id="chainGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={C.coral} stopOpacity={0.15}/>
                <stop offset="50%" stopColor={C.purple} stopOpacity={0.15}/>
                <stop offset="100%" stopColor={C.mint} stopOpacity={0.15}/>
              </linearGradient>
            </defs>
            <rect x={70} y={68} width={760} height={4} rx={2} fill="url(#chainGrad)"/>

            {actors.map((a,i) => {
              const cx = 100+i*175;
              return (
                <g key={i}>
                  <PulsingOrb x={cx} y={70} r={24} color={a.color}/>
                  <text x={cx} y={68} textAnchor="middle" fill="#fff" fontSize={12} fontWeight="700" dominantBaseline="middle">{a.letter}</text>
                  <text x={cx} y={115} textAnchor="middle" fill={a.color} fontSize={10.5} fontWeight="600">{a.role}</text>
                  {i<4 && (
                    <g>
                      <line x1={cx+30} y1={70} x2={cx+145} y2={70} stroke={a.color} strokeWidth={1.5} opacity={0.25} strokeDasharray="4 3"/>
                      <polygon points={`${cx+141},66 ${cx+148},70 ${cx+141},74`} fill={a.color} opacity={0.3}/>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Labels */}
            <text x={100} y={150} fill={C.coral} fontSize={9} fontStyle="italic" opacity={0.5}>Cadena de mando</text>
            <text x={450} y={150} fill={C.purple} fontSize={9} fontStyle="italic" opacity={0.5} textAnchor="middle">Participación civil</text>
            <text x={800} y={150} fill={C.mint} fontSize={9} fontStyle="italic" opacity={0.5} textAnchor="end">Beneficio</text>
          </svg>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
            {actors.slice(0,3).map((a,i) => (
              <div key={i} style={{ background:C.card, borderRadius:10, padding:"14px 16px", borderLeft:`3px solid ${a.color}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <div style={{ width:24,height:24,borderRadius:"50%",background:a.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff" }}>{a.letter}</div>
                  <span style={{ fontSize:13, fontWeight:700, color:a.color }}>{a.role}</span>
                </div>
                <p style={{ fontSize:11, color:C.dim, lineHeight:1.5, margin:0 }}>{a.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:10 }}>
            {actors.slice(3).map((a,i) => (
              <div key={i} style={{ background:C.card, borderRadius:10, padding:"14px 16px", borderLeft:`3px solid ${a.color}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <div style={{ width:24,height:24,borderRadius:"50%",background:a.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff" }}>{a.letter}</div>
                  <span style={{ fontSize:13, fontWeight:700, color:a.color }}>{a.role}</span>
                </div>
                <p style={{ fontSize:11, color:C.dim, lineHeight:1.5, margin:0 }}>{a.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ background:C.card, borderRadius:10, padding:"14px 20px", textAlign:"center", border:`1px solid ${C.amber}22`, marginTop:16 }}>
            <span style={{ fontSize:12, color:C.amber, fontWeight:600 }}>
              La cadena de mando opera con denegabilidad por diseño. La participación civil diluye la atribución. El ecosistema forense documenta cada eslabón.
            </span>
          </div>
        </div>
      )}

      {/* RESPONSE VIEW */}
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
