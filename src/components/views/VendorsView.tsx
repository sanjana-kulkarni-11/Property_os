import React, { useState } from 'react';
import { Vendor, Property } from '../../types';
import { formatINR } from '../../utils/formatters';
import {
  Store,
  Plus,
  Trash2,
  Star,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Search,
  X,
  FileText,
} from 'lucide-react';

interface VendorsViewProps {
  vendors: Vendor[];
  properties: Property[];
  onCreateVendor: (vendor: Omit<Vendor, 'id'>) => void;
  onUpdateVendor: (id: string, updates: Partial<Vendor>) => void;
  onDeleteVendor: (id: string) => void;
}

export const VendorsView: React.FC<VendorsViewProps> = ({
  vendors,
  properties,
  onCreateVendor,
  onUpdateVendor,
  onDeleteVendor,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: '',
    category: 'HVAC & Refrigeration',
    phone: '',
    email: '',
    address: '',
    rating: 4.8,
    servicesText: 'Routine servicing, Emergency diagnostics',
    notes: 'Preferred contractor',
    jobsCompleted: 5,
    totalSpending: 75000,
    averageInvoice: 15000,
  });

  const filtered = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateVendor({
      name: form.name,
      category: form.category,
      phone: form.phone,
      email: form.email,
      address: form.address,
      rating: form.rating,
      services: form.servicesText.split(',').map((s) => s.trim()),
      notes: form.notes,
      jobsCompleted: form.jobsCompleted,
      totalSpending: form.totalSpending,
      averageInvoice: form.averageInvoice,
      propertiesServed: [properties[0]?.name || 'Bangalore Luxury Villa'],
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
              CONTRACTOR & VENDOR NETWORK
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            Vendors & Service Partners
          </h1>
          <p className="text-zinc-400 text-sm mt-0.5">
            Specialized engineering, solar technicians, luxury pool maintenance, and VIP security contractors.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950/60 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vendor</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vendor by trade, category, or business name..."
            className="w-full bg-zinc-950 border border-zinc-800 text-white pl-9 pr-3 py-1.5 rounded-lg focus:outline-none text-xs"
          />
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((vendor) => (
          <div
            key={vendor.id}
            className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all shadow-xl space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-rose-400 font-semibold">
                  {vendor.category}
                </span>
                <h3 className="text-base font-semibold text-white mt-0.5">{vendor.name}</h3>
                <div className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span>{vendor.address}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-amber-950/60 border border-amber-800/60 px-2 py-1 rounded-lg text-amber-300 font-mono text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{vendor.rating}</span>
              </div>
            </div>

            {/* Performance Matrix Matching Prompt Requirements */}
            <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs">
              <div>
                <span className="text-[10px] text-zinc-500 font-mono uppercase">Jobs Completed</span>
                <div className="font-mono font-bold text-white text-sm mt-0.5">
                  {vendor.jobsCompleted} jobs
                </div>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-mono uppercase">Total Spending</span>
                <div className="font-mono font-bold text-rose-400 text-sm mt-0.5">
                  {formatINR(vendor.totalSpending)}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-mono uppercase">Average Job</span>
                <div className="font-mono font-bold text-zinc-200 text-sm mt-0.5">
                  {formatINR(vendor.averageInvoice)}
                </div>
              </div>
            </div>

            {/* Services Tags */}
            <div>
              <span className="text-[10px] text-zinc-500 font-mono uppercase block mb-1.5">
                Specialized Services:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {vendor.services.map((srv, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-zinc-800/80 text-[11px] font-mono text-zinc-300 border border-zinc-700/60"
                  >
                    {srv}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800">
              "{vendor.notes}"
            </p>

            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-zinc-500" />
                  {vendor.phone}
                </span>
              </div>
              <button
                onClick={() => onDeleteVendor(vendor.id)}
                className="text-zinc-500 hover:text-rose-400 p-1"
                title="Remove vendor"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Vendor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsAddModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-[#0b0e14] border border-zinc-800 rounded-2xl shadow-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-semibold text-white">Register Vendor</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1">Company / Vendor Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. ABC AC Services"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Trade Category</label>
                  <input
                    type="text"
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g. HVAC, Solar, Plumbing"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Address / HQ</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="City, State"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Services (comma separated)</label>
                <input
                  type="text"
                  value={form.servicesText}
                  onChange={(e) => setForm({ ...form, servicesText: e.target.value })}
                  placeholder="e.g. AC Gas Refill, Annual Maintenance Contract, Filter cleaning"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                />
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
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
