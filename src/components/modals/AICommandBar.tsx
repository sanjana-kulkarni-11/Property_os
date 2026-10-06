import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  Command,
  ArrowRight,
  Building2,
  Receipt,
  Wrench,
  ShieldCheck,
  TrendingUp,
  X,
  CheckCircle,
} from 'lucide-react';
import { Property, Expense, MaintenanceTicket, InsurancePolicy } from '../../types';
import { formatINR } from '../../utils/formatters';

interface AICommandBarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, filterParams?: any) => void;
  properties: Property[];
  expenses: Expense[];
  maintenance: MaintenanceTicket[];
  insurance: InsurancePolicy[];
}

export const AICommandBar: React.FC<AICommandBarProps> = ({
  isOpen,
  onClose,
  onNavigate,
  properties,
  expenses,
  maintenance,
  insurance,
}) => {
  const [query, setQuery] = useState('');
  const [aiResult, setAiResult] = useState<{
    title: string;
    description: string;
    actionLabel?: string;
    targetTab?: string;
    details?: string[];
  } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleExecute = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;

    if (q.includes('vacant')) {
      const vacant = properties.filter((p) => p.status === 'Vacant');
      setAiResult({
        title: `${vacant.length} Vacant Property Located`,
        description: `Found ${vacant.map((p) => p.name).join(', ')} currently unoccupied with zero rental cashflow.`,
        actionLabel: 'View in Properties',
        targetTab: 'properties',
        details: vacant.map((v) => `${v.name} (${v.city}) - Holding Cost: ${formatINR(v.monthlyExpenses)}/mo`),
      });
    } else if (q.includes('overdue') || (q.includes('maintenance') && q.includes('due'))) {
      const overdue = maintenance.filter((m) => m.dueDate < '2026-10-06' && m.status !== 'Completed');
      setAiResult({
        title: `${overdue.length} Overdue Maintenance Tasks`,
        description: 'Critical tasks requiring immediate dispatch include Mysore Farmhouse Solar Pump and Hyderabad Server Room AHU filters.',
        actionLabel: 'Open Maintenance Board',
        targetTab: 'maintenance',
        details: overdue.map((o) => `[${o.priority}] ${o.issue} (${o.propertyName})`),
      });
    } else if (q.includes('bangalore') && (q.includes('spend') || q.includes('cost') || q.includes('expense'))) {
      const blrExpenses = expenses.filter((e) => e.propertyName.includes('Bangalore'));
      const total = blrExpenses.reduce((a, b) => a + b.amount, 0);
      setAiResult({
        title: `Bangalore Villa Spending: ${formatINR(total)}`,
        description: `Total recorded expenditures across staff payroll, solar microgrid repairs, and perimeter security.`,
        actionLabel: 'Inspect Bangalore Expenses',
        targetTab: 'expenses',
        details: blrExpenses.map((e) => `${e.category}: ${formatINR(e.amount)} (${e.vendor})`),
      });
    } else if (q.includes('highest roi') || q.includes('best roi')) {
      const best = [...properties].sort((a, b) => b.roi - a.roi)[0];
      setAiResult({
        title: `Highest Yield: ${best.name} (${best.roi}% ROI)`,
        description: `Generates ${formatINR(best.monthlyIncome)}/month with steady commercial lease lock-in.`,
        actionLabel: 'View Property Financials',
        targetTab: 'properties',
        details: [`Asset Valuation: ${formatINR(best.currentValue)}`, `Annual Yield: ${best.roi}%`, `Tenant: Nexora Cloud Technologies`],
      });
    } else if (q.includes('insurance') || q.includes('policy')) {
      const expiring = insurance.filter((i) => i.status === 'Expiring Soon');
      setAiResult({
        title: `${expiring.length} Policy Expiring Soon (18 Days Left)`,
        description: `Tata AIG Bharat Griha for Bangalore Luxury Villa coverage of ₹15 Cr lapses on 24 Oct 2026.`,
        actionLabel: 'Open Insurance Vault',
        targetTab: 'insurance',
        details: expiring.map((i) => `${i.propertyName}: Policy #${i.policyNumber} (Premium: ${formatINR(i.premium)})`),
      });
    } else {
      // General match
      setAiResult({
        title: `Portfolio Search for "${query}"`,
        description: `Scanned 6 estates, 9 expense ledgers, and 8 active maintenance tickets.`,
        actionLabel: 'Open Analytics',
        targetTab: 'analytics',
        details: ['Found matches across Bangalore Villa, Goa Beach Villa, and Worli Penthouse.'],
      });
    }
  };

  const samplePrompts = [
    'Show vacant properties',
    'Show overdue maintenance',
    'How much did I spend in Bangalore?',
    'Which property has the highest ROI?',
    'Show insurance expiring this month',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md" />

      <div className="relative w-full max-w-2xl bg-[#0a0c12] border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden z-10">
        {/* Command Input Bar */}
        <form onSubmit={handleExecute} className="p-4 border-b border-zinc-800 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-rose-500 animate-pulse shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or ask PropertyOS AI (e.g. 'Show overdue maintenance')..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors flex items-center gap-1 shrink-0"
          >
            <span>Run</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </form>

        {/* AI Result or Quick Prompt Suggestions */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {aiResult ? (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/40 via-zinc-900 to-zinc-900 border border-rose-500/40 shadow-xl">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-semibold uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Command Execution</span>
                </div>
                <h4 className="text-base font-semibold text-white mt-1">{aiResult.title}</h4>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{aiResult.description}</p>

                {aiResult.details && aiResult.details.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-zinc-800 space-y-1">
                    {aiResult.details.map((d, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-zinc-300 font-mono">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                )}

                {aiResult.targetTab && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => {
                        onNavigate(aiResult.targetTab!);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium border border-zinc-600 flex items-center gap-1.5 transition-colors"
                    >
                      <span>{aiResult.actionLabel || 'Navigate to View'}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold px-1">
                Suggested Commands
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {samplePrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(p);
                      // trigger execute
                      setTimeout(() => {
                        const evt = { preventDefault: () => {} } as any;
                        setQuery(p);
                      }, 50);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 flex items-center justify-between group transition-colors"
                  >
                    <span>{p}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-rose-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
