import React, { useState } from 'react';
import { AIInsight } from '../../types';
import {
  Sparkles,
  TrendingUp,
  Building,
  Wrench,
  FileText,
  Zap,
  CheckCircle,
  ArrowRight,
  ShieldAlert,
  Percent,
} from 'lucide-react';

interface AIInsightsViewProps {
  insights: AIInsight[];
  onNavigateTab: (tab: string) => void;
}

export const AIInsightsView: React.FC<AIInsightsViewProps> = ({
  insights,
  onNavigateTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [executedInsights, setExecutedInsights] = useState<string[]>([]);

  const filtered = insights.filter(
    (ins) => selectedCategory === 'All' || ins.category === selectedCategory
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'FINANCIAL':
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'PROPERTY':
        return <Building className="w-4 h-4 text-cyan-400" />;
      case 'MAINTENANCE':
        return <Wrench className="w-4 h-4 text-amber-400" />;
      case 'DOCUMENT':
        return <FileText className="w-4 h-4 text-purple-400" />;
      case 'EXPENSE':
        return <Zap className="w-4 h-4 text-rose-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-rose-400" />;
    }
  };

  const handleExecute = (id: string, category: string) => {
    setExecutedInsights((prev) => [...prev, id]);
    if (category === 'EXPENSE') onNavigateTab('expenses');
    else if (category === 'DOCUMENT') onNavigateTab('insurance');
    else if (category === 'MAINTENANCE') onNavigateTab('maintenance');
    else onNavigateTab('properties');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-rose-400 font-semibold">
            PROACTIVE PORTFOLIO SURVEILLANCE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
          AI Insights & Recommendations
        </h1>
        <p className="text-zinc-400 text-sm mt-0.5">
          Deterministic heuristics and Gemini neural analysis spanning idle capital, OPEX surges, and maintenance intervals.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['All', 'FINANCIAL', 'PROPERTY', 'MAINTENANCE', 'DOCUMENT', 'EXPENSE'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-rose-600 text-white font-semibold shadow-md shadow-rose-950/50'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Insights Grid */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isExecuted = executedInsights.includes(item.id);
          return (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all shadow-xl space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-zinc-800/80 shrink-0">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-semibold">
                      {item.category} INSIGHT
                    </span>
                    <h3 className="text-base font-semibold text-white mt-0.5 leading-snug">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Insight Type Tag (Prompt Requirement: Data-based, Calculated, AI recommendation) */}
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                      item.type === 'AI recommendation'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : item.type === 'Calculated'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                        : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                    }`}
                  >
                    {item.type}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                    {item.confidence}% Confidence
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {item.description}
              </p>

              {/* Metric Highlight Box */}
              <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 font-mono uppercase block">
                    Telemetry Deviation / Highlight:
                  </span>
                  <span className="font-mono font-bold text-white text-sm mt-0.5">
                    {item.metricHighlight}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">Action:</span>
                  <span className="text-zinc-200 font-medium">{item.recommendedAction}</span>
                </div>
              </div>

              {/* Footer Execution Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleExecute(item.id, item.category)}
                  disabled={isExecuted}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    isExecuted
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                      : 'bg-zinc-800 hover:bg-rose-600 hover:text-white text-zinc-200 border border-zinc-700 shadow-md'
                  }`}
                >
                  {isExecuted ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Action Dispatched</span>
                    </>
                  ) : (
                    <>
                      <span>Execute Recommended Action</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
