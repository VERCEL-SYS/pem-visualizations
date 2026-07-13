import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";

// BHS Domain Architecture
const BHS_DOMAINS = [
  {
    id: "COG",
    name: "Cognitivo",
    fullName: "Dominio Cognitivo",
    weight: 0.25,
    color: "#3b82f6",
    components: [
      { name: "Atención Sostenida", score: 0.82, trend: -0.04 },
      { name: "Memoria de Trabajo", score: 0.68, trend: -0.12 },
      { name: "Vel. Procesamiento", score: 0.75, trend: -0.03 },
      { name: "Control Ejecutivo", score: 0.59, trend: -0.18 },
    ],
  },
  {
    id: "AFF",
    name: "Afectivo",
    fullName: "Dominio Afectivo",
    weight: 0.20,
    color: "#ef4444",
    components: [
      { name: "Regulación Emocional", score: 0.54, trend: -0.21 },
      { name: "Reactividad al Estrés", score: 0.41, trend: -0.29 },
      { name: "Estabilidad Anímica", score: 0.62, trend: -0.13 },
    ],
  },
  {
    id: "SEN",
    name: "Sensorial",
    fullName: "Dominio Sensorial",
    weight: 0.15,
    color: "#22c55e",
    components: [
      { name: "Umbral de Dolor", score: 0.71, trend: -0.08 },
      { name: "Integración Sensorial", score: 0.77, trend: -0.04 },
      { name: "Discrim. Auditiva", score: 0.80, trend: -0.02 },
    ],
  },
  {
    id: "AUT",
    name: "Autónomo",
    fullName: "Dominio Autónomo",
    weight: 0.25,
    color: "#a855f7",
    components: [
      { name: "Ciclo Sueño-Vigilia", score: 0.45, trend: -0.30 },
      { name: "Variabilidad Cardíaca", score: 0.63, trend: -0.14 },
      { name: "Regulación Térmica", score: 0.74, trend: -0.05 },
    ],
  },
  {
    id: "MOT",
    name: "Motor",
    fullName: "Dominio Motor",
    weight: 0.15,
    color: "#f97316",
    components: [
      { name: "Coordinación Motora", score: 0.78, trend: -0.04 },
      { name: "Tiempo de Reacción", score: 0.70, trend: -0.09 },
      { name: "Estabilidad Postural", score: 0.76, trend: -0.05 },
    ],
  },
];

// Temporal BHS snapshots (12 months)
const BHS_TIMELINE = [
  { month: "Jul 25", bhs: 0.88 },
  { month: "Ago 25", bhs: 0.85 },
  { month: "Sep 25", bhs: 0.82 },
  { month: "Oct 25", bhs: 0.79 },
  { month: "Nov 25", bhs: 0.74 },
  { month: "Dic 25", bhs: 0.71 },
  { month: "Ene 26", bhs: 0.68 },
  { month: "Feb 26", bhs: 0.66 },
  { month: "Mar 26", bhs: 0.64 },
  { month: "Abr 26", bhs: 0.63 },
  { month: "May 26", bhs: 0.61 },
  { month: "Jun 26", bhs: 0.62 },
];

function computeBHS(domains) {
  let totalWeight = 0;
  let weightedSum = 0;
  domains.forEach(d => {
    const domainScore = d.components.reduce((s, c) => s + c.score, 0) / d.components.length;
    weightedSum += domainScore * d.weight;
    totalWeight += d.weight;
  });
  return weightedSum / totalWeight;
}

function getBHSZone(bhs) {
  if (bhs >= 0.80) return { label: "Óptimo", color: "#22c55e", zone: "A" };
  if (bhs >= 0.65) return { label: "Funcional", color: "#3b82f6", zone: "B" };
  if (bhs >= 0.50) return { label: "Comprometido", color: "#f59e0b", zone: "C" };
  return { label: "Crítico", color: "#ef4444", zone: "D" };
}

// 3D Brain Health Signature Scene
function BHSScene({ domains, rotationSpeed }) {
  const mountRef = useRef(null);
  const frameRef = useRef(null);
  const angleRef = useRef(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#08080e");
    scene.fog = new THREE.FogExp2("#08080e", 0.012);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 250);
    camera.position.set(0, 18, 35);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0x223344, 0.5));
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.9);
    mainLight.position.set(10, 25, 15);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const bluePoint = new THREE.PointLight(0x3b82f6, 0.6, 60);
    bluePoint.position.set(-15, 8, -10);
    scene.add(bluePoint);

    const purplePoint = new THREE.PointLight(0xa855f7, 0.4, 50);
    purplePoint.position.set(10, -5, 15);
    scene.add(purplePoint);

    // Ground plane with grid
    const groundGeo = new THREE.PlaneGeometry(60, 60);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a12,
      metalness: 0.8,
      roughness: 0.9,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(60, 60, 0x151525, 0x0f0f1a);
    grid.position.y = -0.99;
    scene.add(grid);

    // BHS stability zones (concentric rings)
    const zoneColors = [0x22c55e, 0x3b82f6, 0xf59e0b, 0xef4444];
    const zoneRadii = [4, 8, 12, 16];
    const zoneLabels = ["A", "B", "C", "D"];
    zoneRadii.forEach((r, i) => {
      const torusGeo = new THREE.TorusGeometry(r, 0.03, 8, 120);
      const torusMat = new THREE.MeshStandardMaterial({
        color: zoneColors[i],
        emissive: new THREE.Color(zoneColors[i]).multiplyScalar(0.3),
        transparent: true,
        opacity: 0.35,
      });
      const torus = new THREE.Mesh(torusGeo, torusMat);
      torus.rotation.x = Math.PI / 2;
      torus.position.y = 0;
      scene.add(torus);
    });

    // Domain pillars — pentagonal arrangement
    const domainGroup = new THREE.Group();
    const pillarData = [];

    domains.forEach((domain, i) => {
      const angle = (i / domains.length) * Math.PI * 2 - Math.PI / 2;
      const radius = 11;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const domainScore = domain.components.reduce((s, c) => s + c.score, 0) / domain.components.length;
      const domainColor = new THREE.Color(domain.color);

      // Main domain pillar — hexagonal prism
      const pillarHeight = domainScore * 16;
      const pillarGeo = new THREE.CylinderGeometry(1.2, 1.5, pillarHeight, 6);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: domainColor,
        emissive: domainColor.clone().multiplyScalar(0.15),
        metalness: 0.5,
        roughness: 0.3,
        transparent: true,
        opacity: 0.85,
      });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(x, pillarHeight / 2, z);
      pillar.castShadow = true;
      domainGroup.add(pillar);

      // Weight ring around pillar
      const weightRingGeo = new THREE.TorusGeometry(1.8, 0.06, 8, 32);
      const weightRingMat = new THREE.MeshStandardMaterial({
        color: domainColor,
        emissive: domainColor.clone().multiplyScalar(0.4),
        transparent: true,
        opacity: 0.6,
      });
      const weightRing = new THREE.Mesh(weightRingGeo, weightRingMat);
      weightRing.position.set(x, 0.1, z);
      weightRing.rotation.x = Math.PI / 2;
      domainGroup.add(weightRing);

      // Component sub-pillars around domain pillar
      domain.components.forEach((comp, ci) => {
        const compAngle = angle + ((ci - (domain.components.length - 1) / 2) * 0.18);
        const compRadius = radius + 2.8;
        const cx2 = Math.cos(compAngle) * compRadius;
        const cz = Math.sin(compAngle) * compRadius;
        const compHeight = comp.score * 12;

        const compGeo = new THREE.CylinderGeometry(0.2, 0.3, compHeight, 8);
        const trendColor = comp.trend < -0.15
          ? new THREE.Color("#ef4444")
          : comp.trend < -0.08
            ? new THREE.Color("#f59e0b")
            : domainColor;

        const compMat = new THREE.MeshStandardMaterial({
          color: trendColor,
          emissive: trendColor.clone().multiplyScalar(0.2),
          metalness: 0.3,
          roughness: 0.4,
        });
        const compMesh = new THREE.Mesh(compGeo, compMat);
        compMesh.position.set(cx2, compHeight / 2, cz);
        compMesh.castShadow = true;
        domainGroup.add(compMesh);

        // Tip sphere
        const tipGeo = new THREE.SphereGeometry(0.15, 12, 12);
        const tipMat = new THREE.MeshStandardMaterial({
          color: trendColor,
          emissive: trendColor.clone().multiplyScalar(0.5),
        });
        const tip = new THREE.Mesh(tipGeo, tipMat);
        tip.position.set(cx2, compHeight, cz);
        domainGroup.add(tip);

        // Connector line from component to domain pillar
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(cx2, compHeight * 0.5, cz),
          new THREE.Vector3(x, pillarHeight * 0.5, z),
        ]);
        const lineMat = new THREE.LineBasicMaterial({
          color: domainColor,
          transparent: true,
          opacity: 0.2,
        });
        domainGroup.add(new THREE.Line(lineGeo, lineMat));
      });

      // Top cap — icosahedron
      const capGeo = new THREE.IcosahedronGeometry(0.6, 1);
      const capMat = new THREE.MeshStandardMaterial({
        color: domainColor,
        emissive: domainColor.clone().multiplyScalar(0.4),
        metalness: 0.7,
        roughness: 0.1,
      });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(x, pillarHeight + 0.5, z);
      domainGroup.add(cap);

      pillarData.push({ x, z, height: pillarHeight, angle, cap });
    });

    // Inter-domain connections (signature web)
    for (let i = 0; i < pillarData.length; i++) {
      const next = (i + 1) % pillarData.length;
      const p1 = pillarData[i];
      const p2 = pillarData[next];

      const midY = Math.min(p1.height, p2.height) * 0.6;
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(p1.x, p1.height * 0.7, p1.z),
        new THREE.Vector3((p1.x + p2.x) / 2, midY + 2, (p1.z + p2.z) / 2),
        new THREE.Vector3(p2.x, p2.height * 0.7, p2.z)
      );
      const tubeGeo = new THREE.TubeGeometry(curve, 30, 0.04, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x667799,
        emissive: 0x223344,
        transparent: true,
        opacity: 0.35,
      });
      domainGroup.add(new THREE.Mesh(tubeGeo, tubeMat));
    }

    scene.add(domainGroup);

    // Central BHS core — glowing sphere
    const bhs = computeBHS(domains);
    const zone = getBHSZone(bhs);
    const coreColor = new THREE.Color(zone.color);

    const coreGeo = new THREE.SphereGeometry(1.8, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: coreColor,
      emissive: coreColor.clone().multiplyScalar(0.3),
      metalness: 0.6,
      roughness: 0.1,
      transparent: true,
      opacity: 0.7,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 6;
    scene.add(core);

    // Inner wireframe sphere
    const wireGeo = new THREE.IcosahedronGeometry(2.3, 2);
    const wireMat = new THREE.MeshStandardMaterial({
      color: coreColor,
      emissive: coreColor.clone().multiplyScalar(0.2),
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wireSphere = new THREE.Mesh(wireGeo, wireMat);
    wireSphere.position.y = 6;
    scene.add(wireSphere);

    // Particle field
    const particleCount = 300;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = Math.random() * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x334466,
      size: 0.08,
      transparent: true,
      opacity: 0.4,
    });
    scene.add(new THREE.Points(particleGeo, particleMat));

    // Animation
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      angleRef.current += rotationSpeed * 0.0015;
      const t = Date.now() * 0.001;

      const camR = 35;
      camera.position.x = Math.sin(angleRef.current) * camR;
      camera.position.z = Math.cos(angleRef.current) * camR;
      camera.position.y = 16 + Math.sin(t * 0.2) * 2;
      camera.lookAt(0, 4, 0);

      // Core breathing
      const breathe = 1 + Math.sin(t * 0.8) * 0.06;
      core.scale.set(breathe, breathe, breathe);
      wireSphere.rotation.y += 0.002;
      wireSphere.rotation.x += 0.001;

      // Cap rotation
      pillarData.forEach(p => {
        p.cap.rotation.y += 0.01;
        p.cap.rotation.x += 0.005;
      });

      renderer.render(scene, camera);
    };
    animate();

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
  }, [domains, rotationSpeed]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}

// Sparkline component for timeline
function Sparkline({ data, width = 200, height = 40 }) {
  const max = Math.max(...data.map(d => d.bhs));
  const min = Math.min(...data.map(d => d.bhs)) - 0.05;
  const range = max - min;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d.bhs - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = points + ` ${width},${height} 0,${height}`;

  const lastPoint = data[data.length - 1];
  const lastX = width;
  const lastY = height - ((lastPoint.bhs - min) / range) * height;
  const zone = getBHSZone(lastPoint.bhs);

  return (
    <svg width={width} height={height + 16} viewBox={`0 0 ${width} ${height + 16}`}>
      {/* Zone backgrounds */}
      {[
        { y: 0, h: height * 0.25, color: "#22c55e" },
        { y: height * 0.25, h: height * 0.25, color: "#3b82f6" },
        { y: height * 0.5, h: height * 0.25, color: "#f59e0b" },
        { y: height * 0.75, h: height * 0.25, color: "#ef4444" },
      ].map((z, i) => (
        <rect key={i} x={0} y={z.y} width={width} height={z.h}
          fill={z.color} opacity={0.04} />
      ))}
      <polygon points={areaPoints} fill="url(#sparkGrad)" opacity={0.3} />
      <polyline points={points} fill="none" stroke="#94a3b8" strokeWidth="1.5" />
      <circle cx={lastX} cy={lastY} r={3} fill={zone.color} />
      {/* Month labels */}
      {data.filter((_, i) => i % 3 === 0).map((d, i) => {
        const x = ((i * 3) / (data.length - 1)) * width;
        return (
          <text key={i} x={x} y={height + 12} fill="#475569" fontSize="6"
            textAnchor="middle" fontFamily="monospace">
            {d.month}
          </text>
        );
      })}
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#94a3b8" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Domain bar component
function DomainBar({ domain }) {
  const score = domain.components.reduce((s, c) => s + c.score, 0) / domain.components.length;
  const zone = getBHSZone(score);

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
        <div style={{
          width: 10, height: 10, borderRadius: 2,
          background: domain.color,
        }} />
        <span style={{ fontSize: 11, color: "#cbd5e1", flex: 1 }}>{domain.name}</span>
        <span style={{ fontSize: 9, color: "#64748b" }}>w={domain.weight}</span>
        <span style={{
          fontSize: 12, fontWeight: 700, color: zone.color,
        }}>
          {(score * 100).toFixed(0)}
        </span>
      </div>
      {/* Score bar */}
      <div style={{
        height: 4, borderRadius: 2, background: "#1e293b",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: `${score * 100}%`,
          borderRadius: 2,
          background: `linear-gradient(90deg, ${domain.color}80, ${domain.color})`,
          transition: "width 0.5s ease",
        }} />
      </div>
      {/* Components */}
      <div style={{ marginTop: 4, paddingLeft: 16 }}>
        {domain.components.map((c, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 4,
            fontSize: 9, color: "#64748b", lineHeight: 1.8,
          }}>
            <span style={{ flex: 1 }}>{c.name}</span>
            <span style={{
              color: c.trend < -0.15 ? "#ef4444" : c.trend < -0.08 ? "#f59e0b" : "#22c55e",
              fontWeight: 600,
            }}>
              {(c.score * 100).toFixed(0)}
            </span>
            <span style={{
              color: c.trend < -0.15 ? "#ef4444" : c.trend < -0.08 ? "#f59e0b" : "#64748b",
              fontSize: 8,
            }}>
              {c.trend > 0 ? "↑" : "↓"}{Math.abs(c.trend * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main
export default function BHSVisualization() {
  const navigate = useNavigate();
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState("domains");
  const [showPanel, setShowPanel] = useState(true);

  const bhs = useMemo(() => computeBHS(BHS_DOMAINS), []);
  const zone = useMemo(() => getBHSZone(bhs), [bhs]);

  const bhsFirst = BHS_TIMELINE[0].bhs;
  const bhsLast = BHS_TIMELINE[BHS_TIMELINE.length - 1].bhs;
  const drift = bhsLast - bhsFirst;

  return (
    <div style={{
      width: "100%",
      height: "100vh",
      background: "#08080e",
      color: "#e2e8f0",
      fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* 3D */}
      <div style={{ position: "absolute", inset: 0 }}>
        <BHSScene domains={BHS_DOMAINS} rotationSpeed={rotationSpeed} />
      </div>

      {/* Header */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        padding: "16px 20px",
        background: "linear-gradient(180deg, rgba(8,8,14,0.95) 0%, rgba(8,8,14,0) 100%)",
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{
            width: 10, height: 10, borderRadius: "50%",
            background: zone.color,
            boxShadow: `0 0 10px ${zone.color}`,
            animation: "pulse 2.5s ease-in-out infinite",
          }} />
          <span style={{
            fontSize: 11, color: "#64748b",
            letterSpacing: "0.12em", textTransform: "uppercase",
          }}>
            PEM Ecosystem — Brain Health Signature
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 8, flexWrap: "wrap" }}>
          <div>
            <span style={{
              fontSize: 46, fontWeight: 700, color: zone.color,
              letterSpacing: "-0.02em", lineHeight: 1,
              textShadow: `0 0 24px ${zone.color}40`,
            }}>
              {(bhs * 100).toFixed(1)}
            </span>
            <span style={{ fontSize: 18, color: "#475569", marginLeft: 2 }}>/100</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{
              fontSize: 13, fontWeight: 600, color: zone.color,
              padding: "2px 10px", borderRadius: 4,
              background: `${zone.color}15`,
              border: `1px solid ${zone.color}30`,
            }}>
              Zona {zone.zone} — {zone.label}
            </span>
            <span style={{ fontSize: 10, color: "#475569" }}>
              Drift 12m: {drift > 0 ? "+" : ""}{(drift * 100).toFixed(1)}% · "tu cerebro tiene firma propia"
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        position: "absolute",
        bottom: 16, left: 16, zIndex: 10,
        display: "flex", gap: 8, alignItems: "center",
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
          style={{ width: 80 }} />
      </div>

      {/* Reopen button when panel is hidden */}
      {!showPanel && (
        <button
          onClick={() => setShowPanel(true)}
          style={{
            position: "absolute",
            top: 140, right: 12,
            zIndex: 10,
            background: "rgba(12,20,35,0.92)",
            backdropFilter: "blur(12px)",
            border: "1px solid #1e293b",
            borderRadius: 8,
            padding: "8px 14px",
            color: "#94a3b8",
            fontSize: 10,
            fontFamily: "inherit",
            cursor: "pointer",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          ◀ Panel
        </button>
      )}

      {/* Side Panel */}
      {showPanel && (
      <div style={{
        position: "absolute",
        top: 140, right: 12,
        width: 280,
        maxHeight: "calc(100vh - 180px)",
        overflowY: "auto",
        background: "rgba(12,20,35,0.92)",
        backdropFilter: "blur(12px)",
        borderRadius: 8,
        border: "1px solid #1e293b",
        zIndex: 10,
      }}>
        {/* Tabs */}
        <div style={{
          display: "flex", borderBottom: "1px solid #1e293b",
        }}>
          {["domains", "timeline", "zones"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                flex: 1, padding: "8px 0",
                fontSize: 10, fontFamily: "inherit",
                color: activeTab === tab ? "#e2e8f0" : "#475569",
                background: activeTab === tab ? "#1e293b" : "transparent",
                border: "none",
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {tab === "domains" ? "Dominios" : tab === "timeline" ? "Temporal" : "Zonas"}
            </button>
          ))}
          <button onClick={() => setShowPanel(false)}
            style={{
              padding: "8px 10px",
              fontSize: 10, fontFamily: "inherit",
              color: "#64748b",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.08em",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: 14 }}>
          {activeTab === "domains" && (
            <>
              {BHS_DOMAINS.map(d => (
                <DomainBar key={d.id} domain={d} />
              ))}
              <div style={{
                marginTop: 10, paddingTop: 10, borderTop: "1px solid #1e293b",
                fontSize: 9, color: "#475569",
              }}>
                BHS = Σ(wᵢ × μ(componentes_dominio_i)) / Σwᵢ
                <br />Pesos: COG 25% · AFF 20% · SEN 15% · AUT 25% · MOT 15%
              </div>
            </>
          )}

          {activeTab === "timeline" && (
            <>
              <div style={{ fontSize: 10, color: "#64748b", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Deriva Temporal BHS (12 meses)
              </div>
              <Sparkline data={BHS_TIMELINE} width={248} height={60} />
              <div style={{ marginTop: 12 }}>
                {BHS_TIMELINE.map((t, i) => {
                  const z = getBHSZone(t.bhs);
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 6,
                      fontSize: 10, lineHeight: 1.9, color: "#94a3b8",
                    }}>
                      <span style={{ width: 44, color: "#64748b" }}>{t.month}</span>
                      <div style={{
                        flex: 1, height: 3, borderRadius: 1.5, background: "#1e293b",
                        position: "relative", overflow: "hidden",
                      }}>
                        <div style={{
                          position: "absolute", left: 0, top: 0, bottom: 0,
                          width: `${t.bhs * 100}%`,
                          background: z.color,
                          borderRadius: 1.5,
                          opacity: 0.7,
                        }} />
                      </div>
                      <span style={{ width: 26, textAlign: "right", color: z.color, fontWeight: 600 }}>
                        {(t.bhs * 100).toFixed(0)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div style={{
                marginTop: 12, fontSize: 9, color: "#475569",
                padding: "8px", background: "#0f172a", borderRadius: 4,
              }}>
                Δ = {(drift * 100).toFixed(1)}% en 12 meses
                <br />Tasa: {((drift / 12) * 100).toFixed(2)}%/mes
                <br />Transición: Zona A → Zona B
              </div>
            </>
          )}

          {activeTab === "zones" && (
            <>
              <div style={{ fontSize: 10, color: "#64748b", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Zonas de Estabilidad BHS
              </div>
              {[
                { zone: "A", label: "Óptimo", range: "80–100", color: "#22c55e",
                  desc: "Firma neurodinámica estable. Todos los dominios dentro de rango de referencia." },
                { zone: "B", label: "Funcional", range: "65–79", color: "#3b82f6",
                  desc: "Desviaciones menores detectadas. Capacidad funcional preservada con compensación." },
                { zone: "C", label: "Comprometido", range: "50–64", color: "#f59e0b",
                  desc: "Desviaciones significativas en múltiples dominios. Requiere evaluación detallada." },
                { zone: "D", label: "Crítico", range: "0–49", color: "#ef4444",
                  desc: "Compromiso severo de la firma. Indicadores de pérdida de integridad neurofuncional." },
              ].map(z => (
                <div key={z.zone} style={{
                  padding: "8px 10px",
                  borderRadius: 6,
                  marginBottom: 6,
                  background: bhs * 100 >= parseInt(z.range) && bhs * 100 <= parseInt(z.range.split("–")[1] || "100")
                    ? `${z.color}10` : "transparent",
                  border: `1px solid ${z.color}20`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: 4,
                      background: `${z.color}20`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: z.color,
                    }}>
                      {z.zone}
                    </div>
                    <span style={{ fontSize: 11, color: "#cbd5e1", flex: 1 }}>{z.label}</span>
                    <span style={{ fontSize: 10, color: "#475569" }}>{z.range}</span>
                  </div>
                  <p style={{
                    fontSize: 9, color: "#64748b", margin: "4px 0 0 26px", lineHeight: 1.4,
                  }}>
                    {z.desc}
                  </p>
                </div>
              ))}
              <div style={{
                marginTop: 10, paddingTop: 10, borderTop: "1px solid #1e293b",
                fontSize: 9, color: "#475569", lineHeight: 1.5,
              }}>
                Las zonas definen umbrales de integridad neurofuncional.
                La transición entre zonas activa protocolos diferenciados del PEM Ecosystem.
                <br /><br />
                NeuroEthics Research Lab · PEM Ecosystem v11
                <br />Modelo ilustrativo — no datos reales
              </div>
            </>
          )}
        </div>
      </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
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

