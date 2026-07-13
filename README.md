# PEM Ecosystem — Visualizaciones 3D Interactivas

Visualizaciones 3D interactivas de indicadores de integridad neurofuncional del PEM Ecosystem v11.

## Indicadores

- **NDF** — Indicador de Desviación de Firma Neurodinámica (16 vectores ANV/AIVV)
- **BHS** — Brain Health Signature (5 dominios, zonas de estabilidad A–D)

## Stack

- React 18 + Vite
- Three.js (renderizado 3D)
- React Router (navegación)

## Deploy en Vercel (recomendado)

### Opción A — Desde GitHub (automático)

1. Crear repositorio en GitHub:
   ```bash
   cd pem-visualizations
   git init
   git add .
   git commit -m "PEM Ecosystem 3D Visualizations v1.0"
   git remote add origin https://github.com/TU_USUARIO/pem-visualizations.git
   git push -u origin main
   ```

2. Ir a [vercel.com](https://vercel.com) → "Add New Project"
3. Importar el repositorio de GitHub
4. Vercel detecta Vite automáticamente → Click "Deploy"
5. URL asignada: `pem-visualizations.vercel.app` (personalizable)

### Opción B — Desde CLI (directo)

```bash
npm install -g vercel
cd pem-visualizations
npm install
vercel
```

Seguir las instrucciones interactivas. Deploy automático.

### Dominio personalizado (opcional)

En Vercel Dashboard → Settings → Domains:
- Agregar `pem.neuroethics.cl` o `visualizaciones.neuroderechos.cl`
- Configurar CNAME en tu DNS apuntando a `cname.vercel-dns.com`

## Desarrollo local

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`

## Estructura

```
pem-visualizations/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── src/
    ├── main.jsx          # Router
    ├── App.jsx           # Landing con navegación
    └── views/
        ├── NDF.jsx       # Visualización NDF 3D
        └── BHS.jsx       # Visualización BHS 3D
```

## Notas

- Datos ilustrativos — no datos reales de pacientes
- Modelo visual para publicaciones y presentaciones
- NeuroEthics Research Lab · NeuroEthics.cl · PEM Ecosystem v11

---

© 2026 NeuroEthics Research Lab — Horacio A. Correa Arechavala
