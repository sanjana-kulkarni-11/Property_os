import React from 'react';
import { Property, Expense, MaintenanceTicket, Vendor } from '../../types';
import { formatINR } from '../../utils/formatters';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import { TrendingUp, DollarSign, Building, Percent, Wrench, Shield, ArrowUpRight } from 'lucide-react';

interface AnalyticsViewProps {
  properties: Property[];
  expenses: Expense[];
  maintenance: MaintenanceTicket[];
  vendors: Vendor[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  properties,
  expenses,
  maintenance,
  vendors,
}) => {
  const totalValue = properties.reduce((acc, p) => acc + p.currentValue, 0);
  const totalIncome = properties.reduce((acc, p) => acc + p.monthlyIncome, 0);
  const totalExpenses = properties.reduce((acc, p) => acc + p.monthlyExpenses, 0);
  const netIncome = totalIncome - totalExpenses;
  const avgROI =
    properties.length > 0
      ? (properties.reduce((acc, p) => acc + p.roi, 0) / properties.length).toFixed(1)
      : '0';
  const avgOccupancy =
    properties.length > 0
      ? Math.round(properties.reduce((acc, p) => acc + p.occupancyRate, 0) / properties.length)
      : 0;

  // Chart 1: Value Distribution by Property
  const valueDistribution = properties.map((p) => ({
    name: p.city,
    fullName: p.name,
    valueCr: Number((p.currentValue / 10000000).toFixed(2)),
  }));

  // Chart 2: Category Breakdown
  const categorySpending = expenses.reduce((acc: any[], curr) => {
    const existing = acc.find((item) => item.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []);

  // Chart 3: Maintenance Status Ratio
  const openMaint = maintenance.filter((m) => m.status !== 'Completed').length;
  const completedMaint = maintenance.filter((m) => m.status === 'Completed').length;
  const maintStatusData = [
    { name: 'Open / Dispatched', value: openMaint },
    { name: 'Completed & Certified', value: completedMaint },
  ];

  // Chart 4: Top Vendor Spend
  const vendorSpendData = vendors.map((v) => ({
    name: v.name.split(' ')[0],
    fullName: v.name,
    amount: v.totalSpending,
  }));

  const COLORS = ['#e11d48', '#06b6d4', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#3b82f6'];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-mono tracking-widest uppercase text-rose-400 font-semibold">
            INSTITUTIONAL PORTFOLIO METRICS
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
          Portfolio Analytics & Yield Intelligence
        </h1>
        <p className="text-zinc-400 text-sm mt-0.5">
          Holistic performance telemetry, capital appreciation, and OPEX distribution models.
        </p>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] font-mono uppercase text-zinc-500">Gross Valuation</span>
          <div className="text-xl font-mono font-bold text-white mt-1">{formatINR(totalValue)}</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">+14.2% YoY Gain</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] font-mono uppercase text-zinc-500">Gross Monthly Rent</span>
          <div className="text-xl font-mono font-bold text-emerald-400 mt-1">{formatINR(totalIncome)}</div>
          <div className="text-[10px] text-zinc-400 font-mono mt-0.5">{formatINR(totalIncome * 12)} / yr</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] font-mono uppercase text-zinc-500">Monthly Expenses</span>
          <div className="text-xl font-mono font-bold text-rose-400 mt-1">{formatINR(totalExpenses)}</div>
          <div className="text-[10px] text-zinc-400 font-mono mt-0.5">{formatINR(totalExpenses * 12)} / yr</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] font-mono uppercase text-zinc-500">Net Cashflow</span>
          <div className="text-xl font-mono font-bold text-white mt-1">{formatINR(netIncome)}</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Positive Run Rate</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] font-mono uppercase text-zinc-500">Average ROI</span>
          <div className="text-xl font-mono font-bold text-white mt-1">{avgROI}%</div>
          <div className="text-[10px] text-zinc-400 font-mono mt-0.5">Top: Hyderabad (11.2%)</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] font-mono uppercase text-zinc-500">Occupancy</span>
          <div className="text-xl font-mono font-bold text-white mt-1">{avgOccupancy}%</div>
          <div className="text-[10px] text-amber-400 font-mono mt-0.5">Goa Beach Vacant</div>
        </div>
      </div>

      {/* Grid of 4 Recharts Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Valuation Distribution */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Asset Valuation Distribution</h3>
              <p className="text-xs text-zinc-400">Values in Crores (₹ Cr)</p>
            </div>
            <span className="text-xs font-mono text-rose-400 font-semibold">₹42.8 Cr Total</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={valueDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.5} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} unit=" Cr" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090b10', borderColor: '#27272a', borderRadius: '8px' }}
                  formatter={(val: any) => [`₹${val} Cr`, 'Valuation']}
                />
                <Bar dataKey="valueCr" fill="#e11d48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Spending Breakdown */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Expense Category Breakdown</h3>
              <p className="text-xs text-zinc-400">Operational cost allocations</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySpending}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name }) => name}
                  labelLine={false}
                >
                  {categorySpending.map((entry, index) => (
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
        </div>

        {/* Chart 3: Maintenance Status Ratio */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Work Order Resolution Status</h3>
              <p className="text-xs text-zinc-400">Open active tickets vs completed work</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={maintStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  <Cell fill="#f59e0b" />
                  <Cell fill="#10b981" />
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#090b10', borderColor: '#27272a', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Vendor Cumulative Spending */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Top Specialized Contractor Volume</h3>
              <p className="text-xs text-zinc-400">Historical billing volume per service partner</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendorSpendData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.5} />
                <XAxis type="number" stroke="#71717a" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                <YAxis dataKey="name" type="category" stroke="#71717a" fontSize={11} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090b10', borderColor: '#27272a', borderRadius: '8px' }}
                  formatter={(val: any) => [formatINR(val), 'Volume']}
                />
                <Bar dataKey="amount" fill="#06b6d4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
