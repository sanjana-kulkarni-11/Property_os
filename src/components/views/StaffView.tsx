import React, { useState } from 'react';
import { StaffMember, StaffRole, Property } from '../../types';
import { formatINR, formatDate } from '../../utils/formatters';
import {
  Users,
  Plus,
  Trash2,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  X,
  AlertCircle,
  Building,
} from 'lucide-react';

interface StaffViewProps {
  staff: StaffMember[];
  properties: Property[];
  onCreateStaff: (member: Omit<StaffMember, 'id'>) => void;
  onUpdateStaff: (id: string, updates: Partial<StaffMember>) => void;
  onDeleteStaff: (id: string) => void;
}

const ROLES: StaffRole[] = [
  'Property Manager',
  'Caretaker',
  'Security',
  'Driver',
  'Cook',
  'Gardener',
  'Cleaner',
  'Other',
];

export const StaffView: React.FC<StaffViewProps> = ({
  staff,
  properties,
  onCreateStaff,
  onUpdateStaff,
  onDeleteStaff,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: '',
    role: 'Caretaker' as StaffRole,
    phone: '',
    propertyId: properties[0]?.id || '',
    salary: 30000,
    joiningDate: new Date().toISOString().split('T')[0],
    emergencyContact: '',
    attendanceToday: 'Present' as const,
    attendanceRate: 95,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    status: 'Active' as const,
  });

  const filtered = staff.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm);
    const matchRole = roleFilter === 'All' || s.role === roleFilter;
    return matchSearch && matchRole;
  });

  // Payroll & Attendance metrics
  const totalPayroll = staff.reduce((acc, s) => acc + s.salary, 0);
  const presentToday = staff.filter((s) => s.attendanceToday === 'Present').length;
  const onLeaveToday = staff.filter((s) => s.attendanceToday === 'Leave').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find((p) => p.id === form.propertyId);
    if (!prop) return;

    onCreateStaff({
      ...form,
      propertyName: prop.name,
    });

    setIsAddModalOpen(false);
  };

  const handleToggleAttendance = (member: StaffMember) => {
    const nextStatus =
      member.attendanceToday === 'Present'
        ? 'Leave'
        : member.attendanceToday === 'Leave'
        ? 'Absent'
        : 'Present';
    onUpdateStaff(member.id, { attendanceToday: nextStatus });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono tracking-widest uppercase text-rose-400 font-semibold">
              ESTATE PERSONNEL & PAYROLL
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            Staff Management
          </h1>
          <p className="text-zinc-400 text-sm mt-0.5">
            Caretakers, executive drivers, security personnel, and daily shift attendance.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950/60 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-xs text-zinc-400">Total Estate Staff</span>
          <div className="text-2xl font-mono font-bold text-white mt-1">{staff.length} Active</div>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-xs text-emerald-400">Present Today</span>
          <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">{presentToday} on Duty</div>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-xs text-amber-400">On Leave Today</span>
          <div className="text-2xl font-mono font-bold text-amber-400 mt-1">{onLeaveToday} Approved</div>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-xs text-zinc-400">Monthly Payroll Commitment</span>
          <div className="text-2xl font-mono font-bold text-white mt-1">{formatINR(totalPayroll)}</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, property, or phone..."
            className="w-full bg-zinc-950 border border-zinc-800 text-white pl-9 pr-3 py-1.5 rounded-lg focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-zinc-500">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white"
          >
            <option value="All">All Roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Staff Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((member) => (
          <div
            key={member.id}
            className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-zinc-700"
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-white">{member.name}</h3>
                    <span className="text-[10px] font-mono uppercase text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40">
                      {member.role}
                    </span>
                  </div>
                </div>

                {/* Clickable Attendance Badge */}
                <button
                  onClick={() => handleToggleAttendance(member)}
                  title="Click to toggle attendance status"
                  className={`text-[10px] font-mono px-2 py-1 rounded-lg border font-semibold transition-transform active:scale-95 ${
                    member.attendanceToday === 'Present'
                      ? 'bg-emerald-950/90 text-emerald-300 border-emerald-800/60'
                      : member.attendanceToday === 'Leave'
                      ? 'bg-amber-950/90 text-amber-300 border-amber-800/60'
                      : 'bg-rose-950/90 text-rose-300 border-rose-800/60'
                  }`}
                >
                  {member.attendanceToday}
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Assigned Estate:</span>
                  <span className="font-medium text-white truncate max-w-[160px]">
                    {member.propertyName}
                  </span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Direct Phone:</span>
                  <span className="font-mono text-zinc-200">{member.phone}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Monthly Salary:</span>
                  <span className="font-mono text-white font-bold">{formatINR(member.salary)}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Attendance Rate:</span>
                  <span className="font-mono text-emerald-400">{member.attendanceRate}%</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>Emergency: {member.emergencyContact.split(' ')[0]}</span>
              <button
                onClick={() => onDeleteStaff(member.id)}
                className="text-zinc-500 hover:text-rose-400 transition-colors"
                title="Remove staff record"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsAddModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-[#0b0e14] border border-zinc-800 rounded-2xl shadow-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-semibold text-white">Enroll Estate Staff</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Monthly Salary (₹)</label>
                  <input
                    type="number"
                    value={form.salary}
                    onChange={(e) => setForm({ ...form, salary: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Assign to Property</label>
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
                <label className="text-zinc-400 block mb-1">Emergency Contact</label>
                <input
                  type="text"
                  value={form.emergencyContact}
                  onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
                  placeholder="+91 99... (Relation)"
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
