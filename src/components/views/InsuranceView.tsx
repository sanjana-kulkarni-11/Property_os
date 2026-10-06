import React, { useState } from 'react';
import { InsurancePolicy, Property } from '../../types';
import { formatINR, formatDate } from '../../utils/formatters';
import {
  ShieldCheck,
  Plus,
  Trash2,
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  Search,
  X,
  Building,
} from 'lucide-react';

interface InsuranceViewProps {
  insurance: InsurancePolicy[];
  properties: Property[];
  onCreateInsurance: (policy: Omit<InsurancePolicy, 'id'>) => void;
  onDeleteInsurance: (id: string) => void;
}

export const InsuranceView: React.FC<InsuranceViewProps> = ({
  insurance,
  properties,
  onCreateInsurance,
  onDeleteInsurance,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [form, setForm] = useState({
    propertyId: properties[0]?.id || '',
    provider: 'Tata AIG General Insurance',
    policyNumber: '',
    coverage: 150000000,
    premium: 145000,
    startDate: '2025-10-24',
    expiryDate: '2026-10-24',
    status: 'Expiring Soon' as const,
    documentName: 'Policy_Schedule.pdf',
  });

  const filtered = insurance.filter(
    (i) =>
      i.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.policyNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // KPIs
  const activeCount = insurance.filter((i) => i.status === 'Active').length;
  const expiringSoonCount = insurance.filter((i) => i.status === 'Expiring Soon').length;
  const expiredCount = insurance.filter((i) => i.status === 'Expired').length;
  const totalAnnualPremium = insurance.reduce((acc, i) => acc + i.premium, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find((p) => p.id === form.propertyId);
    if (!prop) return;

    onCreateInsurance({
      ...form,
      propertyName: prop.name,
      policyNumber: form.policyNumber || `BGR-${Math.floor(Math.random() * 900000 + 100000)}`,
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono tracking-widest uppercase text-rose-400 font-semibold">
              ASSET UNDERWRITING & POLICY VAULT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            Insurance Policies
          </h1>
          <p className="text-zinc-400 text-sm mt-0.5">
            All-risk property casualty, high-value artwork riders, and automated renewal triggers.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950/60 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Policy Cover</span>
        </button>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-xs text-emerald-400">Active Policies</span>
          <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">{activeCount} Covered</div>
        </div>
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-900/40">
          <span className="text-xs text-amber-300">Expiring Soon (18 Days)</span>
          <div className="text-2xl font-mono font-bold text-amber-400 mt-1">{expiringSoonCount} Attention</div>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-xs text-zinc-400">Expired Policies</span>
          <div className="text-2xl font-mono font-bold text-zinc-400 mt-1">{expiredCount}</div>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-xs text-zinc-400">Annual Total Premium</span>
          <div className="text-2xl font-mono font-bold text-white mt-1">{formatINR(totalAnnualPremium)}</div>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search policies by provider, property, or policy number..."
            className="w-full bg-zinc-950 border border-zinc-800 text-white pl-9 pr-3 py-1.5 rounded-lg focus:outline-none text-xs"
          />
        </div>
      </div>

      {/* Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all shadow-xl space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-rose-400 font-semibold">
                  {item.provider}
                </span>
                <h3 className="text-base font-semibold text-white mt-0.5">{item.propertyName}</h3>
                <div className="text-xs text-zinc-400 font-mono mt-0.5">Policy #{item.policyNumber}</div>
              </div>

              <span
                className={`text-[10px] font-mono px-2.5 py-1 rounded-md font-semibold ${
                  item.status === 'Expiring Soon'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}
              >
                {item.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs">
              <div>
                <span className="text-[10px] text-zinc-500 font-mono uppercase">Asset Coverage</span>
                <div className="font-mono font-bold text-white text-sm mt-0.5">
                  {formatINR(item.coverage)}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-mono uppercase">Annual Premium</span>
                <div className="font-mono font-bold text-zinc-200 text-sm mt-0.5">
                  {formatINR(item.premium)}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-mono uppercase">Expiry Date</span>
                <div
                  className={`font-mono font-bold text-sm mt-0.5 ${
                    item.status === 'Expiring Soon' ? 'text-amber-400' : 'text-zinc-300'
                  }`}
                >
                  {formatDate(item.expiryDate)}
                </div>
              </div>
            </div>

            {item.status === 'Expiring Soon' && (
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Renewal countdown triggered (18 days remaining).</span>
                </span>
                <button className="px-2.5 py-1 rounded bg-amber-500 text-black font-semibold text-[11px] hover:bg-amber-400 transition-colors">
                  Renew
                </button>
              </div>
            )}

            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <FileText className="w-3.5 h-3.5 text-zinc-500" />
                {item.documentName}
              </span>
              <button
                onClick={() => onDeleteInsurance(item.id)}
                className="text-zinc-500 hover:text-rose-400 p-1"
                title="Remove Policy"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Policy Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsAddModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-[#0b0e14] border border-zinc-800 rounded-2xl shadow-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-semibold text-white">Bind New Insurance Policy</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Insured Property *</label>
                <select
                  value={form.propertyId}
                  onChange={(e) => setForm({ ...form, propertyId: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1">Underwriter / Provider</label>
                  <input
                    type="text"
                    required
                    value={form.provider}
                    onChange={(e) => setForm({ ...form, provider: e.target.value })}
                    placeholder="e.g. HDFC ERGO / Tata AIG"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Policy Number</label>
                  <input
                    type="text"
                    value={form.policyNumber}
                    onChange={(e) => setForm({ ...form, policyNumber: e.target.value })}
                    placeholder="e.g. BGR-99201"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1">Coverage Sum (₹)</label>
                  <input
                    type="number"
                    value={form.coverage}
                    onChange={(e) => setForm({ ...form, coverage: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Annual Premium (₹)</label>
                  <input
                    type="number"
                    value={form.premium}
                    onChange={(e) => setForm({ ...form, premium: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1">Inception Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold"
                >
                  Record Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
