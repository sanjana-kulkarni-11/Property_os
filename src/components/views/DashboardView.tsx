import React from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  ShieldAlert,
  Zap,
  ChevronRight,
  MapPin,
  ArrowRight,
  Box,
} from 'lucide-react';
import { Property, Expense, MaintenanceTicket, InsurancePolicy, AIInsight } from '../../types';
import { formatINR } from '../../utils/formatters';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface DashboardViewProps {
  properties: Property[];
  expenses: Expense[];
  maintenance: MaintenanceTicket[];
  insurance: InsurancePolicy[];
  insights: AIInsight[];
  onSelectProperty: (property: Property) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  properties,
  expenses,
  maintenance,
  insurance,
  onSelectProperty,
  onNavigateTab,
}) => {
  // Computed Portfolio Metrics
  const totalValue = properties.reduce((acc, p) => acc + p.currentValue, 0);
  const totalIncome = properties.reduce((acc, p) => acc + p.monthlyIncome, 0);
  const totalExpenses = properties.reduce((acc, p) => acc + p.monthlyExpenses, 0);
  const netCashflow = totalIncome - totalExpenses;
  const avgOccupancy =
    properties.length > 0
      ? Math.round(properties.reduce((acc, p) => acc + p.occupancyRate, 0) / properties.length)
      : 87;

  // 5-Month Clean Cashflow Chart
  const cashflowData = [
    { month: 'Jun', income: 480000, expenses: 310000 },
    { month: 'Jul', income: 495000, expenses: 330000 },
    { month: 'Aug', income: 510000, expenses: 345000 },
    { month: 'Sep', income: 520000, expenses: 360000 },
    { month: 'Oct', income: totalIncome, expenses: totalExpenses },
  ];

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* 1. Calm Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800/60 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-medium text-white tracking-tight">
            Good morning, Alex
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Vance Family Office · 6 Estates under management
          </p>
        </div>

        {/* Quiet secondary quick links */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('spatial3d')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-colors"
          >
            <Box className="w-3.5 h-3.5 text-zinc-400" />
            <span>Open 3D Spatial Twin</span>
          </button>
          <button
            onClick={() => onNavigateTab('ai-chat')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-colors"
          >
            <span>Ask AI</span>
            <ArrowRight className="w-3 h-3 text-zinc-500" />
          </button>
        </div>
      </div>

      {/* 2. Refined Private Banking KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Portfolio Valuation */}
        <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80">
          <div className="text-xs text-zinc-400 font-medium">Portfolio Valuation</div>
          <div className="text-2xl font-mono font-semibold text-white tracking-tight mt-1.5">
            {formatINR(totalValue)}
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+14.2% YoY Appreciation</span>
          </div>
        </div>

        {/* Monthly Net Cashflow */}
        <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80">
          <div className="text-xs text-zinc-400 font-medium">Monthly Net Cashflow</div>
          <div className="text-2xl font-mono font-semibold text-emerald-400 tracking-tight mt-1.5">
            +{formatINR(netCashflow)}
          </div>
          <div className="text-[11px] text-zinc-400 font-mono mt-2">
            Inflow {formatINR(totalIncome)} · Outflow {formatINR(totalExpenses)}
          </div>
        </div>

        {/* Portfolio Occupancy */}
        <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80">
          <div className="text-xs text-zinc-400 font-medium">Portfolio Occupancy</div>
          <div className="text-2xl font-mono font-semibold text-white tracking-tight mt-1.5">
            {avgOccupancy}%
          </div>
          <div className="text-[11px] text-zinc-400 font-mono mt-2">
            5 of 6 occupied · Goa Villa vacant
          </div>
        </div>

        {/* Active Action Items */}
        <div
          onClick={() => onNavigateTab('ai-insights')}
          className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 cursor-pointer transition-colors group"
        >
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
            <span>Advisories & Tasks</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
          </div>
          <div className="text-2xl font-mono font-semibold text-amber-400 tracking-tight mt-1.5">
            2 Items
          </div>
          <div className="text-[11px] text-zinc-400 font-mono mt-2">
            1 Power spike · 1 Policy renewal
          </div>
        </div>
      </div>

      {/* 3. Quiet "Attention Required" Bar (Clean, no garish colors) */}
      <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/80 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-300 uppercase tracking-wider text-[11px] font-mono">
            Requires Attention
          </span>
          <button
            onClick={() => onNavigateTab('ai-insights')}
            className="text-xs text-zinc-400 hover:text-white transition-colors"
          >
            View all →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div
            onClick={() => onNavigateTab('expenses')}
            className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/70 hover:border-zinc-700 transition-colors cursor-pointer flex items-start gap-3"
          >
            <Zap className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white">Goa Beach Villa · Electricity surge (+111%)</div>
              <p className="text-zinc-400 text-[11px] mt-0.5 truncate">
                Bill is ₹28,500 vs. normal ₹13,500. Coastal Air technician scheduled.
              </p>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('insurance')}
            className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/70 hover:border-zinc-700 transition-colors cursor-pointer flex items-start gap-3"
          >
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white">Bangalore Villa · Insurance expires in 18 days</div>
              <p className="text-zinc-400 text-[11px] mt-0.5 truncate">
                Tata AIG All-Risk policy (₹15 Cr cover) renewal due on 24 Oct 2026.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Single Clean Cashflow Trend Chart */}
      <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Cashflow Trajectory</h3>
            <p className="text-xs text-zinc-400 mt-0.5">5-month income and operational expenditure</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Income ({formatINR(totalIncome)})
            </span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Expenses ({formatINR(totalExpenses)})
            </span>
          </div>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cashflowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="cleanIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="cleanExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#52525b" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#52525b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `₹${v / 100000}L`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090b10',
                  borderColor: '#27272a',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [formatINR(val), '']}
              />
              <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={1.5} fill="url(#cleanIncome)" />
              <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={1.5} fill="url(#cleanExpense)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Minimalist Estate Portfolio Summary */}
      <div className="rounded-xl bg-zinc-900/40 border border-zinc-800/80 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-zinc-800/60 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Portfolio Estates</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Click any property to inspect financials, telemetry, and staff</p>
          </div>
          <button
            onClick={() => onNavigateTab('properties')}
            className="text-xs text-zinc-400 hover:text-white transition-colors"
          >
            Manage all 6 →
          </button>
        </div>

        <div className="divide-y divide-zinc-800/60">
          {properties.map((prop) => (
            <div
              key={prop.id}
              onClick={() => onSelectProperty(prop)}
              className="p-4 sm:px-5 hover:bg-zinc-800/30 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={prop.image}
                  alt={prop.name}
                  className="w-11 h-11 rounded-lg object-cover ring-1 ring-zinc-800 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-white truncate">{prop.name}</h4>
                  <div className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3 h-3 text-zinc-500" />
                    <span>{prop.city}</span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-zinc-500">{prop.type}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 text-xs pl-14 sm:pl-0">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase font-mono">Valuation</div>
                  <div className="font-mono font-medium text-white mt-0.5">
                    {formatINR(prop.currentValue)}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-zinc-500 uppercase font-mono">Cashflow</div>
                  <div className="font-mono font-medium text-emerald-400 mt-0.5">
                    {formatINR(prop.monthlyIncome)}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      prop.status === 'Rented'
                        ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-900/60'
                        : prop.status === 'Owner Occupied'
                        ? 'text-zinc-300 bg-zinc-800/60 border border-zinc-700/60'
                        : 'text-rose-400 bg-rose-950/60 border border-rose-900/60'
                    }`}
                  >
                    {prop.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
