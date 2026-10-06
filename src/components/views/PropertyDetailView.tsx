import React, { useState } from 'react';
import {
  Property,
  Expense,
  MaintenanceTicket,
  DocumentRecord,
  StaffMember,
  Tenant,
  Vendor,
  InsurancePolicy,
} from '../../types';
import { formatINR, formatDate } from '../../utils/formatters';
import { Property3DViewer } from '../3d/Property3DViewer';
import {
  ArrowLeft,
  Building,
  TrendingUp,
  Receipt,
  Wrench,
  FileText,
  Users,
  KeyRound,
  Store,
  ShieldCheck,
  Activity,
  Layers,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle,
  Plus,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';

interface PropertyDetailViewProps {
  property: Property;
  onBack: () => void;
  expenses: Expense[];
  maintenance: MaintenanceTicket[];
  documents: DocumentRecord[];
  staff: StaffMember[];
  tenants: Tenant[];
  vendors: Vendor[];
  insurance: InsurancePolicy[];
  onAddExpenseForProperty: (propertyId: string) => void;
  onAddMaintenanceForProperty: (propertyId: string) => void;
}

type PropertyTab =
  | 'overview'
  | 'financials'
  | 'maintenance'
  | 'documents'
  | 'staff'
  | 'tenants'
  | 'vendors'
  | 'insurance'
  | 'activity';

export const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({
  property,
  onBack,
  expenses,
  maintenance,
  documents,
  staff,
  tenants,
  vendors,
  insurance,
  onAddExpenseForProperty,
  onAddMaintenanceForProperty,
}) => {
  const [activeTab, setActiveTab] = useState<PropertyTab>('overview');
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);

  // Filter records tied to this property
  const propExpenses = expenses.filter((e) => e.propertyId === property.id);
  const propMaintenance = maintenance.filter((m) => m.propertyId === property.id);
  const propDocuments = documents.filter((d) => d.propertyId === property.id);
  const propStaff = staff.filter((s) => s.propertyId === property.id);
  const propTenants = tenants.filter((t) => t.propertyId === property.id);
  const propInsurance = insurance.filter((i) => i.propertyId === property.id);

  // Financial calculations
  const totalRecordedExpenses = propExpenses.reduce((acc, e) => acc + e.amount, 0);
  const netIncome = property.monthlyIncome - property.monthlyExpenses;
  const appreciation = property.currentValue - property.purchasePrice;
  const appreciationPercent = Number(((appreciation / property.purchasePrice) * 100).toFixed(1));

  // Expense breakdown by category
  const expenseBreakdown = propExpenses.reduce((acc: any[], curr) => {
    const existing = acc.find((item) => item.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []);

  const COLORS = ['#e11d48', '#06b6d4', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];

  const tabs = [
    { id: 'overview' as PropertyTab, label: 'Overview', icon: Building },
    { id: 'financials' as PropertyTab, label: 'Financials', icon: TrendingUp },
    { id: 'maintenance' as PropertyTab, label: 'Maintenance', icon: Wrench, count: propMaintenance.length },
    { id: 'documents' as PropertyTab, label: 'Documents', icon: FileText, count: propDocuments.length },
    { id: 'staff' as PropertyTab, label: 'Staff', icon: Users, count: propStaff.length },
    { id: 'tenants' as PropertyTab, label: 'Tenants', icon: KeyRound, count: propTenants.length },
    { id: 'vendors' as PropertyTab, label: 'Vendors', icon: Store },
    { id: 'insurance' as PropertyTab, label: 'Insurance', icon: ShieldCheck, count: propInsurance.length },
    { id: 'activity' as PropertyTab, label: 'Activity', icon: Activity },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-rose-400" />
          <span>Back to Portfolio</span>
        </button>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-zinc-500">ID:</span>
          <span className="text-zinc-300 font-semibold">{property.id}</span>
        </div>
      </div>

      {/* Hero Header Banner */}
      <div className="p-6 rounded-2xl bg-[#090b10] border border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded font-semibold ${
                  property.status === 'Rented'
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                    : property.status === 'Owner Occupied'
                    ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60'
                    : 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                }`}
              >
                {property.status}
              </span>
              <span className="text-[10px] font-mono uppercase text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded">
                {property.type}
              </span>
              <span className="text-xs text-zinc-500">·</span>
              <span className="text-xs text-zinc-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                {property.city}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              {property.name}
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">{property.address}</p>
          </div>

          {/* Quick Valuation Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t lg:border-t-0 lg:border-l border-zinc-800 lg:pl-8 pt-4 lg:pt-0">
            <div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Valuation</div>
              <div className="text-xl font-mono font-bold text-white mt-0.5">
                {formatINR(property.currentValue)}
              </div>
              <div className="text-[10px] font-mono text-emerald-400">+{appreciationPercent}% Appreciation</div>
            </div>

            <div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Monthly Income</div>
              <div className="text-xl font-mono font-bold text-emerald-400 mt-0.5">
                {formatINR(property.monthlyIncome)}
              </div>
              <div className="text-[10px] font-mono text-zinc-400">Net: {formatINR(netIncome)}/mo</div>
            </div>

            <div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Annual ROI</div>
              <div className="text-xl font-mono font-bold text-rose-400 mt-0.5">
                {property.roi}%
              </div>
              <div className="text-[10px] font-mono text-zinc-400">Occupancy: {property.occupancyRate}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-1 border-b border-zinc-800 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                isActive
                  ? 'bg-zinc-800 text-white font-semibold border border-zinc-700 shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-400' : 'text-zinc-500'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENTS */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 3D Digital Twin Viewer for this Property */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold tracking-wider text-rose-400 uppercase">
                3D SPATIAL DIGITAL TWIN
              </span>
              <span className="text-xs text-zinc-500 font-mono">Real-time Model</span>
            </div>
            <Property3DViewer property={property} height="420px" showOverlayStats={false} />
          </div>

          {/* Specifications Matrix & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
              <h3 className="text-sm font-semibold text-white">Estate Architecture & Specifications</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase">Built Area</span>
                  <div className="text-sm font-mono font-bold text-white mt-1">
                    {property.specs.areaSqFt.toLocaleString()} sq.ft
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase">Bedrooms / Baths</span>
                  <div className="text-sm font-mono font-bold text-white mt-1">
                    {property.specs.bedrooms} Bed · {property.specs.bathrooms} Bath
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase">Covered Parking</span>
                  <div className="text-sm font-mono font-bold text-white mt-1">
                    {property.specs.parkingSpaces} Bays
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase">Energy Rating</span>
                  <div className="text-sm font-mono font-bold text-rose-400 mt-1">
                    {property.specs.energyRating}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-zinc-300 mb-2">Executive Notes</h4>
                <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-950/40 p-3 rounded-xl border border-zinc-800">
                  {property.notes}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-zinc-300 mb-2">Key Estate Features</h4>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((f, i) => (
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

            {/* Gallery Previews */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
              <h3 className="text-sm font-semibold text-white">High-Resolution Gallery</h3>
              <div className="rounded-xl overflow-hidden h-44 bg-zinc-950 border border-zinc-800">
                <img
                  src={property.gallery[activeGalleryIndex] || property.image}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {property.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveGalleryIndex(i)}
                    className={`h-14 rounded-lg overflow-hidden border transition-all ${
                      activeGalleryIndex === i ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-zinc-800 opacity-60'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. FINANCIALS TAB */}
      {activeTab === 'financials' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Purchase Price</span>
              <div className="text-lg font-mono font-bold text-white mt-1">
                {formatINR(property.purchasePrice)}
              </div>
              <div className="text-[10px] text-zinc-400 font-mono mt-0.5">Date: {formatDate(property.purchaseDate)}</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Current Estimated Valuation</span>
              <div className="text-lg font-mono font-bold text-rose-400 mt-1">
                {formatINR(property.currentValue)}
              </div>
              <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Gain: {formatINR(appreciation)}</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Monthly Rental Income</span>
              <div className="text-lg font-mono font-bold text-emerald-400 mt-1">
                {formatINR(property.monthlyIncome)}
              </div>
              <div className="text-[10px] text-zinc-400 font-mono mt-0.5">Annual: {formatINR(property.monthlyIncome * 12)}</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Net Monthly Cashflow</span>
              <div className="text-lg font-mono font-bold text-white mt-1">
                {formatINR(netIncome)}
              </div>
              <div className="text-[10px] text-zinc-400 font-mono mt-0.5">After all holding overhead</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Expense Breakdown Pie Chart */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <h4 className="text-sm font-semibold text-white mb-2">Category Breakdown of Spending</h4>
              <p className="text-xs text-zinc-400 mb-4">Calculated from verified expense invoices</p>
              {expenseBreakdown.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseBreakdown}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {expenseBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#090b10', borderColor: '#27272a', borderRadius: '8px' }}
                        formatter={(val: any) => [formatINR(val), 'Spent']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-12 text-zinc-500 text-xs">No expense ledgers logged for this estate yet.</div>
              )}
            </div>

            {/* List of Recent Expenses */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-white">Recent Expense Records</h4>
                  <button
                    onClick={() => onAddExpenseForProperty(property.id)}
                    className="text-xs text-rose-400 hover:text-white flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Expense</span>
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {propExpenses.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-zinc-200">{exp.category}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">{formatDate(exp.date)} · {exp.vendor}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-white">{formatINR(exp.amount)}</div>
                        <div className="text-[10px] text-zinc-500">{exp.paymentMethod}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAINTENANCE TAB */}
      {activeTab === 'maintenance' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Maintenance Tickets ({propMaintenance.length})</h3>
              <p className="text-xs text-zinc-400">Open service requests, HVAC diagnostics, and scheduled inspections</p>
            </div>
            <button
              onClick={() => onAddMaintenanceForProperty(property.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Ticket</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {propMaintenance.map((m) => (
              <div key={m.id} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                        m.priority === 'Critical'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : m.priority === 'High'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {m.priority} Priority
                    </span>
                    <h4 className="text-sm font-semibold text-white mt-1.5">{m.issue}</h4>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                    {m.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{m.description}</p>
                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>Vendor: {m.assignedVendor}</span>
                  <span className="text-rose-400">Est: {formatINR(m.estimatedCost)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. DOCUMENTS TAB */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white">Vault Documents ({propDocuments.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {propDocuments.map((doc) => (
              <div key={doc.id} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-rose-400 font-semibold">{doc.category}</span>
                  <span className="text-[10px] font-mono text-zinc-500">{doc.fileSize}</span>
                </div>
                <h4 className="text-xs font-semibold text-white">{doc.name}</h4>
                <p className="text-[11px] text-zinc-400 line-clamp-2">{doc.description}</p>
                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span>{formatDate(doc.uploadDate)}</span>
                  <span className="text-emerald-400">Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. STAFF TAB */}
      {activeTab === 'staff' && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white">Assigned Personnel & Staff ({propStaff.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {propStaff.map((s) => (
              <div key={s.id} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-3">
                <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-zinc-700" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-white">{s.name}</h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300">
                      {s.attendanceToday}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400">{s.role} · {s.phone}</div>
                  <div className="text-[10px] font-mono text-zinc-500 mt-1">Salary: {formatINR(s.salary)}/mo</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TENANTS TAB */}
      {activeTab === 'tenants' && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white">Lease Agreements & Tenants ({propTenants.length})</h3>
          {propTenants.length === 0 ? (
            <div className="p-6 rounded-xl bg-zinc-900/30 border border-zinc-800 text-center text-xs text-zinc-500">
              No active tenant leases on this property (Owner Occupied or Vacant).
            </div>
          ) : (
            propTenants.map((t) => (
              <div key={t.id} className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white">{t.name}</h4>
                  <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                    Rent Status: {t.paymentStatus}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-mono uppercase">Unit</span>
                    <div className="font-medium text-zinc-200 mt-0.5">{t.unit}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-mono uppercase">Monthly Rent</span>
                    <div className="font-mono font-bold text-white mt-0.5">{formatINR(t.monthlyRent)}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-mono uppercase">Security Deposit</span>
                    <div className="font-mono text-zinc-300 mt-0.5">{formatINR(t.securityDeposit)}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-mono uppercase">Lease Term</span>
                    <div className="font-mono text-zinc-300 mt-0.5">{formatDate(t.leaseStart)} - {formatDate(t.leaseEnd)}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 7. VENDORS TAB */}
      {activeTab === 'vendors' && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white">Contractors & Specialized Vendors</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {vendors.filter((v) => v.propertiesServed.includes(property.name)).map((v) => (
              <div key={v.id} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-white">{v.name}</h4>
                  <span className="text-xs font-mono text-amber-400">★ {v.rating}</span>
                </div>
                <p className="text-[11px] text-zinc-400">{v.category} · {v.phone}</p>
                <div className="pt-2 border-t border-zinc-800 text-[10px] font-mono text-zinc-500 flex justify-between">
                  <span>{v.jobsCompleted} Completed Jobs</span>
                  <span className="text-zinc-300">Total Spent: {formatINR(v.totalSpending)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. INSURANCE TAB */}
      {activeTab === 'insurance' && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white">Active Insurance Policies</h3>
          {propInsurance.map((ins) => (
            <div key={ins.id} className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-rose-400 font-semibold">{ins.provider}</span>
                  <h4 className="text-sm font-semibold text-white mt-0.5">Policy #{ins.policyNumber}</h4>
                </div>
                <span
                  className={`text-xs font-mono px-2 py-0.5 rounded font-semibold ${
                    ins.status === 'Expiring Soon'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {ins.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs pt-2 border-t border-zinc-800/80">
                <div>
                  <span className="text-[10px] text-zinc-500 font-mono uppercase">Asset Coverage</span>
                  <div className="font-mono font-bold text-white mt-0.5">{formatINR(ins.coverage)}</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-mono uppercase">Annual Premium</span>
                  <div className="font-mono text-zinc-300 mt-0.5">{formatINR(ins.premium)}</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-mono uppercase">Renewal Deadline</span>
                  <div className="font-mono text-rose-400 font-bold mt-0.5">{formatDate(ins.expiryDate)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 9. ACTIVITY TAB */}
      {activeTab === 'activity' && (
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <h3 className="text-sm font-semibold text-white">Audit Log & Event History</h3>
          <div className="space-y-3 border-l-2 border-zinc-800 pl-4 text-xs">
            <div className="relative">
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute -left-[21px] top-1" />
              <div className="font-mono text-[10px] text-zinc-500">2 hours ago</div>
              <div className="text-zinc-200 font-medium">IoT telemetry scan completed without packet loss</div>
            </div>
            <div className="relative">
              <span className="w-2 h-2 rounded-full bg-amber-500 absolute -left-[21px] top-1" />
              <div className="font-mono text-[10px] text-zinc-500">Yesterday</div>
              <div className="text-zinc-200 font-medium">Insurance policy renewal countdown initiated (18 days remaining)</div>
            </div>
            <div className="relative">
              <span className="w-2 h-2 rounded-full bg-cyan-500 absolute -left-[21px] top-1" />
              <div className="font-mono text-[10px] text-zinc-500">3 days ago</div>
              <div className="text-zinc-200 font-medium">Maintenance ticket created: Filtration Pump Overheating</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
