import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";

// 16 ANV vectors with domains, baseline ranges, and simulated deviation
const ANV_VECTORS = [
  { id: "V01", name: "Atención Sostenida", domain: "Cognitivo", baseline: 0.85, current: 0.62, unit: "idx" },
  { id: "V02", name: "Memoria de Trabajo", domain: "Cognitivo", baseline: 0.80, current: 0.55, unit: "idx" },
  { id: "V03", name: "Velocidad de Procesamiento", domain: "Cognitivo", baseline: 0.78, current: 0.71, unit: "idx" },
  { id: "V04", name: "Control Ejecutivo", domain: "Cognitivo", baseline: 0.82, current: 0.48, unit: "idx" },
  { id: "V05", name: "Regulación Emocional", domain: "Afectivo", baseline: 0.75, current: 0.42, unit: "idx" },
  { id: "V06", name: "Reactividad al Estrés", domain: "Afectivo", baseline: 0.70, current: 0.88, unit: "idx" },
  { id: "V07", name: "Estabilidad Anímica", domain: "Afectivo", baseline: 0.80, current: 0.51, unit: "idx" },
  { id: "V08", name: "Umbral de Dolor", domain: "Sensorial", baseline: 0.72, current: 0.60, unit: "idx" },
  { id: "V09", name: "Integración Sensorial", domain: "Sensorial", baseline: 0.77, current: 0.65, unit: "idx" },
  { id: "V10", name: "Discriminación Auditiva", domain: "Sensorial", baseline: 0.81, current: 0.73, unit: "idx" },
  { id: "V11", name: "Ciclo Sueño-Vigilia", domain: "Autónomo", baseline: 0.85, current: 0.39, unit: "idx" },
  { id: "V12", name: "Variabilidad Cardíaca", domain: "Autónomo", baseline: 0.79, current: 0.58, unit: "idx" },
  { id: "V13", name: "Regulación Térmica", domain: "Autónomo", baseline: 0.76, current: 0.70, unit: "idx" },
  { id: "V14", name: "Coordinación Motora", domain: "Motor", baseline: 0.83, current: 0.74, unit: "idx" },
  { id: "V15", name: "Tiempo de Reacción", domain: "Motor", baseline: 0.80, current: 0.66, unit: "idx" },
  { id: "V16", name: "Estabilidad Postural", domain: "Motor", baseline: 0.78, current: 0.72, unit: "idx" },
];

const DOMAIN_COLORS = {
  Cognitivo: { base: "#2563eb", light: "#93c5fd", dark: "#1e40af" },
  Afectivo: { base: "#dc2626", light: "#fca5a5", dark: "#991b1b" },
  Sensorial: { base: "#16a34a", light: "#86efac", dark: "#166534" },
  Autónomo: { base: "#9333ea", light: "#c4b5fd", dark: "#6b21a8" },
  Motor: { base: "#ea580c", light: "#fdba74", dark: "#9a3412" },
};

const SIGNATURE_AMBER = "#f59e0b";

function computeNDF(vectors) {
  const deviations = vectors.map(v => {
    const dev = Math.abs(v.current - v.baseline) / v.baseline;
    return dev;
  });
  const mean = deviations.reduce((a, b) => a + b, 0) / deviations.length;
  return mean;
}

function getSeverity(ndf) {
  if (ndf < 0.10) return { label: "Normal", color: "#22c55e" };
  if (ndf < 0.20) return { label: "Leve", color: "#eab308" };
  if (ndf < 0.35) return { label: "Moderado", color: "#f97316" };
  return { label: "Severo", color: "#ef4444" };
}

// 3D Scene component
function ThreeScene({ vectors, showBaseline, showDeviation, selectedVector, onSelectVector, rotationSpeed }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const frameRef = useRef(null);
  const meshesRef = useRef({ baseline: [], current: [], labels: [], connections: [] });
  const angleRef = useRef(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0a0a0f");
    scene.fog = new THREE.FogExp2("#0a0a0f", 0.015);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 200);
    camera.position.set(0, 12, 28);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0x334455, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(10, 20, 15);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x4488ff, 0.8, 50);
    pointLight.position.set(-5, 10, -5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xff4488, 0.4, 40);
    pointLight2.position.set(5, -5, 10);
    scene.add(pointLight2);

    // Grid floor
    const gridHelper = new THREE.GridHelper(40, 40, 0x1a1a2e, 0x111122);
    gridHelper.position.y = -0.5;
    scene.add(gridHelper);

    // Central ring (signature reference)
    const ringGeo = new THREE.TorusGeometry(10, 0.04, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x334466,
      emissive: 0x112233,
      transparent: true,
      opacity: 0.5
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0;
    scene.add(ring);

    // Build vector columns
    const baselineMeshes = [];
    const currentMeshes = [];
    const connectionLines = [];

    vectors.forEach((v, i) => {
      const angle = (i / vectors.length) * Math.PI * 2 - Math.PI / 2;
      const radius = 10;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const domainColor = DOMAIN_COLORS[v.domain];
      const baseColor = new THREE.Color(domainColor.base);
      const deviation = Math.abs(v.current - v.baseline) / v.baseline;

      // Baseline column (translucent)
      const baseHeight = v.baseline * 12;
      const baseGeo = new THREE.CylinderGeometry(0.3, 0.3, baseHeight, 12);
      const baseMat = new THREE.MeshStandardMaterial({
        color: baseColor,
        transparent: true,
        opacity: 0.2,
        wireframe: false,
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.set(x, baseHeight / 2, z);
      scene.add(baseMesh);
      baselineMeshes.push(baseMesh);

      // Current value column (solid, with emission based on deviation)
      const curHeight = v.current * 12;
      const curGeo = new THREE.CylinderGeometry(0.25, 0.35, curHeight, 12);
      const deviationColor = deviation > 0.25 ? new THREE.Color("#ef4444") :
                             deviation > 0.15 ? new THREE.Color(SIGNATURE_AMBER) :
                             baseColor;
      const curMat = new THREE.MeshStandardMaterial({
        color: deviationColor,
        emissive: deviationColor.clone().multiplyScalar(0.3),
        metalness: 0.4,
        roughness: 0.3,
      });
      const curMesh = new THREE.Mesh(curGeo, curMat);
      curMesh.position.set(x, curHeight / 2, z);
      curMesh.userData = { vectorIndex: i };
      scene.add(curMesh);
      currentMeshes.push(curMesh);

      // Deviation connector line (top of current to top of baseline)
      if (deviation > 0.05) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x, curHeight, z),
          new THREE.Vector3(x, baseHeight, z),
        ]);
        const lineMat = new THREE.LineBasicMaterial({
          color: deviation > 0.25 ? 0xef4444 : 0xf59e0b,
          transparent: true,
          opacity: 0.7,
        });
        const line = new THREE.Line(lineGeo, lineMat);
        scene.add(line);
        connectionLines.push(line);
      }

      // Sphere at top of current column
      const sphereGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: deviationColor,
        emissive: deviationColor.clone().multiplyScalar(0.5),
        metalness: 0.6,
        roughness: 0.2,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set(x, curHeight, z);
      scene.add(sphere);

      // Base marker sphere
      const baseMarkerGeo = new THREE.SphereGeometry(0.12, 8, 8);
      const baseMarkerMat = new THREE.MeshStandardMaterial({
        color: 0x667788,
        emissive: 0x223344,
        transparent: true,
        opacity: 0.6,
      });
      const baseMarker = new THREE.Mesh(baseMarkerGeo, baseMarkerMat);
      baseMarker.position.set(x, 0, z);
      scene.add(baseMarker);
    });

    meshesRef.current = { baseline: baselineMeshes, current: currentMeshes, connections: connectionLines };

    // Signature wave ring (animated)
    const wavePoints = [];
    for (let i = 0; i <= 200; i++) {
      const a = (i / 200) * Math.PI * 2;
      const r = 10;
      wavePoints.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
    }
    const waveCurve = new THREE.CatmullRomCurve3(wavePoints, true);
    const waveGeo = new THREE.TubeGeometry(waveCurve, 200, 0.02, 8, true);
    const waveMat = new THREE.MeshStandardMaterial({
      color: SIGNATURE_AMBER,
      emissive: new THREE.Color(SIGNATURE_AMBER).multiplyScalar(0.4),
      transparent: true,
      opacity: 0.6,
    });
    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    scene.add(waveMesh);

    // Animation
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      angleRef.current += rotationSpeed * 0.002;

      const camRadius = 28;
      const camY = 12 + Math.sin(angleRef.current * 0.3) * 2;
      camera.position.x = Math.sin(angleRef.current) * camRadius;
      camera.position.z = Math.cos(angleRef.current) * camRadius;
      camera.position.y = camY;
      camera.lookAt(0, 3, 0);

      // Pulse effect on deviated vectors
      currentMeshes.forEach((mesh, idx) => {
        const v = vectors[idx];
        const dev = Math.abs(v.current - v.baseline) / v.baseline;
        if (dev > 0.20) {
          const scale = 1 + Math.sin(Date.now() * 0.003 + idx) * 0.05;
          mesh.scale.x = scale;
          mesh.scale.z = scale;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [vectors, rotationSpeed]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}

// Radar chart component (2D complement)
function RadarOverlay({ vectors, size = 220 }) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2 - 30;

  const makePoint = (index, value) => {
    const angle = (index / vectors.length) * Math.PI * 2 - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * maxR * value,
      y: cy + Math.sin(angle) * maxR * value,
    };
  };

  const baselinePath = vectors.map((v, i) => {
    const p = makePoint(i, v.baseline);
    return `${i === 0 ? "M" : "L"}${p.x},${p.y}`;
  }).join(" ") + "Z";

  const currentPath = vectors.map((v, i) => {
    const p = makePoint(i, v.current);
    return `${i === 0 ? "M" : "L"}${p.x},${p.y}`;
  }).join(" ") + "Z";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid rings */}
      {[0.25, 0.5, 0.75, 1.0].map(r => (
        <circle key={r} cx={cx} cy={cy} r={maxR * r}
          fill="none" stroke="#1e293b" strokeWidth="0.5" />
      ))}
      {/* Axes */}
      {vectors.map((v, i) => {
        const p = makePoint(i, 1.0);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y}
          stroke="#1e293b" strokeWidth="0.5" />;
      })}
      {/* Baseline polygon */}
      <path d={baselinePath} fill="rgba(59,130,246,0.1)" stroke="#3b82f6"
        strokeWidth="1.5" strokeDasharray="4,3" />
      {/* Current polygon */}
      <path d={currentPath} fill="rgba(245,158,11,0.15)" stroke={SIGNATURE_AMBER}
        strokeWidth="1.5" />
      {/* Labels */}
      {vectors.map((v, i) => {
        const p = makePoint(i, 1.18);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            fill="#94a3b8" fontSize="6.5" fontFamily="monospace">
            {v.id}
          </text>
        );
      })}
    </svg>
  );
}

// Main App
export default function NDFVisualization() {
  const navigate = useNavigate();
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [selectedVector, setSelectedVector] = useState(null);
  const [showPanel, setShowPanel] = useState(true);

  const ndf = useMemo(() => computeNDF(ANV_VECTORS), []);
  const severity = useMemo(() => getSeverity(ndf), [ndf]);

  const domainStats = useMemo(() => {
    const domains = {};
    ANV_VECTORS.forEach(v => {
      if (!domains[v.domain]) domains[v.domain] = [];
      const dev = Math.abs(v.current - v.baseline) / v.baseline;
      domains[v.domain].push(dev);
    });
    return Object.entries(domains).map(([name, devs]) => ({
      name,
      avgDev: devs.reduce((a, b) => a + b, 0) / devs.length,
      maxDev: Math.max(...devs),
      count: devs.length,
    }));
  }, []);

  return (
    <div style={{
      width: "100%",
      height: "100vh",
      background: "#0a0a0f",
      color: "#e2e8f0",
      fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* 3D Scene */}
      <div style={{ position: "absolute", inset: 0 }}>
        <ThreeScene
          vectors={ANV_VECTORS}
          showBaseline={true}
          showDeviation={true}
          selectedVector={selectedVector}
          onSelectVector={setSelectedVector}
          rotationSpeed={rotationSpeed}
        />
      </div>

      {/* Top Header */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        padding: "16px 20px",
        background: "linear-gradient(180deg, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0) 100%)",
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: severity.color,
            boxShadow: `0 0 8px ${severity.color}`,
            animation: "pulse 2s ease-in-out infinite",
          }} />
          <span style={{ fontSize: 11, color: "#64748b", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            PEM Ecosystem — NDF Indicator
          </span>
          <span style={{ fontSize: 11, color: "#475569" }}>|</span>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>
            Indicador de Desviación de Firma Neurodinámica
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 8 }}>
          <span style={{
            fontSize: 42,
            fontWeight: 700,
            color: severity.color,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            textShadow: `0 0 20px ${severity.color}40`,
          }}>
            {(ndf * 100).toFixed(1)}%
          </span>
          <span style={{
            fontSize: 13,
            color: severity.color,
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: 4,
            background: `${severity.color}15`,
            border: `1px solid ${severity.color}30`,
          }}>
            {severity.label}
          </span>
        </div>
        <div style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>
          16 vectores ANV/AIVV · Firma vs. Estado Actual · Modelo Ilustrativo
        </div>
      </div>

      {/* Controls */}
      <div style={{
        position: "absolute",
        bottom: 16,
        left: 16,
        zIndex: 10,
        display: "flex",
        gap: 8,
        alignItems: "center",
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: "#1e293b",
            color: "#94a3b8",
            border: "1px solid #334155",
            borderRadius: 4,
            padding: "4px 10px",
            fontSize: 10,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          ← Inicio
        </button>
        <label style={{ fontSize: 10, color: "#64748b" }}>Rotación</label>
        <input type="range" min="0" max="5" step="0.5" value={rotationSpeed}
          onChange={e => setRotationSpeed(parseFloat(e.target.value))}
          style={{ width: 80 }}
        />
        <button
          onClick={() => setShowPanel(!showPanel)}
          style={{
            background: "#1e293b",
            color: "#94a3b8",
            border: "1px solid #334155",
            borderRadius: 4,
            padding: "4px 10px",
            fontSize: 10,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {showPanel ? "Ocultar Panel" : "Mostrar Panel"}
        </button>
      </div>

      {/* Side Panel */}
      {showPanel && (
        <div style={{
          position: "absolute",
          top: 130,
          right: 12,
          width: 280,
          maxHeight: "calc(100vh - 180px)",
          overflowY: "auto",
          background: "rgba(15,23,42,0.92)",
          backdropFilter: "blur(12px)",
          borderRadius: 8,
          border: "1px solid #1e293b",
          zIndex: 10,
          padding: 14,
        }}>
          {/* Radar */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <RadarOverlay vectors={ANV_VECTORS} size={200} />
          </div>
          <div style={{
            display: "flex", justifyContent: "center", gap: 16,
            fontSize: 9, color: "#64748b", marginBottom: 14,
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 12, height: 2, background: "#3b82f6", display: "inline-block" }} /> Baseline
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 12, height: 2, background: SIGNATURE_AMBER, display: "inline-block" }} /> Actual
            </span>
          </div>

          {/* Domain Summary */}
          <div style={{ fontSize: 10, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Dominios
          </div>
          {domainStats.map(d => (
            <div key={d.name} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "5px 0",
              borderBottom: "1px solid #1e293b",
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: 2,
                background: DOMAIN_COLORS[d.name].base,
              }} />
              <span style={{ fontSize: 11, color: "#cbd5e1", flex: 1 }}>{d.name}</span>
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: d.avgDev > 0.25 ? "#ef4444" : d.avgDev > 0.15 ? SIGNATURE_AMBER : "#22c55e",
              }}>
                {(d.avgDev * 100).toFixed(0)}%
              </span>
            </div>
          ))}

          {/* Vector List */}
          <div style={{
            fontSize: 10, color: "#64748b", marginTop: 14, marginBottom: 6,
            textTransform: "uppercase", letterSpacing: "0.1em"
          }}>
            16 Vectores ANV
          </div>
          {ANV_VECTORS.map((v, i) => {
            const dev = Math.abs(v.current - v.baseline) / v.baseline;
            return (
              <div key={v.id}
                onClick={() => setSelectedVector(selectedVector === i ? null : i)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "4px 6px",
                  borderRadius: 4,
                  cursor: "pointer",
                  background: selectedVector === i ? "#1e293b" : "transparent",
                  transition: "background 0.15s",
                }}
              >
                <span style={{
                  fontSize: 9, color: DOMAIN_COLORS[v.domain].base,
                  fontWeight: 700, width: 28, flexShrink: 0,
                }}>
                  {v.id}
                </span>
                <span style={{
                  fontSize: 10, color: "#94a3b8", flex: 1,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {v.name}
                </span>
                <span style={{ fontSize: 10, color: "#475569", width: 28, textAlign: "right" }}>
                  {v.current.toFixed(2)}
                </span>
                <div style={{
                  width: 4, height: 4, borderRadius: "50%",
                  background: dev > 0.25 ? "#ef4444" : dev > 0.15 ? SIGNATURE_AMBER : "#22c55e",
                }} />
              </div>
            );
          })}

          {/* Footer */}
          <div style={{
            marginTop: 14,
            paddingTop: 10,
            borderTop: "1px solid #1e293b",
            fontSize: 9,
            color: "#475569",
            lineHeight: 1.5,
          }}>
            NDF = Indicador de Desviación de Firma Neurodinámica.
            Columnas translúcidas = baseline. Columnas sólidas = estado actual.
            Rojo = desviación &gt;25%. Ámbar = &gt;15%.
            <br /><br />
            NeuroEthics Research Lab · PEM Ecosystem v11
            <br />
            Modelo ilustrativo — no datos reales
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          height: 3px;
          background: #334155;
          border-radius: 2px;
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          background: #64748b;
          border-radius: 50%;
          cursor: pointer;
        }
        div::-webkit-scrollbar {
          width: 4px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}

