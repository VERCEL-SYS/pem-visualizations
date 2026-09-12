import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

function ParticleBackground() {
  const mountRef = useRef(null);
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const w = container.clientWidth, h = container.clientHeight;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#08080e');
    const camera = new THREE.PerspectiveCamera(60, w/h, 0.1, 100);
    camera.position.z = 30;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    const count = 600;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count*3);
    const colors = new Float32Array(count*3);
    const palette = [new THREE.Color('#3b82f6'),new THREE.Color('#a855f7'),new THREE.Color('#f59e0b'),new THREE.Color('#22c55e'),new THREE.Color('#ef4444')];
    for (let i=0;i<count;i++) {
      pos[i*3]=(Math.random()-0.5)*60; pos[i*3+1]=(Math.random()-0.5)*40; pos[i*3+2]=(Math.random()-0.5)*40;
      const c=palette[Math.floor(Math.random()*palette.length)];
      colors[i*3]=c.r; colors[i*3+1]=c.g; colors[i*3+2]=c.b;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors,3));
    const mat = new THREE.PointsMaterial({ size:0.12, vertexColors:true, transparent:true, opacity:0.5 });
    const particles = new THREE.Points(geo, mat);
    scene.add(particles);
    const icoGeo = new THREE.IcosahedronGeometry(5, 2);
    const icoMat = new THREE.MeshBasicMaterial({ color:'#1e3a5f', wireframe:true, transparent:true, opacity:0.15 });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    scene.add(ico);
    const ringGeo = new THREE.TorusGeometry(8, 0.03, 8, 120);
    const ringMat = new THREE.MeshBasicMaterial({ color:'#f59e0b', transparent:true, opacity:0.2 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI/2.5;
    scene.add(ring);
    let frame;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const t = Date.now()*0.0003;
      particles.rotation.y=t*0.5; particles.rotation.x=Math.sin(t)*0.1;
      ico.rotation.y=t*0.8; ico.rotation.x=t*0.3; ring.rotation.z=t*0.4;
      renderer.render(scene, camera);
    };
    animate();
    const handleResize = () => { const nw=container.clientWidth,nh=container.clientHeight; camera.aspect=nw/nh; camera.updateProjectionMatrix(); renderer.setSize(nw,nh); };
    window.addEventListener('resize', handleResize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize',handleResize); renderer.dispose(); if(container.contains(renderer.domElement)) container.removeChild(renderer.domElement); };
  }, []);
  return <div ref={mountRef} style={{ position:'fixed', inset:0, zIndex:0 }} />;
}

export default function App() {
  const navigate = useNavigate();

  const cardStyle = (color) => ({
    background: 'rgba(15,23,42,0.85)',
    backdropFilter: 'blur(16px)',
    border: `1px solid ${color}30`,
    borderRadius: 12,
    padding: '28px 24px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    flex: '1 1 280px',
    maxWidth: 360,
    minWidth: 260,
  });

  const handleHover = (e, color, enter) => {
    e.currentTarget.style.borderColor = enter ? color+'60' : color+'30';
    e.currentTarget.style.transform = enter ? 'translateY(-4px)' : 'translateY(0)';
    e.currentTarget.style.boxShadow = enter ? `0 8px 32px ${color}25` : 'none';
  };

  return (
    <div style={{ width:'100%', minHeight:'100vh', position:'relative', fontFamily:"'Inter','JetBrains Mono',sans-serif", color:'#e2e8f0' }}>
      <ParticleBackground />
      <div style={{ position:'relative', zIndex:10, width:'100%', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 20px' }}>

        {/* Branding */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ fontSize:10, color:'#64748b', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:8, fontFamily:"'JetBrains Mono',monospace" }}>
            NeuroEthics Research Lab · NeuroEthics.cl
          </div>
          <h1 style={{ fontSize:'clamp(28px,5vw,44px)', fontWeight:700, letterSpacing:'-0.03em', lineHeight:1.1, marginBottom:8, background:'linear-gradient(135deg,#e2e8f0 0%,#94a3b8 50%,#f59e0b 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            PEM Ecosystem v11
          </h1>
          <p style={{ fontSize:14, color:'#64748b', maxWidth:500, lineHeight:1.6 }}>
            Visualizaciones interactivas del ecosistema forense de evidencia progresiva
          </p>
          <div style={{ marginTop:12, fontSize:11, color:'#475569', fontStyle:'italic' }}>
            XVII Encuentro de Jueces Laborales del Uruguay · Septiembre 2026
          </div>
        </div>

        {/* Section label */}
        <div style={{ fontSize:10, color:'#475569', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:16, fontFamily:"'JetBrains Mono',monospace" }}>
          Arquitectura Legal y Forense
        </div>

        {/* Cards */}
        <div style={{ display:'flex', gap:20, flexWrap:'wrap', justifyContent:'center', maxWidth:1160 }}>

          {/* PLEA */}
          <div style={cardStyle('#a855f7')} onClick={() => navigate('/plea')}
            onMouseEnter={e => handleHover(e,'#a855f7',true)} onMouseLeave={e => handleHover(e,'#a855f7',false)}>
            <div style={{ width:36,height:36,borderRadius:8,background:'#a855f715',border:'1px solid #a855f730',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2"><path d="M3 12h4l3-9 4 18 3-9h4"/></svg>
            </div>
            <h2 style={{ fontSize:20,fontWeight:700,marginBottom:6,color:'#a855f7' }}>Arquitectura Legal</h2>
            <p style={{ fontSize:11,color:'#94a3b8',lineHeight:1.5,marginBottom:12 }}>Evidencia Progresiva en 5 Niveles</p>
            <p style={{ fontSize:10,color:'#64748b',lineHeight:1.5 }}>
              Arquitectura para transformar evidencia forense en estructura jurídica admisible. Desde la documentación de la situación hasta el caso articulable.
            </p>
            <div style={{ marginTop:16,fontSize:10,color:'#a855f7',display:'flex',alignItems:'center',gap:6 }}>Explorar →</div>
          </div>

          {/* Spectrum */}
          <div style={cardStyle('#ef4444')} onClick={() => navigate('/spectrum')}
            onMouseEnter={e => handleHover(e,'#ef4444',true)} onMouseLeave={e => handleHover(e,'#ef4444',false)}>
            <div style={{ width:36,height:36,borderRadius:8,background:'#ef444415',border:'1px solid #ef444430',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="6" cy="12" r="3"/><circle cx="18" cy="12" r="5"/><line x1="9" y1="12" x2="13" y2="12" strokeDasharray="2 2"/></svg>
            </div>
            <h2 style={{ fontSize:20,fontWeight:700,marginBottom:6,color:'#ef4444' }}>Espectro de Afectación</h2>
            <p style={{ fontSize:11,color:'#94a3b8',lineHeight:1.5,marginBottom:12 }}>Del Algoritmo al Bioefecto</p>
            <p style={{ fontSize:10,color:'#64748b',lineHeight:1.5 }}>
              El continuo completo de afectación neurofuncional documentada, desde la modulación algorítmica hasta los bioefectos electromagnéticos verificados.
            </p>
            <div style={{ marginTop:16,fontSize:10,color:'#ef4444',display:'flex',alignItems:'center',gap:6 }}>Explorar →</div>
          </div>

          {/* Ecosystem */}
          <div style={cardStyle('#22c55e')} onClick={() => navigate('/ecosystem')}
            onMouseEnter={e => handleHover(e,'#22c55e',true)} onMouseLeave={e => handleHover(e,'#22c55e',false)}>
            <div style={{ width:36,height:36,borderRadius:8,background:'#22c55e15',border:'1px solid #22c55e30',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            </div>
            <h2 style={{ fontSize:20,fontWeight:700,marginBottom:6,color:'#22c55e' }}>Ecosistema Forense</h2>
            <p style={{ fontSize:11,color:'#94a3b8',lineHeight:1.5,marginBottom:12 }}>Pipeline Integrado</p>
            <p style={{ fontSize:10,color:'#64748b',lineHeight:1.5 }}>
              Pipeline forense completo de cinco etapas: desde la documentación hasta la acción legal, integrando instrumentos, análisis y arquitectura jurídica.
            </p>
            <div style={{ marginTop:16,fontSize:10,color:'#22c55e',display:'flex',alignItems:'center',gap:6 }}>Explorar →</div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ marginTop:40, textAlign:'center', fontSize:9, color:'#334155', lineHeight:1.6, fontFamily:"'JetBrains Mono',monospace" }}>
          PEM Ecosystem v11 · NeuroEthics Research Lab · NeuroEthics.cl
          <br />
          Acceso temporal · XVII Encuentro de Jueces Laborales del Uruguay
        </div>
      </div>
    </div>
  );
}
