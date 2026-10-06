import React, { useState } from 'react';
import { Tenant, Property } from '../../types';
import { formatINR, formatDate } from '../../utils/formatters';
import {
  KeyRound,
  Plus,
  Trash2,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  Wrench,
  Search,
} from 'lucide-react';

interface TenantsViewProps {
  tenants: Tenant[];
  properties: Property[];
  onCreateTenant: (tenant: Omit<Tenant, 'id'>) => void;
  onUpdateTenant: (id: string, updates: Partial<Tenant>) => void;
  onDeleteTenant: (id: string) => void;
  onRequestMaintenance: (propertyId: string, issue: string) => void;
}

export const TenantsView: React.FC<TenantsViewProps> = ({
  tenants,
  properties,
  onCreateTenant,
  onUpdateTenant,
  onDeleteTenant,
  onRequestMaintenance,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [tenantRequestModal, setTenantRequestModal] = useState<Tenant | null>(null);
  const [tenantIssueText, setTenantIssueText] = useState('');

  // Form state
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    propertyId: properties[1]?.id || '',
    unit: 'Unit 402',
    leaseStart: '2025-10-01',
    leaseEnd: '2027-09-30',
    monthlyRent: 85000,
    securityDeposit: 510000,
    paymentStatus: 'Paid' as const,
  });

  const filtered = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeTenantsCount = tenants.length;
  const vacantPropertiesCount = properties.filter((p) => p.status === 'Vacant').length;
  const totalMonthlyRentRoll = tenants.reduce((acc, t) => acc + t.monthlyRent, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find((p) => p.id === form.propertyId);
    if (!prop) return;

    onCreateTenant({
      ...form,
      propertyName: prop.name,
    });

    setIsAddModalOpen(false);
  };

  const handleSendTenantRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantRequestModal || !tenantIssueText) return;
    onRequestMaintenance(tenantRequestModal.propertyId, tenantIssueText);
    setTenantRequestModal(null);
    setTenantIssueText('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono tracking-widest uppercase text-rose-400 font-semibold">
              RESIDENTIAL & COMMERCIAL TENANCIES
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            Tenant & Lease Directory
          </h1>
          <p className="text-zinc-400 text-sm mt-0.5">
            Registered lease terms, lock-in agreements, automated rent collections, and tenant dispatch.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950/60 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Lease Agreement</span>
        </button>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-xs text-zinc-400">Active Tenants</span>
          <div className="text-2xl font-mono font-bold text-white mt-1">{activeTenantsCount} Leases</div>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-xs text-amber-400">Vacant Properties</span>
          <div className="text-2xl font-mono font-bold text-amber-400 mt-1">{vacantPropertiesCount} Estate</div>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-xs text-emerald-400">Monthly Rent Roll</span>
          <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">{formatINR(totalMonthlyRentRoll)}</div>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-xs text-rose-400">Expiring in &lt; 30 Days</span>
          <div className="text-2xl font-mono font-bold text-rose-400 mt-1">1 (Pune Suite)</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tenant by name, company, or estate..."
            className="w-full bg-zinc-950 border border-zinc-800 text-white pl-9 pr-3 py-1.5 rounded-lg focus:outline-none text-xs"
          />
        </div>
      </div>

      {/* Tenants Roster */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tenant) => (
          <div
            key={tenant.id}
            className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">{tenant.name}</h3>
                  <div className="text-xs text-zinc-400 mt-0.5">{tenant.unit}</div>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    tenant.paymentStatus === 'Paid'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}
                >
                  {tenant.paymentStatus}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-zinc-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Property:</span>
                  <span className="font-medium text-white truncate max-w-[170px]">{tenant.propertyName}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Monthly Rent:</span>
                  <span className="font-mono font-bold text-emerald-400">{formatINR(tenant.monthlyRent)}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Security Deposit:</span>
                  <span className="font-mono text-zinc-300">{formatINR(tenant.securityDeposit)}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Lease Window:</span>
                  <span className="font-mono text-zinc-300">{formatDate(tenant.leaseStart)} - {formatDate(tenant.leaseEnd)}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
              <button
                onClick={() => setTenantRequestModal(tenant)}
                className="text-xs text-rose-400 hover:text-white flex items-center gap-1 font-medium"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Simulate Maintenance Request</span>
              </button>
              <button
                onClick={() => onDeleteTenant(tenant.id)}
                className="text-zinc-500 hover:text-rose-400"
                title="Remove tenant"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tenant Maintenance Request Simulator Modal */}
      {tenantRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setTenantRequestModal(null)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-[#0b0e14] border border-zinc-800 rounded-2xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-white">Tenant Maintenance Portal</h3>
                <p className="text-xs text-zinc-400">Report issue for {tenantRequestModal.name} at {tenantRequestModal.propertyName}</p>
              </div>
              <button onClick={() => setTenantRequestModal(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendTenantRequest} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Issue Description</label>
                <textarea
                  required
                  rows={3}
                  value={tenantIssueText}
                  onChange={(e) => setTenantIssueText(e.target.value)}
                  placeholder="e.g. Master bathroom water pressure low or terrace light breaker tripped..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setTenantRequestModal(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold"
                >
                  Submit Work Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Tenant Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsAddModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-[#0b0e14] border border-zinc-800 rounded-2xl shadow-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-semibold text-white">Execute New Tenant Lease</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1">Tenant Name / Company *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Unit / Floor</label>
                  <input
                    type="text"
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1">Direct Phone</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Leased Property</label>
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
                  <label className="text-zinc-400 block mb-1">Monthly Rent (₹)</label>
                  <input
                    type="number"
                    value={form.monthlyRent}
                    onChange={(e) => setForm({ ...form, monthlyRent: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Security Deposit (₹)</label>
                  <input
                    type="number"
                    value={form.securityDeposit}
                    onChange={(e) => setForm({ ...form, securityDeposit: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1">Lease Start</label>
                  <input
                    type="date"
                    value={form.leaseStart}
                    onChange={(e) => setForm({ ...form, leaseStart: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Lease End</label>
                  <input
                    type="date"
                    value={form.leaseEnd}
                    onChange={(e) => setForm({ ...form, leaseEnd: e.target.value })}
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
                  Save Lease
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
