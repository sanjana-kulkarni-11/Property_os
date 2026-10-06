import React from 'react';
import {
  LayoutDashboard,
  Building2,
  BarChart3,
  Box,
  Wrench,
  Receipt,
  Users,
  KeyRound,
  Store,
  FileText,
  ShieldCheck,
  Bot,
  Sparkles,
  Bell,
  Settings,
  ChevronRight,
} from 'lucide-react';

export type NavigationTab =
  | 'dashboard'
  | 'properties'
  | 'analytics'
  | 'spatial3d'
  | 'maintenance'
  | 'expenses'
  | 'staff'
  | 'tenants'
  | 'vendors'
  | 'documents'
  | 'insurance'
  | 'ai-chat'
  | 'ai-insights'
  | 'notifications'
  | 'settings';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | null;
  badgeColor?: 'rose' | 'amber' | string;
  highlight?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  openMaintenanceCount?: number;
  anomaliesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  openMaintenanceCount = 7,
  anomaliesCount = 1,
}) => {
  const sections: NavSection[] = [
    {
      title: 'CORE',
      items: [
        {
          id: 'dashboard' as NavigationTab,
          label: 'Dashboard',
          icon: LayoutDashboard,
          badge: null,
        },
      ],
    },
    {
      title: 'PORTFOLIO',
      items: [
        {
          id: 'properties' as NavigationTab,
          label: 'Properties',
          icon: Building2,
          badge: '6 Estates',
        },
        {
          id: 'spatial3d' as NavigationTab,
          label: '3D Digital Twin',
          icon: Box,
          badge: 'Spatial',
          highlight: true,
        },
        {
          id: 'analytics' as NavigationTab,
          label: 'Analytics',
          icon: BarChart3,
          badge: null,
        },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        {
          id: 'maintenance' as NavigationTab,
          label: 'Maintenance',
          icon: Wrench,
          badge: openMaintenanceCount > 0 ? `${openMaintenanceCount} Open` : null,
          badgeColor: 'amber',
        },
        {
          id: 'expenses' as NavigationTab,
          label: 'Expenses',
          icon: Receipt,
          badge: anomaliesCount > 0 ? '1 Alert' : null,
          badgeColor: 'rose',
        },
        {
          id: 'staff' as NavigationTab,
          label: 'Staff & Payroll',
          icon: Users,
          badge: null,
        },
        {
          id: 'tenants' as NavigationTab,
          label: 'Tenants & Leases',
          icon: KeyRound,
          badge: null,
        },
        {
          id: 'vendors' as NavigationTab,
          label: 'Vendors',
          icon: Store,
          badge: null,
        },
      ],
    },
    {
      title: 'VAULT & COMPLIANCE',
      items: [
        {
          id: 'documents' as NavigationTab,
          label: 'Documents',
          icon: FileText,
          badge: null,
        },
        {
          id: 'insurance' as NavigationTab,
          label: 'Insurance',
          icon: ShieldCheck,
          badge: '1 Expiring',
          badgeColor: 'amber',
        },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        {
          id: 'ai-chat' as NavigationTab,
          label: 'PropertyOS AI',
          icon: Bot,
          badge: 'Gemini',
          highlight: true,
        },
        {
          id: 'ai-insights' as NavigationTab,
          label: 'AI Insights',
          icon: Sparkles,
          badge: '5 Live',
        },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        {
          id: 'notifications' as NavigationTab,
          label: 'Notifications',
          icon: Bell,
          badge: null,
        },
        {
          id: 'settings' as NavigationTab,
          label: 'Settings',
          icon: Settings,
          badge: null,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col bg-[#07080a] border-r border-zinc-800/80 h-screen sticky top-0 overflow-y-auto selection:bg-rose-500/20">
      {/* Brand Header - Ferrari SF90 Inspired High-Precision Logo */}
      <div className="p-5 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 via-rose-700 to-zinc-900 flex items-center justify-center shadow-lg shadow-rose-950/60 ring-1 ring-rose-500/40">
            <span className="font-mono text-sm font-black text-white tracking-widest">OS</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-base font-bold tracking-wider text-white">PROPERTYOS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            </div>
            <p className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
              COMMAND CENTER
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 py-4 px-3 space-y-6">
        {sections.map((sec) => (
          <div key={sec.title}>
            <div className="px-3 mb-1.5 text-[10px] font-mono tracking-widest uppercase text-zinc-400 font-semibold">
              {sec.title}
            </div>
            <div className="space-y-0.5">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-zinc-800/90 text-white font-semibold border border-zinc-700/80 shadow-md'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? 'text-rose-400'
                            : item.highlight
                            ? 'text-rose-400/80 group-hover:text-rose-300'
                            : 'text-zinc-500 group-hover:text-zinc-300'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          item.badgeColor === 'rose'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-800/50'
                            : item.badgeColor === 'amber'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-800/50'
                            : 'bg-zinc-800/80 text-zinc-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Portfolio Snapshot Card */}
      <div className="p-3 m-3 rounded-xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800/80">
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1">
          <span>PORTFOLIO ASSETS</span>
          <span className="text-rose-400 font-semibold">₹42.8 Cr</span>
        </div>
        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-rose-500 h-full w-[87%]" />
        </div>
        <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-2">
          <span>6 Estates Active</span>
          <span className="text-emerald-400">87% Occupancy</span>
        </div>
      </div>
    </aside>
  );
};
