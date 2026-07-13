import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

function ParticleBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#08080e');

    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particle field
    const count = 600;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#3b82f6'),
      new THREE.Color('#a855f7'),
      new THREE.Color('#f59e0b'),
      new THREE.Color('#22c55e'),
      new THREE.Color('#ef4444'),
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
    });
    const particles = new THREE.Points(geo, mat);
    scene.add(particles);

    // Central wireframe brain-like structure
    const icoGeo = new THREE.IcosahedronGeometry(5, 2);
    const icoMat = new THREE.MeshBasicMaterial({
      color: '#1e3a5f',
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    scene.add(ico);

    // Signature ring
    const ringGeo = new THREE.TorusGeometry(8, 0.03, 8, 120);
    const ringMat = new THREE.MeshBasicMaterial({
      color: '#f59e0b',
      transparent: true,
      opacity: 0.2,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.5;
    scene.add(ring);

    let frame;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const t = Date.now() * 0.0003;
      particles.rotation.y = t * 0.5;
      particles.rotation.x = Math.sin(t) * 0.1;
      ico.rotation.y = t * 0.8;
      ico.rotation.x = t * 0.3;
      ring.rotation.z = t * 0.4;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />;
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

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      position: 'relative',
      fontFamily: "'Inter', 'JetBrains Mono', sans-serif",
      color: '#e2e8f0',
      overflow: 'hidden',
    }}>
      <ParticleBackground />

      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        {/* Branding */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            fontSize: 10,
            color: '#64748b',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: 8,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            NeuroEthics Research Lab · NeuroEthics.cl
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 44px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: 8,
            background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 50%, #f59e0b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            PEM Ecosystem v11
          </h1>
          <p style={{
            fontSize: 14,
            color: '#64748b',
            maxWidth: 500,
            lineHeight: 1.6,
          }}>
            Visualizaciones interactivas 3D de indicadores de integridad neurofuncional
          </p>
          <div style={{
            marginTop: 12,
            fontSize: 11,
            color: '#f59e0b',
            fontStyle: 'italic',
            opacity: 0.7,
          }}>
            "tu cerebro tiene firma propia"
          </div>
        </div>

        {/* Cards */}
        <div style={{
          display: 'flex',
          gap: 20,
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: 780,
        }}>
          {/* NDF Card */}
          <div
            style={cardStyle('#f59e0b')}
            onClick={() => navigate('/ndf')}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#f59e0b60';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(245,158,11,0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#f59e0b30';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: '#f59e0b15',
              border: '1px solid #f59e0b30',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h2 style={{
              fontSize: 20, fontWeight: 700, marginBottom: 6,
              color: '#f59e0b',
            }}>
              NDF
            </h2>
            <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5, marginBottom: 12 }}>
              Indicador de Desviación de Firma Neurodinámica
            </p>
            <p style={{ fontSize: 10, color: '#64748b', lineHeight: 1.5 }}>
              Visualización 3D de los 16 vectores ANV/AIVV con comparación baseline vs. estado actual, clasificación por dominio y severidad de desviación.
            </p>
            <div style={{
              marginTop: 16,
              fontSize: 10,
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              Explorar →
            </div>
          </div>

          {/* BHS Card */}
          <div
            style={cardStyle('#3b82f6')}
            onClick={() => navigate('/bhs')}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#3b82f660';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(59,130,246,0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#3b82f630';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: '#3b82f615',
              border: '1px solid #3b82f630',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h2 style={{
              fontSize: 20, fontWeight: 700, marginBottom: 6,
              color: '#3b82f6',
            }}>
              BHS
            </h2>
            <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5, marginBottom: 12 }}>
              Brain Health Signature
            </p>
            <p style={{ fontSize: 10, color: '#64748b', lineHeight: 1.5 }}>
              Arquitectura 3D de 5 dominios con componentes, zonas de estabilidad (A–D), deriva temporal de 12 meses y scoring compuesto ponderado.
            </p>
            <div style={{
              marginTop: 16,
              fontSize: 10,
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              Explorar →
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 40,
          textAlign: 'center',
          fontSize: 9,
          color: '#334155',
          lineHeight: 1.6,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          PEM Ecosystem v11 · NeuroEthics Research Lab · NeuroEthics.cl
          <br />
          Modelo ilustrativo — no datos reales
        </div>
      </div>
    </div>
  );
}
