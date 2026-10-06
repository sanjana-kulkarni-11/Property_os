import React, { useState } from 'react';
import { User } from '../../types';
import { portfolioStore } from '../../services/api';
import {
  Settings,
  Shield,
  Bot,
  Database,
  RefreshCw,
  Download,
  CheckCircle,
  Building,
  Key,
} from 'lucide-react';

interface SettingsViewProps {
  user: User | null;
  onResetDemo: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onResetDemo,
}) => {
  const [currency, setCurrency] = useState('INR (₹ / Cr / L)');
  const [aiAutoScan, setAiAutoScan] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');

  const handleExportData = () => {
    const data = {
      properties: portfolioStore.getProperties(),
      expenses: portfolioStore.getExpenses(),
      maintenance: portfolioStore.getMaintenance(),
      staff: portfolioStore.getStaff(),
      tenants: portfolioStore.getTenants(),
      documents: portfolioStore.getDocuments(),
      insurance: portfolioStore.getInsurance(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `propertyos_portfolio_export_${Date.now()}.json`;
    a.click();
    setStatusMsg('Portfolio backup JSON generated and downloaded.');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-mono tracking-widest uppercase text-rose-400 font-semibold">
            SYSTEM PREFERENCES & COMPLIANCE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
          System Configuration
        </h1>
        <p className="text-zinc-400 text-sm mt-0.5">
          Manage family office isolation, AI model grounding parameters, and database archives.
        </p>
      </div>

      {statusMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Account / Principal Card */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Building className="w-4 h-4 text-rose-400" />
          <span>Principal Family Office Identity</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-zinc-500 block mb-1">Designated Owner / Principal</label>
            <input
              type="text"
              readOnly
              value={user?.name || 'Alex Vance'}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white font-medium"
            />
          </div>
          <div>
            <label className="text-zinc-500 block mb-1">Master Account Email</label>
            <input
              type="email"
              readOnly
              value={user?.email || 'demo@propertyos.com'}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white font-mono"
            />
          </div>
          <div>
            <label className="text-zinc-500 block mb-1">Holding Entity</label>
            <input
              type="text"
              readOnly
              value={user?.organization || 'Vance Family Office'}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white"
            />
          </div>
          <div>
            <label className="text-zinc-500 block mb-1">Primary Reporting Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white font-mono"
            >
              <option value="INR (₹ / Cr / L)">INR (Indian Rupee - Cr / Lakhs)</option>
              <option value="USD ($ / M / K)">USD ($ - Millions / Thousands)</option>
              <option value="EUR (€ / M / K)">EUR (€ - Millions / Thousands)</option>
              <option value="AED (AED)">AED (Emirati Dirham)</option>
            </select>
          </div>
        </div>
      </div>

      {/* AI Grounding Preferences */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Bot className="w-4 h-4 text-rose-400" />
          <span>PropertyOS AI Telemetry & Model Engine</span>
        </h3>
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
            <div>
              <div className="font-semibold text-white">Active LLM Foundation Model</div>
              <div className="text-zinc-400 mt-0.5">Google Gemini 3.8 Flash with Portfolio Context Window</div>
            </div>
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-rose-950/80 text-rose-300 border border-rose-800/60">
              gemini-3.8-flash
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
            <div>
              <div className="font-semibold text-white">Autonomous Anomaly Surveillance</div>
              <div className="text-zinc-400 mt-0.5">
                Automatically flags utility spikes (&gt;50% deviation) and insurance expiration deadlines.
              </div>
            </div>
            <button
              onClick={() => setAiAutoScan(!aiAutoScan)}
              className={`w-12 h-6 rounded-full transition-colors p-1 ${
                aiAutoScan ? 'bg-rose-600' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  aiAutoScan ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Database Maintenance & Archive */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-rose-400" />
          <span>Data Storage & Demo State</span>
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          PropertyOS isolates your portfolio records into private encrypted storage. You can restore default demo estates anytime or export an offline JSON archive.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={onResetDemo}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold border border-zinc-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
            <span>Reset Demo Seed Data</span>
          </button>

          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold border border-zinc-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Portfolio JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
};
