import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Property } from '../../types';
import { formatINR } from '../../utils/formatters';
import { Eye, Shield, Zap, Layers, RefreshCw, ZoomIn, ZoomOut, Maximize2, Compass, AlertCircle } from 'lucide-react';

interface Property3DViewerProps {
  property?: Property;
  interactive?: boolean;
  height?: string;
  className?: string;
  showOverlayStats?: boolean;
}

type ViewMode = 'stealth' | 'wireframe' | 'security' | 'thermal';

interface Hotspot {
  id: string;
  name: string;
  category: string;
  status: string;
  position: [number, number, number];
  detail: string;
  costImpact?: string;
}

const ESTATE_HOTSPOTS: Hotspot[] = [
  {
    id: 'h1',
    name: '24kW Rooftop Solar Microgrid',
    category: 'Energy & Power',
    status: 'Optimal (8.4 kW Output)',
    position: [0, 4.2, 0],
    detail: 'Monocrystalline array with 40kWh LiFePO4 battery bank.',
    costImpact: 'Saves ₹34,000 / mo',
  },
  {
    id: 'h2',
    name: 'Master Suite Climate Control',
    category: 'HVAC Automation',
    status: 'Active · 21.5°C',
    position: [2.5, 3.2, 1],
    detail: 'VRF inverter compressor connected to smart environmental hub.',
  },
  {
    id: 'h3',
    name: 'Infinity Pool Filtration System',
    category: 'Plumbing & Pumps',
    status: 'Maintenance Alert',
    position: [-3.5, 0.5, 3],
    detail: 'Variable speed pump scheduled for diagnostic check.',
    costImpact: 'Pending ticket #maint-02',
  },
  {
    id: 'h4',
    name: 'Perimeter Biometric Security Gate',
    category: 'Access Control',
    status: 'Armed & Monitored',
    position: [0, 0.8, 6],
    detail: 'LiDAR optical tripwire & 4K AI night vision surveillance.',
  },
  {
    id: 'h5',
    name: '125kVA Backup Power Substation',
    category: 'Critical Infrastructure',
    status: 'Standby · 100% Fuel',
    position: [-4, 1.2, -3.5],
    detail: 'Cummins silent acoustic enclosed diesel genset.',
  },
];

export const Property3DViewer: React.FC<Property3DViewerProps> = ({
  property,
  interactive = true,
  height = '540px',
  className = '',
  showOverlayStats = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('stealth');
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [timeOfDay, setTimeOfDay] = useState<'night' | 'dusk' | 'day'>('night');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const houseGroupRef = useRef<THREE.Group | null>(null);
  const lightsGroupRef = useRef<THREE.Group | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const materialsRef = useRef<{ [key: string]: THREE.Material }>({});

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const heightPx = container.clientHeight || 540;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(viewMode === 'wireframe' ? 0x040608 : 0x07080a);
    scene.fog = new THREE.FogExp2(0x07080a, 0.035);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1000);
    camera.position.set(16, 12, 18);
    camera.lookAt(0, 2, 0);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights Group
    const lightsGroup = new THREE.Group();
    scene.add(lightsGroup);
    lightsGroupRef.current = lightsGroup;

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x1a202c, 1.2);
    lightsGroup.add(ambientLight);

    // Key directional light (stealth luxury lighting)
    const dirLight = new THREE.DirectionalLight(0xe2e8f0, 2.0);
    dirLight.position.set(15, 25, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    lightsGroup.add(dirLight);

    // Rosso Corsa red rim light (Ferrari SF90 inspired aesthetic)
    const rimLightRed = new THREE.PointLight(0xe11d48, 4.5, 30);
    rimLightRed.position.set(-8, 5, 10);
    lightsGroup.add(rimLightRed);

    // Cyan pool/ambient rim light
    const rimLightCyan = new THREE.PointLight(0x06b6d4, 3.0, 25);
    rimLightCyan.position.set(10, 4, -8);
    lightsGroup.add(rimLightCyan);

    // Ground Grid
    const grid = new THREE.GridHelper(30, 30, 0xe11d48, 0x1e293b);
    grid.position.y = -0.05;
    scene.add(grid);
    gridHelperRef.current = grid;

    // 5. Materials
    const darkConcrete = new THREE.MeshStandardMaterial({
      color: 0x12141c,
      roughness: 0.35,
      metalness: 0.2,
    });
    const carbonPanels = new THREE.MeshStandardMaterial({
      color: 0x0a0c10,
      roughness: 0.2,
      metalness: 0.8,
    });
    const tintedGlass = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85,
      transparent: true,
      opacity: 0.8,
      reflectivity: 0.9,
    });
    const glowingInterior = new THREE.MeshBasicMaterial({
      color: 0xffd29d,
    });
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.05,
      metalness: 0.9,
    });
    const redAccent = new THREE.MeshBasicMaterial({
      color: 0xe11d48,
    });

    materialsRef.current = {
      darkConcrete,
      carbonPanels,
      tintedGlass,
      glowingInterior,
      waterMaterial,
      redAccent,
    };

    // 6. Build the Architectural Luxury Estate
    const houseGroup = new THREE.Group();
    scene.add(houseGroup);
    houseGroupRef.current = houseGroup;

    // Foundation podium
    const baseGeo = new THREE.BoxGeometry(14, 0.4, 12);
    const baseMesh = new THREE.Mesh(baseGeo, darkConcrete);
    baseMesh.position.y = 0.2;
    baseMesh.receiveShadow = true;
    houseGroup.add(baseMesh);

    // Ground Floor Main Pavilion
    const gfGeo = new THREE.BoxGeometry(8, 2.8, 6);
    const gfMesh = new THREE.Mesh(gfGeo, carbonPanels);
    gfMesh.position.set(-0.5, 1.8, 0);
    gfMesh.castShadow = true;
    gfMesh.receiveShadow = true;
    houseGroup.add(gfMesh);

    // Ground floor glass facade
    const gfGlassGeo = new THREE.BoxGeometry(7.8, 2.4, 0.1);
    const gfGlassMesh = new THREE.Mesh(gfGlassGeo, tintedGlass);
    gfGlassMesh.position.set(-0.5, 1.8, 3.05);
    houseGroup.add(gfGlassMesh);

    // Warm Interior Glow Core
    const coreGlowGeo = new THREE.BoxGeometry(5, 1.8, 3);
    const coreGlowMesh = new THREE.Mesh(coreGlowGeo, glowingInterior);
    coreGlowMesh.position.set(-0.5, 1.8, 0);
    houseGroup.add(coreGlowMesh);

    // Second Floor Cantilever Suite (Luxury Architectural Overhang)
    const upperGeo = new THREE.BoxGeometry(9.5, 2.6, 5);
    const upperMesh = new THREE.Mesh(upperGeo, darkConcrete);
    upperMesh.position.set(1.5, 4.3, 0.5);
    upperMesh.castShadow = true;
    upperMesh.receiveShadow = true;
    houseGroup.add(upperMesh);

    // Upper Glass Gallery
    const upperGlassGeo = new THREE.BoxGeometry(9.2, 2.2, 0.1);
    const upperGlassMesh = new THREE.Mesh(upperGlassGeo, tintedGlass);
    upperGlassMesh.position.set(1.5, 4.3, 3.05);
    houseGroup.add(upperGlassMesh);

    // Rooftop Terrace with Solar Panels
    const roofTerraceGeo = new THREE.BoxGeometry(9, 0.3, 4.5);
    const roofTerrace = new THREE.Mesh(roofTerraceGeo, carbonPanels);
    roofTerrace.position.set(1.5, 5.7, 0.5);
    houseGroup.add(roofTerrace);

    // Solar Panel Grid on Roof
    const solarGeo = new THREE.BoxGeometry(7, 0.1, 3.2);
    const solarMesh = new THREE.Mesh(
      solarGeo,
      new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.9, roughness: 0.1 })
    );
    solarMesh.position.set(1.5, 5.9, 0.5);
    houseGroup.add(solarMesh);

    // Infinity Swimming Pool
    const poolSurroundGeo = new THREE.BoxGeometry(5.5, 0.5, 7.5);
    const poolSurround = new THREE.Mesh(poolSurroundGeo, darkConcrete);
    poolSurround.position.set(-4, 0.25, 2);
    houseGroup.add(poolSurround);

    const poolWaterGeo = new THREE.BoxGeometry(4.6, 0.35, 6.6);
    const poolWater = new THREE.Mesh(poolWaterGeo, waterMaterial);
    poolWater.position.set(-4, 0.3, 2);
    houseGroup.add(poolWater);

    // Underwater LED light glow
    const poolLight = new THREE.PointLight(0x06b6d4, 2.5, 7);
    poolLight.position.set(-4, 0.6, 2);
    houseGroup.add(poolLight);

    // Glowing Rosso Corsa Architectural Light Strip
    const lightStripGeo = new THREE.BoxGeometry(9.6, 0.08, 0.08);
    const lightStrip = new THREE.Mesh(lightStripGeo, redAccent);
    lightStrip.position.set(1.5, 3.05, 3.1);
    houseGroup.add(lightStrip);

    // Supercar Silhouette in Carport / Porte-cochère (Ferrari SF90 inspired tribute)
    const carGroup = new THREE.Group();
    carGroup.position.set(4.5, 0.4, -2.5);

    const carBodyGeo = new THREE.BoxGeometry(3.6, 0.75, 1.7);
    const carBody = new THREE.Mesh(
      carBodyGeo,
      new THREE.MeshStandardMaterial({ color: 0x0a0a0c, metalness: 0.9, roughness: 0.2 })
    );
    carBody.position.y = 0.45;
    carGroup.add(carBody);

    const carCabinGeo = new THREE.BoxGeometry(2.0, 0.55, 1.4);
    const carCabin = new THREE.Mesh(
      carCabinGeo,
      new THREE.MeshStandardMaterial({ color: 0x050505, metalness: 0.95, roughness: 0.05 })
    );
    carCabin.position.set(-0.2, 0.85, 0);
    carGroup.add(carCabin);

    // Red Tail light bar
    const tailLightGeo = new THREE.BoxGeometry(0.08, 0.1, 1.5);
    const tailLight = new THREE.Mesh(tailLightGeo, redAccent);
    tailLight.position.set(-1.82, 0.5, 0);
    carGroup.add(tailLight);

    houseGroup.add(carGroup);

    // 7. Interactive Hotspot Markers in 3D Space
    ESTATE_HOTSPOTS.forEach((spot) => {
      const pinGroup = new THREE.Group();
      pinGroup.position.set(...spot.position);

      const beaconGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: spot.category.includes('Alert') ? 0xe11d48 : 0x38bdf8,
      });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      pinGroup.add(beaconMesh);

      // Pulse ring
      const ringGeo = new THREE.RingGeometry(0.3, 0.42, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: spot.category.includes('Alert') ? 0xe11d48 : 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      pinGroup.add(ringMesh);

      houseGroup.add(pinGroup);
    });

    // Mouse drag orbit controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let sphericalTheta = Math.PI / 4;
    let sphericalPhi = Math.PI / 3.2;
    let cameraRadius = 24;

    const onMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      setIsRotating(false);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !interactive) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      sphericalTheta -= deltaX * 0.007;
      sphericalPhi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, sphericalPhi - deltaY * 0.007));

      updateCameraPosition();
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      if (!interactive) return;
      e.preventDefault();
      cameraRadius = Math.max(12, Math.min(40, cameraRadius + e.deltaY * 0.02));
      updateCameraPosition();
    };

    const updateCameraPosition = () => {
      if (!cameraRef.current) return;
      cameraRef.current.position.x = cameraRadius * Math.sin(sphericalPhi) * Math.sin(sphericalTheta);
      cameraRef.current.position.y = cameraRadius * Math.cos(sphericalPhi);
      cameraRef.current.position.z = cameraRadius * Math.sin(sphericalPhi) * Math.cos(sphericalTheta);
      cameraRef.current.lookAt(0, 2.2, 0);
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domEl.addEventListener('wheel', onWheel, { passive: false });

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle auto orbit if active
      if (isRotating && !isDragging) {
        sphericalTheta += 0.003;
        updateCameraPosition();
      }

      // Water ripple oscillation
      if (poolWater) {
        poolWater.position.y = 0.3 + Math.sin(elapsedTime * 2) * 0.02;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 540;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('wheel', onWheel);
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
      renderer.dispose();
    };
  }, [interactive]);

  // Update Materials / View Modes dynamically
  useEffect(() => {
    if (!houseGroupRef.current || !sceneRef.current) return;

    houseGroupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (viewMode === 'wireframe') {
          child.material.wireframe = true;
          if (child.material instanceof THREE.MeshStandardMaterial || child.material instanceof THREE.MeshBasicMaterial) {
            child.material.color = new THREE.Color(0x06b6d4);
          }
        } else if (viewMode === 'security') {
          child.material.wireframe = false;
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.color = new THREE.Color(0x18181b);
          }
        } else if (viewMode === 'thermal') {
          child.material.wireframe = false;
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.color = new THREE.Color(0xe11d48);
          }
        } else {
          // Stealth photoreal default
          child.material.wireframe = false;
        }
      }
    });

    if (sceneRef.current) {
      if (viewMode === 'wireframe') {
        sceneRef.current.background = new THREE.Color(0x030712);
      } else {
        sceneRef.current.background = new THREE.Color(0x07080a);
      }
    }
  }, [viewMode]);

  const currentPropName = property?.name || 'Bangalore Luxury Villa (Cadence Residence)';
  const currentValuation = property?.currentValue ? formatINR(property.currentValue) : '₹14.50 Cr';
  const currentIncome = property?.monthlyIncome ? formatINR(property.monthlyIncome) : '₹1.40 L / mo';

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl bg-[#07080a] border border-zinc-800/80 ${className}`}>
      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        style={{ height }}
        className="w-full cursor-grab active:cursor-grabbing select-none"
      />

      {/* Top Overlay Bar - Ferrari SF90 Inspired High-Precision Header */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#090b10]/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-zinc-700/60 shadow-xl pointer-events-auto">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-mono text-xs tracking-wider uppercase text-zinc-300 font-semibold">
              3D DIGITAL TWIN · SPATIAL v3.8
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-[#090b10]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-800 text-xs text-zinc-400 font-mono">
            <Compass className="w-3.5 h-3.5 text-zinc-400" />
            <span>GEO: 13.0068° N, 77.5813° E</span>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-[#090b10]/90 backdrop-blur-md p-1 rounded-xl border border-zinc-800/80 shadow-2xl pointer-events-auto">
          <button
            onClick={() => setViewMode('stealth')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'stealth'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Stealth Night</span>
          </button>

          <button
            onClick={() => setViewMode('wireframe')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'wireframe'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950/50'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Spatial Wireframe</span>
          </button>

          <button
            onClick={() => setViewMode('security')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'security'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/50'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Security LiDAR</span>
          </button>

          <button
            onClick={() => setViewMode('thermal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'thermal'
                ? 'bg-rose-700 text-white shadow-lg shadow-rose-950/50'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Thermal HVAC</span>
          </button>
        </div>
      </div>

      {/* Floating Left Specs Pill - Luxury Typography */}
      {showOverlayStats && (
        <div className="absolute bottom-4 left-4 max-w-sm bg-[#090b10]/90 backdrop-blur-xl p-4 rounded-xl border border-zinc-800/90 shadow-2xl pointer-events-auto">
          <div className="text-[11px] font-mono tracking-widest uppercase text-rose-400 font-semibold mb-1">
            EXECUTIVE ASSET
          </div>
          <h4 className="text-base font-semibold text-white tracking-tight leading-snug">
            {currentPropName}
          </h4>
          <div className="mt-3 grid grid-cols-2 gap-3 pt-3 border-t border-zinc-800/80">
            <div>
              <div className="text-[10px] text-zinc-400 font-mono uppercase">Current Valuation</div>
              <div className="text-sm font-semibold text-zinc-100 font-mono mt-0.5">{currentValuation}</div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-400 font-mono uppercase">Monthly Cashflow</div>
              <div className="text-sm font-semibold text-emerald-400 font-mono mt-0.5">{currentIncome}</div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Hotspot Inspector Modal */}
      {activeHotspot && (
        <div className="absolute top-16 right-4 max-w-xs bg-[#0b0e14]/95 backdrop-blur-2xl p-4 rounded-xl border border-zinc-700 shadow-2xl z-20">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-semibold">
                {activeHotspot.category}
              </span>
              <h5 className="text-sm font-semibold text-white mt-0.5">{activeHotspot.name}</h5>
            </div>
            <button
              onClick={() => setActiveHotspot(null)}
              className="text-zinc-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-zinc-800/60"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-zinc-300 mt-2 leading-relaxed">{activeHotspot.detail}</p>
          <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-xs">
            <span className="text-zinc-400">Status:</span>
            <span className="font-medium text-emerald-400">{activeHotspot.status}</span>
          </div>
          {activeHotspot.costImpact && (
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Financial Impact:</span>
              <span className="font-mono text-zinc-200">{activeHotspot.costImpact}</span>
            </div>
          )}
        </div>
      )}

      {/* Bottom Right Controls Bar */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-[#090b10]/90 backdrop-blur-md px-3 py-2 rounded-xl border border-zinc-800/80 pointer-events-auto">
        <button
          onClick={() => setIsRotating(!isRotating)}
          title={isRotating ? 'Pause Orbit' : 'Resume Auto-Orbit'}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            isRotating ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
        </button>

        {/* Hotspots Quick Tray */}
        <div className="h-4 w-[1px] bg-zinc-700/60" />
        <span className="text-[10px] text-zinc-400 font-mono uppercase hidden sm:inline">Telemetry Pins:</span>
        <div className="flex items-center gap-1">
          {ESTATE_HOTSPOTS.slice(0, 3).map((spot) => (
            <button
              key={spot.id}
              onClick={() => setActiveHotspot(spot)}
              className="px-2 py-1 rounded bg-zinc-800/70 hover:bg-zinc-700/80 text-[11px] font-mono text-zinc-300 transition-colors"
            >
              {spot.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
