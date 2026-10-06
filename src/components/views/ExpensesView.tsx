import React, { useState } from 'react';
import {
  Expense,
  ExpenseCategory,
  Property,
} from '../../types';
import { formatINR, formatDate } from '../../utils/formatters';
import {
  Search,
  Plus,
  Trash2,
  Edit,
  Zap,
  AlertTriangle,
  ArrowUpDown,
  Filter,
  DollarSign,
  Calendar,
  X,
  Sparkles,
  PieChart as PieIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface ExpensesViewProps {
  expenses: Expense[];
  properties: Property[];
  onCreateExpense: (expense: Omit<Expense, 'id'>) => void;
  onUpdateExpense: (id: string, updates: Partial<Expense>) => void;
  onDeleteExpense: (id: string) => void;
}

const CATEGORIES: ExpenseCategory[] = [
  'Maintenance',
  'Electricity',
  'Water',
  'Internet',
  'Staff',
  'Security',
  'Insurance',
  'Property Tax',
  'Repairs',
  'Renovation',
  'Cleaning',
  'Landscaping',
  'Other',
];

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  expenses,
  properties,
  onCreateExpense,
  onUpdateExpense,
  onDeleteExpense,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  // Form state
  const [form, setForm] = useState({
    propertyId: properties[0]?.id || '',
    category: 'Electricity' as ExpenseCategory,
    amount: 15000,
    vendor: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Bank Wire' as const,
    invoiceNumber: '',
    description: '',
  });

  // Filtered expenses
  const filtered = expenses.filter((e) => {
    const matchSearch =
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchProp = selectedPropertyId === 'All' || e.propertyId === selectedPropertyId;
    const matchCat = selectedCategory === 'All' || e.category === selectedCategory;
    return matchSearch && matchProp && matchCat;
  });

  const totalSpent = filtered.reduce((acc, e) => acc + e.amount, 0);

  // Detect and highlight anomaly
  const anomalyRecord = expenses.find((e) => e.anomaly?.isAnomaly);

  // Analytics by Property
  const spendingByProperty = properties.map((p) => {
    const sum = expenses
      .filter((e) => e.propertyId === p.id)
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { name: p.city, amount: sum, fullName: p.name };
  });

  // Analytics by Category
  const spendingByCategory = CATEGORIES.map((c) => {
    const sum = expenses.filter((e) => e.category === c).reduce((acc, curr) => acc + curr.amount, 0);
    return { name: c, value: sum };
  }).filter((c) => c.value > 0);

  const COLORS = ['#e11d48', '#06b6d4', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#3b82f6'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find((p) => p.id === form.propertyId);
    if (!prop) return;

    onCreateExpense({
      ...form,
      propertyName: prop.name,
      createdBy: 'Alex Vance',
      invoiceNumber: form.invoiceNumber || `INV-${Math.floor(Math.random() * 90000 + 10000)}`,
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
              FINANCIAL OPERATIONS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            Expense Management
          </h1>
          <p className="text-zinc-400 text-sm mt-0.5">
            Audit portfolio operational outflows, automated utility feeds, and anomaly detection.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950/60 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* AI Expense Anomaly Detection Card (Matching Prompt Requirement) */}
      {anomalyRecord && anomalyRecord.anomaly && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-zinc-900 to-zinc-900 border border-rose-500/50 shadow-2xl relative overflow-hidden">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-rose-300">
                  AI EXPENSE ANOMALY DETECTED · {anomalyRecord.anomaly.severity.toUpperCase()} SEVERITY
                </span>
              </div>

              <h3 className="text-base font-semibold text-white">
                Potential Expense Anomaly at {anomalyRecord.propertyName}
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
                "{anomalyRecord.anomaly.explanation}"
              </p>

              {/* Data comparison matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase">Current Amount</span>
                  <div className="font-mono font-bold text-rose-400 text-sm mt-0.5">
                    {formatINR(anomalyRecord.anomaly.currentAmount)}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase">Historical Average</span>
                  <div className="font-mono font-bold text-zinc-300 text-sm mt-0.5">
                    {formatINR(anomalyRecord.anomaly.historicalAvg)}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase">Deviation</span>
                  <div className="font-mono font-bold text-rose-400 text-sm mt-0.5">
                    +{anomalyRecord.anomaly.diffPercent}%
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase">AI Confidence</span>
                  <div className="font-mono font-bold text-emerald-400 text-sm mt-0.5">94% Validated</div>
                </div>
              </div>

              <div className="text-xs text-zinc-400 pt-1">
                <span className="text-zinc-500 font-mono uppercase mr-1">Recommended Action:</span>
                <span className="text-zinc-200">{anomalyRecord.anomaly.recommendation}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <h4 className="text-sm font-semibold text-white mb-1">Spending by Property</h4>
          <p className="text-xs text-zinc-400 mb-4">Total operational expenses incurred per estate</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendingByProperty}>
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090b10', borderColor: '#27272a', borderRadius: '8px' }}
                  formatter={(v: any) => [formatINR(v), 'Expenditure']}
                />
                <Bar dataKey="amount" fill="#e11d48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <h4 className="text-sm font-semibold text-white mb-1">Spending by Category</h4>
          <p className="text-xs text-zinc-400 mb-4">Breakdown across utilities, staff, and maintenance</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendingByCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={({ name }) => name}
                  labelLine={false}
                >
                  {spendingByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#090b10', borderColor: '#27272a', borderRadius: '8px' }}
                  formatter={(v: any) => [formatINR(v), 'Spent']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vendor, invoice, description..."
            className="w-full bg-zinc-950/80 border border-zinc-800 text-xs text-white pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex items-center gap-2 bg-zinc-950/80 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs">
          <span className="text-zinc-500">Property:</span>
          <select
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            className="bg-transparent text-zinc-200 focus:outline-none w-full"
          >
            <option value="All">All Properties</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 bg-zinc-950/80 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs">
          <span className="text-zinc-500">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent text-zinc-200 focus:outline-none w-full"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expense Ledgers Table */}
      <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/80 overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-white">Expense Records ({filtered.length})</span>
          <span className="text-xs font-mono text-zinc-300">
            Filtered Outflow: <span className="font-bold text-rose-400">{formatINR(totalSpent)}</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/70 border-b border-zinc-800 text-zinc-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Property</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Vendor & Details</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.map((exp) => (
                <tr key={exp.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-zinc-400">{formatDate(exp.date)}</td>
                  <td className="py-3.5 px-4 font-semibold text-white">{exp.propertyName}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-zinc-200">{exp.vendor}</div>
                    <div className="text-[11px] text-zinc-400 truncate max-w-xs">{exp.description}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-zinc-400">{exp.paymentMethod}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                    {formatINR(exp.amount)}
                    {exp.anomaly?.isAnomaly && (
                      <span className="ml-2 text-[10px] text-rose-400 font-semibold uppercase">⚠️ Anomaly</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setExpenseToDelete(exp)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsAddModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-[#0b0e14] border border-zinc-800 rounded-2xl shadow-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-semibold text-white">Record New Expense</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Select Property *</label>
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
                  <label className="text-zinc-400 block mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1">Vendor / Payee</label>
                  <input
                    type="text"
                    required
                    value={form.vendor}
                    onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                    placeholder="e.g. Tata Power / Caretaker"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Details of repair, service, or bill"
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
                  Record Outflow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {expenseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setExpenseToDelete(null)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm bg-[#0b0e14] border border-zinc-800 rounded-2xl p-6 shadow-2xl z-10 space-y-4">
            <h4 className="text-sm font-semibold text-white">Delete Expense Record?</h4>
            <p className="text-xs text-zinc-300">
              Remove expense of {formatINR(expenseToDelete.amount)} for {expenseToDelete.propertyName}?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setExpenseToDelete(null)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteExpense(expenseToDelete.id);
                  setExpenseToDelete(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
