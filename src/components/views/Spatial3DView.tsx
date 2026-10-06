import React, { useState } from 'react';
import { Property } from '../../types';
import { Property3DViewer } from '../3d/Property3DViewer';
import { formatINR } from '../../utils/formatters';
import {
  Box,
  Compass,
  Cpu,
  Shield,
  Zap,
  Activity,
  Layers,
  Sun,
  Eye,
  Sliders,
  Maximize2,
  Building,
  CheckCircle,
} from 'lucide-react';

interface Spatial3DViewProps {
  properties: Property[];
  onSelectPropertyDetail: (prop: Property) => void;
}

export const Spatial3DView: React.FC<Spatial3DViewProps> = ({
  properties,
  onSelectPropertyDetail,
}) => {
  const [selectedProperty, setSelectedProperty] = useState<Property>(properties[0] || {} as Property);
  const [activeFloor, setActiveFloor] = useState<string>('All Levels');
  const [activeTelemetryTab, setActiveTelemetryTab] = useState<'energy' | 'security' | 'climate'>('energy');

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header - Ferrari SF90 Inspired High-Precision Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-rose-400 font-semibold">
              3D SPATIAL DIGITAL TWIN · SPATIAL OS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            Architectural Telemetry & 3D Command
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Interactive photorealistic 3D models with real-time IoT subsystem diagnostics.
          </p>
        </div>

        {/* Property Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-xl text-xs">
            <Building className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={selectedProperty.id}
              onChange={(e) => {
                const found = properties.find((p) => p.id === e.target.value);
                if (found) setSelectedProperty(found);
              }}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id} className="bg-zinc-900 text-white">
                  {p.name} ({p.city})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onSelectPropertyDetail(selectedProperty)}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors shadow-lg shadow-rose-950/50"
          >
            Manage Estate →
          </button>
        </div>
      </div>

      {/* Split Console: 3D Viewport on Left (Wide) + High-Precision Telemetry on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3D Interactive Viewport (8 Columns) */}
        <div className="lg:col-span-8 space-y-4">
          <Property3DViewer
            property={selectedProperty}
            height="580px"
            showOverlayStats={true}
          />

          {/* Quick Subsystem Controls below canvas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
              <div className="flex items-center gap-2 text-zinc-400 text-xs">
                <Zap className="w-3.5 h-3.5 text-rose-400" />
                <span>Microgrid</span>
              </div>
              <div className="text-base font-mono font-bold text-white mt-1">24.2 kW</div>
              <div className="text-[10px] text-emerald-400 font-mono mt-0.5">82% Battery Bank</div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
              <div className="flex items-center gap-2 text-zinc-400 text-xs">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>HVAC Load</span>
              </div>
              <div className="text-base font-mono font-bold text-white mt-1">4.8 kW</div>
              <div className="text-[10px] text-zinc-400 font-mono mt-0.5">Set to 21.5°C Eco</div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
              <div className="flex items-center gap-2 text-zinc-400 text-xs">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Perimeter Security</span>
              </div>
              <div className="text-base font-mono font-bold text-emerald-400 mt-1">Armed</div>
              <div className="text-[10px] text-zinc-400 font-mono mt-0.5">6/6 Sensors Active</div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
              <div className="flex items-center gap-2 text-zinc-400 text-xs">
                <Activity className="w-3.5 h-3.5 text-rose-400" />
                <span>Water Storage</span>
              </div>
              <div className="text-base font-mono font-bold text-white mt-1">94%</div>
              <div className="text-[10px] text-zinc-400 font-mono mt-0.5">Rainwater Filtered</div>
            </div>
          </div>
        </div>

        {/* Right Precision Telemetry Console (4 Columns) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Estate Identity Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800/90 shadow-2xl">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span>ESTATE SPECIFICATIONS</span>
              <span className="text-rose-400 font-semibold">{selectedProperty.specs.energyRating}</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1 tracking-tight">
              {selectedProperty.name}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">{selectedProperty.address}</p>

            <div className="mt-4 pt-4 border-t border-zinc-800/80 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Est. Valuation</span>
                <div className="text-sm font-mono font-bold text-white mt-0.5">
                  {formatINR(selectedProperty.currentValue)}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Built Area</span>
                <div className="text-sm font-mono font-bold text-zinc-200 mt-0.5">
                  {selectedProperty.specs.areaSqFt.toLocaleString()} sq.ft
                </div>
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Architecture</span>
                <div className="text-xs text-zinc-300 mt-0.5 line-clamp-1">
                  {selectedProperty.specs.architecturalStyle}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Annual ROI</span>
                <div className="text-sm font-mono font-bold text-rose-400 mt-0.5">
                  {selectedProperty.roi}%
                </div>
              </div>
            </div>
          </div>

          {/* Level / Slice Switcher */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Spatial Slices</span>
              <Layers className="w-4 h-4 text-zinc-500" />
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {['All Levels', 'Level 2: Penthouse Master Wing', 'Level 1: Living & Infinity Deck', 'Level 0: 4-Car Garage & Power Substation'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setActiveFloor(lvl)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between ${
                    activeFloor === lvl
                      ? 'bg-rose-950/60 text-white font-medium border border-rose-800/50'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  <span>{lvl}</span>
                  {activeFloor === lvl && <CheckCircle className="w-3.5 h-3.5 text-rose-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Architectural Features Tag Cloud */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
            <div className="text-xs font-semibold text-white">Automated Systems & Features</div>
            <div className="flex flex-wrap gap-1.5">
              {selectedProperty.features.map((f, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800/80 text-[11px] font-mono text-zinc-300 border border-zinc-700/60"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
