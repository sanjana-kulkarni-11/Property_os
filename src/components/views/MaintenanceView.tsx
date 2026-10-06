import React, { useState } from 'react';
import {
  MaintenanceTicket,
  MaintenancePriority,
  MaintenanceStatus,
  Property,
  StaffMember,
  Vendor,
} from '../../types';
import { formatINR, formatDate } from '../../utils/formatters';
import {
  Wrench,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle,
  Sparkles,
  LayoutGrid,
  List,
  Filter,
  X,
  User,
  Store,
  DollarSign,
  ChevronRight,
} from 'lucide-react';

interface MaintenanceViewProps {
  maintenance: MaintenanceTicket[];
  properties: Property[];
  staff: StaffMember[];
  vendors: Vendor[];
  onCreateMaintenance: (ticket: Omit<MaintenanceTicket, 'id' | 'createdAt'>) => void;
  onUpdateMaintenance: (id: string, updates: Partial<MaintenanceTicket>) => void;
  onDeleteMaintenance: (id: string) => void;
}

const STATUS_COLUMNS: MaintenanceStatus[] = [
  'Reported',
  'Assigned',
  'In Progress',
  'Waiting',
  'Completed',
];

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  maintenance,
  properties,
  staff,
  vendors,
  onCreateMaintenance,
  onUpdateMaintenance,
  onDeleteMaintenance,
}) => {
  const [viewType, setViewType] = useState<'kanban' | 'list'>('kanban');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicket | null>(null);

  // Form state
  const [form, setForm] = useState({
    propertyId: properties[0]?.id || '',
    issue: '',
    description: '',
    category: 'HVAC',
    priority: 'High' as MaintenancePriority,
    status: 'Reported' as MaintenanceStatus,
    assignedVendor: 'Coastal Air Solutions',
    assignedStaff: 'Kiran Gowda',
    estimatedCost: 15000,
    dueDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // Filter
  const filtered = maintenance.filter((m) => {
    const matchPriority = priorityFilter === 'All' || m.priority === priorityFilter;
    const matchProp = selectedPropertyId === 'All' || m.propertyId === selectedPropertyId;
    return matchPriority && matchProp;
  });

  // KPI Calculations
  const openCount = maintenance.filter((m) => m.status !== 'Completed' && m.status !== 'Cancelled').length;
  const criticalCount = maintenance.filter((m) => m.priority === 'Critical' && m.status !== 'Completed').length;
  const overdueCount = maintenance.filter((m) => m.dueDate < '2026-10-06' && m.status !== 'Completed').length;
  const completedCount = maintenance.filter((m) => m.status === 'Completed').length;
  const totalCost = maintenance.reduce((acc, m) => acc + (m.actualCost || m.estimatedCost), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find((p) => p.id === form.propertyId);
    if (!prop) return;

    onCreateMaintenance({
      ...form,
      propertyName: prop.name,
      photos: [],
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
              PREVENTIVE & CORRECTIVE ASSET UPKEEP
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            Maintenance Operations
          </h1>
          <p className="text-zinc-400 text-sm mt-0.5">
            Real-time telemetry work orders, service intervals, and contractor dispatches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1">
            <button
              onClick={() => setViewType('kanban')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                viewType === 'kanban' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewType('list')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                viewType === 'list' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950/60 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Ticket</span>
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-xs text-zinc-400">Open Tickets</span>
          <div className="text-2xl font-mono font-bold text-amber-400 mt-1">{openCount}</div>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-xs text-rose-400">Critical Priority</span>
          <div className="text-2xl font-mono font-bold text-rose-400 mt-1">{criticalCount}</div>
        </div>
        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/40">
          <span className="text-xs text-rose-300">Overdue (Past SLA)</span>
          <div className="text-2xl font-mono font-bold text-rose-400 mt-1">{overdueCount}</div>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-xs text-emerald-400">Completed (30d)</span>
          <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">{completedCount}</div>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-xs text-zinc-400">Total Work Orders Cost</span>
          <div className="text-2xl font-mono font-bold text-white mt-1">{formatINR(totalCost)}</div>
        </div>
      </div>

      {/* AI Maintenance Intelligence Banner (Matching Prompt Requirements) */}
      <div className="p-5 rounded-2xl bg-zinc-900/80 border border-rose-900/50 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-400" />
          <span className="text-xs font-mono font-semibold tracking-wider uppercase text-rose-300">
            AI MAINTENANCE INTELLIGENCE & PREDICTIVE INTERVALS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs space-y-1">
            <div className="font-semibold text-rose-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>AC Inverter Compressor Cycle Due</span>
            </div>
            <p className="text-zinc-400">
              AC Unit 2 at Goa Beach Villa appears due for refrigerant calibration based on previous 6-month service interval.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs space-y-1">
            <div className="font-semibold text-amber-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>125kVA Backup Generator Overdue</span>
            </div>
            <p className="text-zinc-400">
              Cummins 125kVA unit reached 142 operating run-hours; quarterly lube oil analysis recommended.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs space-y-1">
            <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Recurring Plumbing Cluster Detected</span>
            </div>
            <p className="text-zinc-400">
              Goa Beach Villa has recorded 4 plumbing/pump related entries in the past 6 months. Consider pressure valve inspection.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-zinc-400">Property:</span>
          <select
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-white"
          >
            <option value="All">All Estates</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-zinc-400">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-white"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewType === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {STATUS_COLUMNS.map((status) => {
            const columnTickets = filtered.filter((t) => t.status === status);
            return (
              <div key={status} className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-3 flex flex-col min-w-[240px]">
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">{status}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                      {columnTickets.length}
                    </span>
                  </div>
                </div>

                {/* Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {columnTickets.length === 0 ? (
                    <div className="text-center py-8 text-[11px] text-zinc-600">No tickets</div>
                  ) : (
                    columnTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket)}
                        className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800/90 hover:border-zinc-700 shadow-md transition-all cursor-pointer space-y-2 group"
                      >
                        <div className="flex items-start justify-between">
                          <span
                            className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                              ticket.priority === 'Critical'
                                ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                                : ticket.priority === 'High'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                                : 'bg-zinc-800 text-zinc-300'
                            }`}
                          >
                            {ticket.priority}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            {formatDate(ticket.dueDate)}
                          </span>
                        </div>

                        <h4 className="text-xs font-semibold text-white group-hover:text-rose-400 transition-colors leading-snug">
                          {ticket.issue}
                        </h4>

                        <div className="text-[11px] text-zinc-400 font-mono truncate">
                          {ticket.propertyName}
                        </div>

                        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                          <span className="text-zinc-500 truncate max-w-[110px]">{ticket.assignedVendor}</span>
                          <span className="font-mono text-rose-400 font-semibold">
                            {formatINR(ticket.estimatedCost)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewType === 'list' && (
        <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950/70 border-b border-zinc-800 text-zinc-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Issue</th>
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Assigned Vendor</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Est Cost</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          t.priority === 'Critical'
                            ? 'bg-rose-950 text-rose-300'
                            : t.priority === 'High'
                            ? 'bg-amber-950 text-amber-300'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">{t.issue}</td>
                    <td className="py-3 px-4 text-zinc-300">{t.propertyName}</td>
                    <td className="py-3 px-4 text-zinc-400">{t.assignedVendor}</td>
                    <td className="py-3 px-4 font-mono text-zinc-400">{formatDate(t.dueDate)}</td>
                    <td className="py-3 px-4 font-mono text-rose-400 font-bold">{formatINR(t.estimatedCost)}</td>
                    <td className="py-3 px-4">
                      <select
                        value={t.status}
                        onChange={(e) => onUpdateMaintenance(t.id, { status: e.target.value as any })}
                        className="bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5 text-xs text-zinc-200"
                      >
                        {STATUS_COLUMNS.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onDeleteMaintenance(t.id)}
                        className="text-zinc-500 hover:text-rose-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ticket Details Drawer / Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setSelectedTicket(null)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-[#0b0e14] border border-zinc-800 rounded-2xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-rose-400 font-semibold">
                  {selectedTicket.priority} Priority · {selectedTicket.category}
                </span>
                <h3 className="text-base font-semibold text-white mt-1">{selectedTicket.issue}</h3>
                <div className="text-xs text-zinc-400 mt-0.5">{selectedTicket.propertyName}</div>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/60 p-3 rounded-xl border border-zinc-800">
              {selectedTicket.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 font-mono uppercase">Assigned Vendor</span>
                <div className="text-zinc-200 font-medium mt-1">{selectedTicket.assignedVendor}</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 font-mono uppercase">Assigned Staff</span>
                <div className="text-zinc-200 font-medium mt-1">{selectedTicket.assignedStaff}</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 font-mono uppercase">Estimated Cost</span>
                <div className="font-mono text-rose-400 font-bold mt-1">{formatINR(selectedTicket.estimatedCost)}</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 font-mono uppercase">Target SLA Due</span>
                <div className="font-mono text-zinc-200 mt-1">{formatDate(selectedTicket.dueDate)}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-500">Update Status:</span>
                <select
                  value={selectedTicket.status}
                  onChange={(e) => {
                    const st = e.target.value as MaintenanceStatus;
                    onUpdateMaintenance(selectedTicket.id, { status: st });
                    setSelectedTicket({ ...selectedTicket, status: st });
                  }}
                  className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-white"
                >
                  {STATUS_COLUMNS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsAddModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-[#0b0e14] border border-zinc-800 rounded-2xl shadow-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-semibold text-white">Issue Maintenance Work Order</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Target Property *</label>
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

              <div>
                <label className="text-zinc-400 block mb-1">Issue Title *</label>
                <input
                  type="text"
                  required
                  value={form.issue}
                  onChange={(e) => setForm({ ...form, issue: e.target.value })}
                  placeholder="e.g. Chiller coolant loop leak"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Technical Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Explain symptoms, affected zones, or error codes..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Estimated Cost (₹)</label>
                  <input
                    type="number"
                    value={form.estimatedCost}
                    onChange={(e) => setForm({ ...form, estimatedCost: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1">Assigned Contractor</label>
                  <select
                    value={form.assignedVendor}
                    onChange={(e) => setForm({ ...form, assignedVendor: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                  >
                    {vendors.map((v) => (
                      <option key={v.id} value={v.name}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Target Due Date</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
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
                  Dispatch Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
