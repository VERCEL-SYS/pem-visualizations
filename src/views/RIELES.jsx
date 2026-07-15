import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";

// ═══════════════════════════════════════════════
// RIELES v1.2 — 14 Convergent Rails Data Model
// ═══════════════════════════════════════════════

const RAIL_CATEGORIES = {
  NUCLEAR: {
    id: "NUC",
    name: "Nuclear",
    color: "#ef4444",
    glow: "#ff2222",
    rule: "Todos requeridos (4/4)",
    description: "Sin estos no hay IDDS. Condición necesaria.",
  },
  AMPLIFIER: {
    id: "AMP",
    name: "Amplificador",
    color: "#f59e0b",
    glow: "#ffaa00",
    rule: "Mínimo 2 de 3",
    description: "Escalan la gravedad y alcance del daño.",
  },
  CONTEXTUAL: {
    id: "CTX",
    name: "Contextual",
    color: "#3b82f6",
    glow: "#4488ff",
    rule: "Mínimo 2 de 5",
    description: "Estructuras de impunidad que permiten la persistencia.",
  },
  ENDPOINT: {
    id: "END",
    name: "Punto Final",
    color: "#a855f7",
    glow: "#bb66ff",
    rule: "Validadores del resultado",
    description: "Violación de derechos y respuesta metodológica.",
  },
};

const RAILS = [
  // NUCLEAR (4) — All required
  {
    id: "R1", num: 1, name: "Continuo de Consentimiento",
    subtitle: "N-0 → N-3",
    category: "NUCLEAR",
    active: true,
    detail: "Escala de consentimiento desde pleno (N-0) hasta ausencia total con manipulación activa (N-3).",
  },
  {
    id: "R2", num: 2, name: "Taxonomía F-0 → F-6",
    subtitle: "Escalamiento de intervención",
    category: "NUCLEAR",
    active: true,
    detail: "Clasificación progresiva del nivel de intervención sociotecnológica sobre el sujeto.",
  },
  {
    id: "R3", num: 3, name: "Bisagra",
    subtitle: "Dato cerebral vs. dato neuronal",
    category: "NUCLEAR",
    active: true,
    detail: "El dato cerebral es capturado; el dato neuronal es construido. Distinción fundacional §7.",
  },
  {
    id: "R6", num: 6, name: "Asimetría Estado-Civil",
    subtitle: "Poder asimétrico",
    category: "NUCLEAR",
    active: true,
    detail: "Desbalance estructural de poder entre el aparato estatal/corporativo y el individuo afectado.",
  },

  // AMPLIFIER (3) — Min 2 of 3
  {
    id: "R5", num: 5, name: "Dual-Use / Guerra Cognitiva",
    subtitle: "NDAA §4201 / PE 0207039F",
    category: "AMPLIFIER",
    active: true,
    detail: "Tecnología militar de doble uso. NDAA FY2026 §4201, PE0207039F ~USD 44.3M.",
  },
  {
    id: "R10", num: 10, name: "Convergencia Tecnológica",
    subtitle: "Arma emergente",
    category: "AMPLIFIER",
    active: true,
    detail: "Múltiples tecnologías convergentes que producen un efecto de arma emergente no clasificada.",
  },
  {
    id: "R11", num: 11, name: "Daño Difuso/Continuo/Acumulativo",
    subtitle: "Crece mientras se intenta probar",
    category: "AMPLIFIER",
    active: true,
    detail: "El daño es difuso, continuo y acumulativo — se incrementa mientras el sujeto intenta demostrarlo.",
  },

  // CONTEXTUAL (5) — Min 2 of 5
  {
    id: "R4", num: 4, name: "Responsabilidad Distribuida",
    subtitle: "E-1 → E-4",
    category: "CONTEXTUAL",
    active: true,
    detail: "Cadena de responsabilidad fragmentada entre múltiples actores (operador→plataforma→Estado→intl).",
  },
  {
    id: "R7", num: 7, name: "Data Brokers",
    subtitle: "Veraset / Palantir → F-0→F-2",
    category: "CONTEXTUAL",
    active: true,
    detail: "Intermediarios de datos que alimentan los niveles iniciales de la taxonomía sin supervisión.",
  },
  {
    id: "R8", num: 8, name: "Ausencia Normativa",
    subtitle: "Neurodato inferido sin marco",
    category: "CONTEXTUAL",
    active: true,
    detail: "No existe marco normativo para el dato neuronal inferido. Vacío legal estructural.",
  },
  {
    id: "R9", num: 9, name: "Sandboxes / Digital Twins",
    subtitle: "Patentes y experimentación",
    category: "CONTEXTUAL",
    active: false,
    detail: "Entornos experimentales, gemelos digitales y patentes que permiten testeo sin regulación.",
  },
  {
    id: "R12", num: 12, name: "Ausencia de Herramientas",
    subtitle: "Descriptivas — civil y judicial",
    category: "CONTEXTUAL",
    active: true,
    detail: "Inexistencia de instrumentos forenses y descriptivos en el ámbito civil y judicial.",
  },

  // ENDPOINT (2)
  {
    id: "R13", num: 13, name: "Violación de DDHH",
    subtitle: "Endpoint de derechos fundamentales",
    category: "ENDPOINT",
    active: true,
    detail: "La convergencia de rieles culmina en violación verificable de derechos fundamentales.",
  },
  {
    id: "R14", num: 14, name: "PEM Ecosystem",
    subtitle: "Primera respuesta metodológica",
    category: "ENDPOINT",
    active: true,
    detail: "El PEM Ecosystem como primer marco metodológico de respuesta forense y probatoria.",
  },
];

function checkThreshold(rails) {
  const nuclear = rails.filter(r => r.category === "NUCLEAR");
  const amplifiers = rails.filter(r => r.category === "AMPLIFIER");
  const contextuals = rails.filter(r => r.category === "CONTEXTUAL");

  const nuclearMet = nuclear.filter(r => r.active).length === 4;
  const ampMet = amplifiers.filter(r => r.active).length >= 2;
  const ctxMet = contextuals.filter(r => r.active).length >= 2;

  return {
    nuclearMet,
    ampMet,
    ctxMet,
    converged: nuclearMet && ampMet && ctxMet,
    nuclearCount: nuclear.filter(r => r.active).length,
    ampCount: amplifiers.filter(r => r.active).length,
    ctxCount: contextuals.filter(r => r.active).length,
  };
}

// ═══════════════════════════════════════════════
// 3D SCENE
// ═══════════════════════════════════════════════

function RielesScene({ rails, threshold, rotationSpeed }) {
  const mountRef = useRef(null);
  const frameRef = useRef(null);
  const angleRef = useRef(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#050510");
    scene.fog = new THREE.FogExp2("#050510", 0.008);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 300);
    camera.position.set(0, 20, 45);
    camera.lookAt(0, 0, -10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0x112233, 0.4));
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.7);
    mainLight.position.set(10, 30, 20);
    mainLight.castShadow = true;
    scene.add(mainLight);

    if (threshold.converged) {
      const convLight = new THREE.PointLight(0xef4444, 1.2, 60);
      convLight.position.set(0, 5, -30);
      scene.add(convLight);
    }

    // Ground grid
    const grid = new THREE.GridHelper(80, 80, 0x0a0a20, 0x080818);
    grid.position.y = -2;
    scene.add(grid);

    // ── Build rails as converging tracks ──
    const railMeshes = [];
    const totalRails = rails.length;
    const convergenceZ = -35;
    const startZ = 25;
    const spreadX = 28;

    rails.forEach((rail, i) => {
      const cat = RAIL_CATEGORIES[rail.category];
      const color = new THREE.Color(cat.color);

      // Calculate start X position (spread out) and end X (converge)
      const normalizedI = (i - (totalRails - 1) / 2) / ((totalRails - 1) / 2);
      const startX = normalizedI * spreadX;
      const endX = normalizedI * 2.5; // converge but not to same point
      const yBase = -1.5;

      // Create rail track as a curved tube
      const midZ = (startZ + convergenceZ) / 2;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(startX, yBase, startZ),
        new THREE.Vector3(startX * 0.8, yBase, midZ + 15),
        new THREE.Vector3(endX * 1.5, yBase, midZ - 5),
        new THREE.Vector3(endX, yBase, convergenceZ),
      ]);

      const tubeRadius = rail.active ? 0.12 : 0.06;
      const tubeGeo = new THREE.TubeGeometry(curve, 60, tubeRadius, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: rail.active ? color : new THREE.Color("#1e293b"),
        emissive: rail.active ? color.clone().multiplyScalar(0.3) : new THREE.Color("#000000"),
        metalness: 0.6,
        roughness: 0.3,
        transparent: !rail.active,
        opacity: rail.active ? 1.0 : 0.3,
      });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(tube);

      // Rail start marker (origin sphere)
      const startGeo = new THREE.SphereGeometry(rail.active ? 0.4 : 0.2, 16, 16);
      const startMat = new THREE.MeshStandardMaterial({
        color: rail.active ? color : new THREE.Color("#334155"),
        emissive: rail.active ? color.clone().multiplyScalar(0.5) : new THREE.Color("#000000"),
        metalness: 0.5,
        roughness: 0.2,
      });
      const startSphere = new THREE.Mesh(startGeo, startMat);
      startSphere.position.set(startX, yBase, startZ);
      scene.add(startSphere);

      // Vertical label post at start
      if (rail.active) {
        const postGeo = new THREE.CylinderGeometry(0.03, 0.03, 3, 4);
        const postMat = new THREE.MeshStandardMaterial({
          color: color,
          emissive: color.clone().multiplyScalar(0.2),
          transparent: true,
          opacity: 0.5,
        });
        const post = new THREE.Mesh(postGeo, postMat);
        post.position.set(startX, yBase + 1.5, startZ);
        scene.add(post);

        // Top indicator
        const topGeo = new THREE.OctahedronGeometry(0.2, 0);
        const topMat = new THREE.MeshStandardMaterial({
          color: color,
          emissive: color.clone().multiplyScalar(0.6),
        });
        const top = new THREE.Mesh(topGeo, topMat);
        top.position.set(startX, yBase + 3.2, startZ);
        scene.add(top);
        railMeshes.push(top);
      }

      // Energy pulse particles along active rails
      if (rail.active) {
        const pulseCount = 8;
        for (let p = 0; p < pulseCount; p++) {
          const t = p / pulseCount;
          const point = curve.getPoint(t);
          const pulseGeo = new THREE.SphereGeometry(0.08, 8, 8);
          const pulseMat = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color.clone().multiplyScalar(0.8),
            transparent: true,
            opacity: 0.6,
          });
          const pulse = new THREE.Mesh(pulseGeo, pulseMat);
          pulse.position.copy(point);
          pulse.userData = { curve, speed: 0.0008 + Math.random() * 0.0005, offset: t };
          scene.add(pulse);
          railMeshes.push(pulse);
        }
      }
    });

    // ── Convergence Zone ──
    const convColor = threshold.converged
      ? new THREE.Color("#ef4444")
      : new THREE.Color("#1e293b");

    // Convergence core
    const coreGeo = new THREE.IcosahedronGeometry(threshold.converged ? 2.5 : 1.5, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: convColor,
      emissive: convColor.clone().multiplyScalar(threshold.converged ? 0.5 : 0.1),
      metalness: 0.7,
      roughness: 0.1,
      wireframe: !threshold.converged,
      transparent: true,
      opacity: threshold.converged ? 0.85 : 0.3,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.set(0, 0, convergenceZ);
    scene.add(core);

    // Convergence rings
    [3, 5, 7].forEach((r, ri) => {
      const ringGeo = new THREE.TorusGeometry(r, 0.03, 8, 80);
      const ringMat = new THREE.MeshStandardMaterial({
        color: threshold.converged ? convColor : new THREE.Color("#1a1a2e"),
        emissive: threshold.converged
          ? convColor.clone().multiplyScalar(0.2 - ri * 0.05)
          : new THREE.Color("#000000"),
        transparent: true,
        opacity: threshold.converged ? 0.5 - ri * 0.1 : 0.15,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(0, 0, convergenceZ);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
    });

    // Category zone markers along the side
    const categories = ["NUCLEAR", "AMPLIFIER", "CONTEXTUAL", "ENDPOINT"];
    categories.forEach((catKey, ci) => {
      const cat = RAIL_CATEGORIES[catKey];
      const catColor = new THREE.Color(cat.color);
      const zoneZ = startZ - ci * 4;
      const zoneX = -spreadX - 3;

      const markerGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const markerMat = new THREE.MeshStandardMaterial({
        color: catColor,
        emissive: catColor.clone().multiplyScalar(0.4),
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.set(zoneX, 0, zoneZ);
      scene.add(marker);
    });

    // Particle field
    const particleCount = 400;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = Math.random() * 20 - 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: threshold.converged ? 0x442222 : 0x222244,
      size: 0.06,
      transparent: true,
      opacity: 0.35,
    });
    scene.add(new THREE.Points(particleGeo, particleMat));

    // ── Animation ──
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const t = Date.now() * 0.001;
      angleRef.current += rotationSpeed * 0.001;

      // Camera orbit
      const camR = 45;
      const camAngle = angleRef.current;
      camera.position.x = Math.sin(camAngle) * camR;
      camera.position.z = Math.cos(camAngle) * camR * 0.6;
      camera.position.y = 18 + Math.sin(t * 0.15) * 3;
      camera.lookAt(0, 0, convergenceZ * 0.4);

      // Animate pulse particles
      railMeshes.forEach(mesh => {
        if (mesh.userData.curve) {
          const newT = (mesh.userData.offset + t * mesh.userData.speed * 60) % 1;
          const point = mesh.userData.curve.getPoint(newT);
          mesh.position.copy(point);
          mesh.position.y += Math.sin(t * 3 + mesh.userData.offset * 10) * 0.05;
        } else {
          // Rotate octahedron indicators
          mesh.rotation.y += 0.02;
          mesh.rotation.x += 0.01;
        }
      });

      // Convergence core animation
      if (threshold.converged) {
        const pulse = 1 + Math.sin(t * 1.5) * 0.1;
        core.scale.set(pulse, pulse, pulse);
        core.rotation.y += 0.005;
        core.rotation.x += 0.003;
      }

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
  }, [rails, threshold, rotationSpeed]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}

// ═══════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════

export default function RielesVisualization() {
  const navigate = useNavigate();
  const [rails, setRails] = useState(RAILS);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [selectedRail, setSelectedRail] = useState(null);
  const [showPanel, setShowPanel] = useState(true);
  const [activeTab, setActiveTab] = useState("rails");

  const threshold = useMemo(() => checkThreshold(rails), [rails]);

  const toggleRail = useCallback((index) => {
    setRails(prev => {
      const next = [...prev];
      next[index] = { ...next[index], active: !next[index].active };
      return next;
    });
  }, []);

  const catOrder = ["NUCLEAR", "AMPLIFIER", "CONTEXTUAL", "ENDPOINT"];

  return (
    <div style={{
      width: "100%",
      height: "100vh",
      background: "#050510",
      color: "#e2e8f0",
      fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* 3D Scene */}
      <div style={{ position: "absolute", inset: 0 }}>
        <RielesScene rails={rails} threshold={threshold} rotationSpeed={rotationSpeed} />
      </div>

      {/* Header */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        padding: "16px 20px",
        background: "linear-gradient(180deg, rgba(5,5,16,0.95) 0%, rgba(5,5,16,0) 100%)",
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{
            width: 10, height: 10, borderRadius: "50%",
            background: threshold.converged ? "#ef4444" : "#1e293b",
            boxShadow: threshold.converged ? "0 0 12px #ef4444" : "none",
            animation: threshold.converged ? "pulse 1.5s ease-in-out infinite" : "none",
          }} />
          <span style={{
            fontSize: 11, color: "#64748b",
            letterSpacing: "0.12em", textTransform: "uppercase",
          }}>
            PEM Ecosystem — AT-07 / RIELES v1.2
          </span>
        </div>

        <div style={{ marginTop: 8 }}>
          <h1 style={{
            fontSize: "clamp(20px, 4vw, 34px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            color: threshold.converged ? "#ef4444" : "#475569",
            textShadow: threshold.converged ? "0 0 20px #ef444440" : "none",
          }}>
            {threshold.converged ? "CONVERGENCIA ACTIVADA" : "UMBRAL NO ALCANZADO"}
          </h1>
          <p style={{
            fontSize: 11, color: "#64748b", marginTop: 4,
          }}>
            Matriz de Daño Sociotecnológico — 14 Vectores Convergentes
          </p>
        </div>

        {/* Threshold status bar */}
        <div style={{
          display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap",
        }}>
          {[
            {
              label: "Nuclear",
              count: threshold.nuclearCount,
              total: 4,
              met: threshold.nuclearMet,
              color: RAIL_CATEGORIES.NUCLEAR.color,
              rule: "4/4",
            },
            {
              label: "Amplificador",
              count: threshold.ampCount,
              total: 3,
              met: threshold.ampMet,
              color: RAIL_CATEGORIES.AMPLIFIER.color,
              rule: "≥2/3",
            },
            {
              label: "Contextual",
              count: threshold.ctxCount,
              total: 5,
              met: threshold.ctxMet,
              color: RAIL_CATEGORIES.CONTEXTUAL.color,
              rule: "≥2/5",
            },
          ].map(s => (
            <div key={s.label} style={{
              padding: "4px 10px",
              borderRadius: 4,
              background: s.met ? `${s.color}15` : "#0f172a",
              border: `1px solid ${s.met ? s.color + "40" : "#1e293b"}`,
              fontSize: 10,
            }}>
              <span style={{ color: s.met ? s.color : "#475569", fontWeight: 600 }}>
                {s.label}
              </span>
              <span style={{ color: "#64748b", marginLeft: 6 }}>
                {s.count}/{s.total}
              </span>
              <span style={{
                marginLeft: 4,
                color: s.met ? "#22c55e" : "#64748b",
                fontSize: 9,
              }}>
                {s.met ? "✓" : `(${s.rule})`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div style={{
        position: "absolute",
        bottom: 16, left: 16, zIndex: 10,
        display: "flex", gap: 8, alignItems: "center",
      }}>
        <button onClick={() => navigate('/')} style={{
          background: "#1e293b", color: "#94a3b8",
          border: "1px solid #334155", borderRadius: 4,
          padding: "4px 10px", fontSize: 10,
          cursor: "pointer", fontFamily: "inherit",
        }}>← Inicio</button>
        <label style={{ fontSize: 10, color: "#64748b" }}>Rotación</label>
        <input type="range" min="0" max="5" step="0.5" value={rotationSpeed}
          onChange={e => setRotationSpeed(parseFloat(e.target.value))}
          style={{ width: 80 }} />
      </div>

      {/* Reopen button */}
      {!showPanel && (
        <button onClick={() => setShowPanel(true)} style={{
          position: "absolute", top: 180, right: 12, zIndex: 10,
          background: "rgba(10,15,30,0.92)", backdropFilter: "blur(12px)",
          border: "1px solid #1e293b", borderRadius: 8,
          padding: "8px 14px", color: "#94a3b8", fontSize: 10,
          fontFamily: "inherit", cursor: "pointer",
          letterSpacing: "0.08em", textTransform: "uppercase",
        }}>◀ Panel</button>
      )}

      {/* Side Panel */}
      {showPanel && (
        <div style={{
          position: "absolute",
          top: 180, right: 12,
          width: 300,
          maxHeight: "calc(100vh - 220px)",
          overflowY: "auto",
          background: "rgba(10,15,30,0.92)",
          backdropFilter: "blur(12px)",
          borderRadius: 8,
          border: "1px solid #1e293b",
          zIndex: 10,
        }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #1e293b" }}>
            {["rails", "logic", "§7"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                flex: 1, padding: "8px 0", fontSize: 10, fontFamily: "inherit",
                color: activeTab === tab ? "#e2e8f0" : "#475569",
                background: activeTab === tab ? "#1e293b" : "transparent",
                border: "none", cursor: "pointer",
                textTransform: "uppercase", letterSpacing: "0.08em",
              }}>
                {tab === "rails" ? "Rieles" : tab === "logic" ? "Umbral" : "§7"}
              </button>
            ))}
            <button onClick={() => setShowPanel(false)} style={{
              padding: "8px 10px", fontSize: 10, fontFamily: "inherit",
              color: "#64748b", background: "transparent",
              border: "none", cursor: "pointer",
            }}>✕</button>
          </div>

          <div style={{ padding: 14 }}>
            {/* ── RAILS TAB ── */}
            {activeTab === "rails" && (
              <>
                {catOrder.map(catKey => {
                  const cat = RAIL_CATEGORIES[catKey];
                  const catRails = rails.filter(r => r.category === catKey);
                  return (
                    <div key={catKey} style={{ marginBottom: 14 }}>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 6, marginBottom: 6,
                      }}>
                        <div style={{
                          width: 8, height: 8, borderRadius: 2, background: cat.color,
                        }} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: cat.color }}>
                          {cat.name}
                        </span>
                        <span style={{ fontSize: 9, color: "#475569", marginLeft: "auto" }}>
                          {cat.rule}
                        </span>
                      </div>
                      {catRails.map((rail) => {
                        const railIndex = rails.findIndex(r => r.id === rail.id);
                        const isSelected = selectedRail === railIndex;
                        return (
                          <div key={rail.id}>
                            <div
                              onClick={() => setSelectedRail(isSelected ? null : railIndex)}
                              style={{
                                display: "flex", alignItems: "center", gap: 6,
                                padding: "5px 6px", borderRadius: 4, cursor: "pointer",
                                background: isSelected ? "#1e293b" : "transparent",
                                transition: "background 0.15s",
                              }}
                            >
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleRail(railIndex); }}
                                style={{
                                  width: 16, height: 16, borderRadius: 3,
                                  border: `1.5px solid ${rail.active ? cat.color : "#334155"}`,
                                  background: rail.active ? cat.color + "20" : "transparent",
                                  cursor: "pointer", display: "flex",
                                  alignItems: "center", justifyContent: "center",
                                  fontSize: 9, color: rail.active ? cat.color : "#334155",
                                  flexShrink: 0,
                                }}
                              >
                                {rail.active ? "✓" : ""}
                              </button>
                              <span style={{
                                fontSize: 9, fontWeight: 700, color: cat.color,
                                width: 24, flexShrink: 0,
                              }}>
                                R{rail.num}
                              </span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                  fontSize: 10, color: rail.active ? "#cbd5e1" : "#475569",
                                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                }}>
                                  {rail.name}
                                </div>
                                <div style={{
                                  fontSize: 8, color: "#475569",
                                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                }}>
                                  {rail.subtitle}
                                </div>
                              </div>
                            </div>
                            {isSelected && (
                              <div style={{
                                margin: "2px 0 6px 28px",
                                padding: "6px 8px",
                                background: "#0f172a",
                                borderRadius: 4,
                                borderLeft: `2px solid ${cat.color}`,
                                fontSize: 9,
                                color: "#94a3b8",
                                lineHeight: 1.5,
                              }}>
                                {rail.detail}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </>
            )}

            {/* ── LOGIC TAB ── */}
            {activeTab === "logic" && (
              <>
                <div style={{
                  fontSize: 10, color: "#64748b", marginBottom: 10,
                  textTransform: "uppercase", letterSpacing: "0.1em",
                }}>
                  Umbral Ponderado de Convergencia
                </div>

                <div style={{
                  padding: 12, background: "#0f172a", borderRadius: 6,
                  marginBottom: 12, border: "1px solid #1e293b",
                }}>
                  <div style={{ fontSize: 11, color: "#cbd5e1", marginBottom: 8 }}>
                    Hipótesis Central
                  </div>
                  <p style={{ fontSize: 9, color: "#94a3b8", lineHeight: 1.6 }}>
                    Ningún riel individual produce F-6/IDDS. Solo la convergencia de rieles nucleares + amplificadores + contextuales lo hace. Cada riel en aislamiento puede tener una explicación inocua; la matriz completa, no.
                  </p>
                </div>

                <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 8 }}>
                  Fórmula de Activación
                </div>

                {[
                  { cat: "NUCLEAR", rule: "ALL(R1, R2, R3, R6) = 4/4", met: threshold.nuclearMet },
                  { cat: "AMPLIFIER", rule: "MIN(R5, R10, R11) ≥ 2/3", met: threshold.ampMet },
                  { cat: "CONTEXTUAL", rule: "MIN(R4, R7, R8, R9, R12) ≥ 2/5", met: threshold.ctxMet },
                ].map(item => (
                  <div key={item.cat} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "6px 8px", marginBottom: 4,
                    borderRadius: 4,
                    background: item.met ? `${RAIL_CATEGORIES[item.cat].color}08` : "#0f172a",
                    border: `1px solid ${item.met ? RAIL_CATEGORIES[item.cat].color + "30" : "#1e293b"}`,
                  }}>
                    <span style={{
                      width: 14, height: 14, borderRadius: "50%",
                      background: item.met ? "#22c55e" : "#334155",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 8, color: "#fff", flexShrink: 0,
                    }}>
                      {item.met ? "✓" : ""}
                    </span>
                    <span style={{
                      fontSize: 9,
                      color: item.met ? RAIL_CATEGORIES[item.cat].color : "#475569",
                      fontFamily: "inherit",
                    }}>
                      {item.rule}
                    </span>
                  </div>
                ))}

                <div style={{
                  marginTop: 12, padding: 10,
                  borderRadius: 6,
                  background: threshold.converged ? "#ef444415" : "#0f172a",
                  border: `1px solid ${threshold.converged ? "#ef444440" : "#1e293b"}`,
                  textAlign: "center",
                }}>
                  <div style={{
                    fontSize: 13, fontWeight: 700,
                    color: threshold.converged ? "#ef4444" : "#475569",
                  }}>
                    {threshold.converged ? "IDDS CONFIRMADO" : "IDDS NO CONFIRMADO"}
                  </div>
                  <div style={{ fontSize: 9, color: "#64748b", marginTop: 4 }}>
                    {threshold.converged
                      ? "La convergencia de rieles activos supera el umbral ponderado §6."
                      : "Active/desactive rieles en la pestaña Rieles para explorar el umbral."}
                  </div>
                </div>

                <div style={{
                  marginTop: 12, fontSize: 9, color: "#475569", lineHeight: 1.5,
                }}>
                  §6 — Umbral ponderado: Nuclear (condición necesaria) + Amplificador (escalamiento) + Contextual (persistencia) = convergencia verificable.
                </div>
              </>
            )}

            {/* ── §7 TAB ── */}
            {activeTab === "§7" && (
              <>
                <div style={{
                  fontSize: 10, color: "#64748b", marginBottom: 10,
                  textTransform: "uppercase", letterSpacing: "0.1em",
                }}>
                  §7 — Distinción Fundacional
                </div>

                <div style={{
                  display: "flex", gap: 8, marginBottom: 12,
                }}>
                  <div style={{
                    flex: 1, padding: 10, borderRadius: 6,
                    background: "#0f172a",
                    border: "1px solid #3b82f630",
                  }}>
                    <div style={{
                      fontSize: 11, fontWeight: 700, color: "#3b82f6", marginBottom: 6,
                    }}>
                      Dato Cerebral
                    </div>
                    <div style={{
                      fontSize: 9, color: "#94a3b8", lineHeight: 1.5,
                    }}>
                      Capturado directamente via EEG, fMRI, BCI. Protegido por RGPD Art. 9 como dato biométrico.
                    </div>
                    <div style={{
                      fontSize: 8, color: "#3b82f6", marginTop: 8, fontStyle: "italic",
                    }}>
                      "El dato cerebral es capturado"
                    </div>
                  </div>

                  <div style={{
                    flex: 1, padding: 10, borderRadius: 6,
                    background: "#0f172a",
                    border: "1px solid #ef444430",
                  }}>
                    <div style={{
                      fontSize: 11, fontWeight: 700, color: "#ef4444", marginBottom: 6,
                    }}>
                      Dato Neuronal
                    </div>
                    <div style={{
                      fontSize: 9, color: "#94a3b8", lineHeight: 1.5,
                    }}>
                      Inferido algorítmicamente desde fuentes indirectas. Sin marco normativo. Vacío legal R8.
                    </div>
                    <div style={{
                      fontSize: 8, color: "#ef4444", marginTop: 8, fontStyle: "italic",
                    }}>
                      "El dato neuronal es construido"
                    </div>
                  </div>
                </div>

                <div style={{
                  padding: 10, background: "#0f172a", borderRadius: 6,
                  border: "1px solid #f59e0b30", marginBottom: 12,
                }}>
                  <div style={{
                    fontSize: 10, fontWeight: 600, color: "#f59e0b", marginBottom: 6,
                  }}>
                    R3 — Bisagra
                  </div>
                  <p style={{ fontSize: 9, color: "#94a3b8", lineHeight: 1.6 }}>
                    La Bisagra (R3) articula la transición entre ambos tipos de dato. RGPD Art. 9 cubre la captura pero no el uso operacional del dato neuronal inferido. Esta brecha es el eje de la impunidad estructural que RIELES v1.2 detecta y cuantifica.
                  </p>
                </div>

                <div style={{
                  padding: 10, background: "#0f172a", borderRadius: 6,
                  border: "1px solid #1e293b",
                }}>
                  <div style={{
                    fontSize: 10, fontWeight: 600, color: "#a855f7", marginBottom: 6,
                  }}>
                    §7.6 — Límites del RGPD
                  </div>
                  <p style={{ fontSize: 9, color: "#94a3b8", lineHeight: 1.6 }}>
                    Art. 9 RGPD protege la captura de datos cerebrales como datos biométricos. Pero no alcanza al uso operacional del dato neuronal inferido — la intervención IDDS opera en ese vacío. RIELES v1.2 documenta esa brecha como riel nuclear R3 + contextual R8.
                  </p>
                </div>

                <div style={{
                  marginTop: 14, paddingTop: 10, borderTop: "1px solid #1e293b",
                  fontSize: 9, color: "#475569", lineHeight: 1.5,
                }}>
                  NeuroEthics Research Lab · PEM Ecosystem v11 · AT-07/RIELES v1.2
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
        div::-webkit-scrollbar { width: 4px; }
        div::-webkit-scrollbar-track { background: transparent; }
        div::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 2px; }
      `}</style>
    </div>
  );
}
