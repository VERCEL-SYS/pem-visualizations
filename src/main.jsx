import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import NDFVisualization from './views/NDF';
import BHSVisualization from './views/BHS';
import RielesVisualization from './views/RIELES';
import PLEAPipeline from './views/plea-pipeline';          // ← NUEVO
import SpectrumBioeffect from './views/spectrum-bioeffect'; // ← NUEVO
import EcosystemMap from './views/ecosystem-map';           // ← NUEVO

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/ndf" element={<NDFVisualization />} />
        <Route path="/bhs" element={<BHSVisualization />} />
        <Route path="/rieles" element={<RielesVisualization />} />
        <Route path="/plea" element={<PLEAPipeline />} />           {/* ← NUEVO */}
        <Route path="/spectrum" element={<SpectrumBioeffect />} />  {/* ← NUEVO */}
        <Route path="/ecosystem" element={<EcosystemMap />} />      {/* ← NUEVO */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
