import { useState } from "react";

const C = { bg:"#0B1622", card:"#142236", white:"#FFFFFF", dim:"#8899AA", teal:"#00B4D8", mint:"#02C39A", amber:"#F2C94C", coral:"#E74C3C", purple:"#A855F7", slate:"#475569" };

const spectrum = [
  { id:1, label:"Modulación\nAlgorítmica", color:C.teal, orbSize:32,
    short:"Soft power algorítmico",
    desc:"Sistemas de recomendación, dark patterns y engagement loops que explotan sesgos neurocognitivos para influir en preferencias, emociones y decisiones. Operan de manera invisible dentro de plataformas de uso cotidiano.",
    character:"Silenciosa · Masiva · Normalizada",
    examples:["Perfilado conductual en plataformas digitales","Dark patterns que manipulan decisiones","Engagement loops que explotan dopamina","Microtargeting político y comercial"],
    gap:"Parcialmente regulado (EU AI Act, RGPD) pero sin abordar la consecuencia cognitiva acumulada.",
  },
  { id:2, label:"Entrainment\nNeuronal", color:C.amber, orbSize:38,
    short:"Sincronización forzada",
    desc:"Sincronización forzada de oscilaciones cerebrales mediante estímulos repetitivos. Las frecuencias ELF (3–300 Hz) pueden arrastrar ondas cerebrales, alterar patrones de sueño y disrumpir la producción de melatonina. Documentado desde 1976.",
    character:"Invisible · No percibida · Acumulativa",
    examples:["Arrastre de ondas cerebrales por ELF","Disrupción de sueño de onda lenta","Alteración de producción de melatonina","Estimulación subliminal repetitiva"],
    gap:"Sin regulación específica. Cae en la brecha entre telecomunicaciones y salud.",
  },
  { id:3, label:"Disrupción\nNeurofisiológica", color:C.coral, orbSize:44,
    short:"Alteración funcional",
    desc:"Alteración de ejes hormonales, sueño de onda lenta y cortisol sostenido. Produce cuadros clínicos miméticos: se diagnostica como fibromialgia, ansiedad o síndrome de intestino irritable. La fuente real nunca se investiga.",
    character:"Mimética · Clínicamente confusa · Atribuida erróneamente",
    examples:["Elevación crónica de cortisol","Disrupción del eje hipotálamo-GHRH","Cuadro clínico mimético (SII, ansiedad)","Degradación cognitiva progresiva"],
    gap:"Sin instrumentos forenses para conectar exposición con disrupción funcional documentada.",
  },
  { id:4, label:"Bioefectos\nDocumentados", color:C.purple, orbSize:50,
    short:"Hard power biofísico",
    desc:"Efectos biológicos verificados en literatura científica: audición inducida por microondas (efecto Frey, 1962), nanoporación celular, daño a ADN/ARN. Tecnologías con presupuesto documentado (NDAA FY2026 §4201: $44.3M).",
    character:"Documentada · Presupuestada · Sin restricción de exportación",
    examples:["Efecto Frey (audición por microondas, 1962)","Nanoporación celular por RF pulsada","Daño ADN/ARN documentado","Tecnologías con contratos FOIA verificables"],
    gap:"Tecnologías presupuestadas sin restricciones de exportación ni marcos de uso civil.",
  },
];

function Orb({ x, y, r, color, active, onClick }) {
  return (
    <g style={{ cursor:"pointer" }} onClick={onClick}>
      <defs>
        <radialGradient id={`og${r}`} cx="35%" cy="35%">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.3}/>
          <stop offset="40%" stopColor={color} stopOpacity={0.8}/>
          <stop offset="100%" stopColor={color} stopOpacity={0.15}/>
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r*2} fill={color} opacity={0.04}>
        <animate attributeName="r" values={`${r*1.6};${r*2.5};${r*1.6}`} dur="4s" repeatCount="indefinite"/>
      </circle>
      <circle cx={x} cy={y} r={r*1.3} fill={color} opacity={0.08}>
        <animate attributeName="opacity" values="0.04;0.12;0.04" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx={x} cy={y} r={r} fill={`url(#og${r})`} stroke={active?color:"none"} strokeWidth={active?2:0}/>
      <circle cx={x-r*0.2} cy={y-r*0.2} r={r*0.2} fill="#fff" opacity={0.2}/>
    </g>
  );
}

export default function SpectrumPublic() {
  const [active, setActive] = useState(null);
  const detail = active !== null ? spectrum[active] : null;

  return (
    <div style={{ background:C.bg, minHeight:"100vh", height:"100vh", overflowY:"auto", fontFamily:"'Segoe UI',system-ui,sans-serif", color:C.white }}>
      <div style={{ padding:"24px 32px 8px", borderBottom:`1px solid ${C.slate}33` }}>
        <h1 style={{ fontSize:26, fontWeight:700, margin:"8px 0 4px", letterSpacing:-0.5 }}>Del Algoritmo al Bioefecto</h1>
        <p style={{ color:C.dim, fontSize:13, margin:0 }}>
          El espectro completo de afectación neurofuncional — cada esfera crece con la magnitud del riesgo documentado
        </p>
      </div>

      <div style={{ padding:"8px 24px 0" }}>
        <svg viewBox="0 0 900 260" style={{ width:"100%", maxHeight:230 }}>
          <linearGradient id="specBar" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={C.teal} stopOpacity={0.12}/>
            <stop offset="100%" stopColor={C.purple} stopOpacity={0.12}/>
          </linearGradient>
          <rect x={80} y={118} width={740} height={4} rx={2} fill="url(#specBar)"/>
          {spectrum.map((s,i) => {
            if(i<3) {
              const x1=100+i*210+s.orbSize+5, x2=100+(i+1)*210-spectrum[i+1].orbSize-5;
              return <line key={`l${i}`} x1={x1} y1={120} x2={x2} y2={120} stroke={s.color} strokeWidth={1} opacity={0.2} strokeDasharray="5 4"/>;
            }
            return null;
          })}
          {spectrum.map((s,i) => (
            <g key={i}>
              <Orb x={100+i*210} y={120} r={s.orbSize} color={s.color} active={active===i} onClick={()=>setActive(active===i?null:i)}/>
              {s.label.split("\n").map((line,li) => (
                <text key={li} x={100+i*210} y={120-s.orbSize-18+li*14} textAnchor="middle" fill={active===i?"#fff":C.dim} fontSize={11} fontWeight={active===i?"700":"500"}>{line}</text>
              ))}
            </g>
          ))}
          <text x={100} y={240} fill={C.teal} fontSize={10} fontStyle="italic" opacity={0.6}>Soft power algorítmico</text>
          <text x={730} y={240} fill={C.purple} fontSize={10} fontStyle="italic" textAnchor="end" opacity={0.6}>Hard power biofísico</text>
        </svg>
      </div>

      <div style={{ padding:"0 32px 16px" }}>
        {detail ? (
          <div style={{ background:C.card, borderRadius:12, padding:24, border:`1px solid ${detail.color}33`, animation:"fadeIn 0.3s ease" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:14,height:14,borderRadius:"50%",background:detail.color,boxShadow:`0 0 12px ${detail.color}66` }}/>
                <span style={{ fontSize:18, fontWeight:700 }}>{detail.label.replace("\n"," ")}</span>
                <span style={{ color:C.dim, fontSize:13 }}>— {detail.short}</span>
              </div>
            </div>

            {/* Character badge */}
            <div style={{ background:`${detail.color}12`, borderRadius:6, padding:"8px 14px", marginBottom:16, display:"inline-block" }}>
              <span style={{ fontSize:11, color:detail.color, fontWeight:600 }}>{detail.character}</span>
            </div>

            <p style={{ color:C.dim, fontSize:13, lineHeight:1.7, margin:"0 0 16px" }}>{detail.desc}</p>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <div>
                <div style={{ fontSize:10, fontWeight:700, color:detail.color, marginBottom:8, letterSpacing:1 }}>MANIFESTACIONES</div>
                {detail.examples.map((ex,i) => (
                  <div key={i} style={{ fontSize:12, color:C.dim, padding:"4px 0" }}>• {ex}</div>
                ))}
              </div>
              <div>
                <div style={{ fontSize:10, fontWeight:700, color:detail.color, marginBottom:8, letterSpacing:1 }}>BRECHA REGULATORIA</div>
                <p style={{ fontSize:12, color:"#fff", lineHeight:1.6, margin:0 }}>{detail.gap}</p>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background:C.card, borderRadius:12, padding:20, border:`1px solid ${C.slate}33`, textAlign:"center" }}>
            <p style={{ color:C.dim, fontSize:14, margin:0 }}>Seleccione una esfera para explorar cada nivel del espectro</p>
          </div>
        )}
      </div>

      <div style={{ padding:"0 32px 16px" }}>
        <div style={{ background:C.card, borderRadius:10, padding:"14px 20px", textAlign:"center", border:`1px solid ${C.amber}22` }}>
          <span style={{ fontSize:13, fontWeight:600, color:C.amber }}>Cada nivel está regulado por separado. Ninguna regulación cubre la convergencia entre niveles.</span>
        </div>
      </div>

      <div style={{ textAlign:"center", padding:"8px 0 16px", borderTop:`1px solid ${C.slate}22` }}>
        <span style={{ fontSize:10, color:C.slate }}>NeuroEthics Research Lab — NeuroEthics.cl — PEM Ecosystem v11</span>
      </div>
      <style>{`@keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  );
}
