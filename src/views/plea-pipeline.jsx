import { useState } from "react";

const C = { bg:"#0B1622", card:"#142236", white:"#FFFFFF", dim:"#8899AA", teal:"#00B4D8", mint:"#02C39A", amber:"#F2C94C", coral:"#E74C3C", purple:"#A855F7", slate:"#475569" };

const levels = [
  { id:1, title:"Situación", color:C.teal,
    subtitle:"Documentar antes de acusar",
    desc:"El primer paso no es identificar al responsable sino documentar el fenómeno como situación. Se registra qué está ocurriendo, dónde, cuándo y con qué intensidad — sin necesidad de afirmar quién lo causa.",
    why:"¿Por qué importa para un juez?",
    judicial:"Permite iniciar una investigación sin la carga de probar causalidad desde el primer momento. La situación se documenta como objeto de estudio, no como acusación.",
    principle:"Se investiga primero la situación, no el caso.",
  },
  { id:2, title:"Patrón", color:C.teal,
    subtitle:"De lo aislado a lo recurrente",
    desc:"Los incidentes aislados no hacen un caso. Pero cuando los datos revelan patrones recurrentes — correlaciones temporales, espaciales o conductuales — emerge una estructura que merece investigación.",
    why:"¿Por qué importa para un juez?",
    judicial:"Los patrones transforman coincidencias en indicios. La recurrencia documentada con datos instrumentales es evidencia de que algo sistemático está operando.",
    principle:"El patrón emerge de los datos, no se impone sobre ellos.",
  },
  { id:3, title:"Mecanismo", color:C.amber,
    subtitle:"Plausibilidad científica",
    desc:"¿Existe un mecanismo conocido por la ciencia que conecte la exposición documentada con los efectos observados? La literatura peer-reviewed proporciona el puente entre la correlación y la explicación.",
    why:"¿Por qué importa para un juez?",
    judicial:"El mecanismo plausible diferencia una hipótesis fundada de una especulación. No se necesita certeza absoluta — se necesita plausibilidad científica verificable.",
    principle:"El mecanismo debe ser falsable y verificable.",
  },
  { id:4, title:"Atribución", color:C.coral,
    subtitle:"Responsabilidad diferenciada",
    desc:"Recién en este nivel se identifican los actores en la cadena causal. La atribución puede ser directa o distribuida entre múltiples actores que contribuyen al entorno de exposición.",
    why:"¿Por qué importa para un juez?",
    judicial:"La responsabilidad distribuida no es un argumento para la impunidad — es un fenómeno documentable. Cada actor responde por su contribución a la cadena.",
    principle:"La distribución de responsabilidad no equivale a su ausencia.",
  },
  { id:5, title:"Caso", color:C.mint,
    subtitle:"Estructura jurídica admisible",
    desc:"La evidencia progresiva de los niveles anteriores se integra en una estructura jurídica admisible. El caso no se construye de una vez: se articula capa por capa, del indicio a la prueba.",
    why:"¿Por qué importa para un juez?",
    judicial:"El estándar de prueba laboral — preponderancia de evidencia — es compatible con evidencia progresiva. No se requiere certeza absoluta sino suficiencia probatoria gradual.",
    principle:"La evidencia progresiva es compatible con el estándar de prueba.",
  },
];

function NeuralOrb({ x, y, r, color, active, onClick }) {
  return (
    <g style={{ cursor:"pointer" }} onClick={onClick}>
      <circle cx={x} cy={y} r={r*2.2} fill={color} opacity={0.04}>
        <animate attributeName="r" values={`${r*1.8};${r*2.8};${r*1.8}`} dur="4s" repeatCount="indefinite"/>
      </circle>
      <circle cx={x} cy={y} r={r*1.3} fill={color} opacity={0.1}>
        <animate attributeName="opacity" values="0.06;0.14;0.06" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx={x} cy={y} r={r} fill={color} opacity={active?0.9:0.55}>
        <animate attributeName="opacity" values={`${active?0.7:0.4};${active?1:0.7};${active?0.7:0.4}`} dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx={x-r*0.2} cy={y-r*0.2} r={r*0.25} fill="#fff" opacity={0.25}/>
    </g>
  );
}

export default function PLEAPipelinePublic() {
  const [active, setActive] = useState(null);
  const detail = active !== null ? levels[active] : null;

  return (
    <div style={{ background:C.bg, minHeight:"100vh", height:"100vh", overflowY:"auto", fontFamily:"'Segoe UI',system-ui,sans-serif", color:C.white }}>
      <div style={{ padding:"24px 32px 8px", borderBottom:`1px solid ${C.slate}33` }}>
        <h1 style={{ fontSize:26, fontWeight:700, margin:"8px 0 4px", letterSpacing:-0.5 }}>
          Arquitectura Legal de Evidencia Progresiva
        </h1>
        <p style={{ color:C.dim, fontSize:13, margin:0 }}>
          Un modelo de cinco niveles para transformar fenómenos complejos en casos jurídicamente articulables
        </p>
      </div>

      <div style={{ padding:"16px 24px 0" }}>
        <svg viewBox="0 0 920 320" style={{ width:"100%", maxHeight:280 }}>
          {[0,1,2,3].map(i => {
            const x1 = 100+i*195+40, x2 = 100+(i+1)*195-40;
            const isAct = active!==null && (active===i||active===i+1);
            return <line key={i} x1={x1} y1={160} x2={x2} y2={160} stroke={levels[i].color} strokeWidth={isAct?2.5:1} opacity={isAct?0.7:0.2} strokeDasharray={isAct?"none":"5 4"}/>;
          })}
          {levels.map((l,i) => {
            const cx = 100+i*195;
            return (
              <g key={i}>
                <NeuralOrb x={cx} y={160} r={active===i?36:28} color={l.color} active={active===i} onClick={()=>setActive(active===i?null:i)}/>
                <text x={cx} y={157} textAnchor="middle" fill="#fff" fontSize={18} fontWeight="700" dominantBaseline="middle">{l.id}</text>
                <text x={cx} y={215} textAnchor="middle" fill={l.color} fontSize={13} fontWeight="600">{l.title}</text>
                <text x={cx} y={235} textAnchor="middle" fill={C.dim} fontSize={10}>{l.subtitle}</text>
                <rect x={cx-35} y={250} width={70} height={18} rx={4} fill={l.color} opacity={0.12}/>
                <text x={cx} y={262} textAnchor="middle" fill={l.color} fontSize={9} fontWeight="600">Nivel {l.id}</text>
              </g>
            );
          })}
          <text x={460} y={300} textAnchor="middle" fill={C.dim} fontSize={10} fontStyle="italic">
            Situación → Patrón → Mecanismo → Atribución → Caso
          </text>
        </svg>
      </div>

      <div style={{ padding:"0 32px 16px" }}>
        {detail ? (
          <div style={{ background:C.card, borderRadius:12, padding:24, border:`1px solid ${detail.color}33`, animation:"fadeIn 0.3s ease" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
              <div style={{ width:36,height:36,borderRadius:"50%",background:detail.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:"#fff" }}>{detail.id}</div>
              <div>
                <span style={{ fontSize:20, fontWeight:700 }}>{detail.title}</span>
                <span style={{ color:C.dim, fontSize:13, marginLeft:10 }}>— {detail.subtitle}</span>
              </div>
            </div>
            <p style={{ color:C.dim, fontSize:14, lineHeight:1.7, margin:"0 0 20px" }}>{detail.desc}</p>
            <div style={{ background:`${detail.color}10`, borderRadius:8, padding:"16px 20px", borderLeft:`3px solid ${detail.color}` }}>
              <div style={{ fontSize:11, fontWeight:700, color:detail.color, marginBottom:6 }}>{detail.why}</div>
              <p style={{ fontSize:13, color:"#fff", lineHeight:1.6, margin:0 }}>{detail.judicial}</p>
            </div>
            <div style={{ marginTop:16, textAlign:"center" }}>
              <span style={{ fontSize:12, color:detail.color, fontStyle:"italic" }}>"{detail.principle}"</span>
            </div>
          </div>
        ) : (
          <div style={{ background:C.card, borderRadius:12, padding:20, border:`1px solid ${C.slate}33`, textAlign:"center" }}>
            <p style={{ color:C.dim, fontSize:14, margin:0 }}>Seleccione un nivel para explorar su relevancia judicial</p>
          </div>
        )}
      </div>

      <div style={{ padding:"0 32px 16px" }}>
        <div style={{ background:C.card, borderRadius:10, padding:"14px 20px", textAlign:"center", border:`1px solid ${C.amber}22` }}>
          <span style={{ fontSize:12, color:C.dim }}>Respaldo normativo internacional: </span>
          <span style={{ fontSize:12, color:C.amber, fontWeight:600 }}>Naciones Unidas · NATO · Corte Interamericana de Derechos Humanos</span>
        </div>
      </div>

      <div style={{ textAlign:"center", padding:"8px 0 16px", borderTop:`1px solid ${C.slate}22` }}>
        <span style={{ fontSize:10, color:C.slate }}>NeuroEthics Research Lab — NeuroEthics.cl — PEM Ecosystem v11</span>
      </div>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}
