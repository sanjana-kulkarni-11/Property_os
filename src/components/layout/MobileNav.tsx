import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Box,
  Wrench,
  Receipt,
  Bot,
  Menu,
} from 'lucide-react';
import { NavigationTab } from './Sidebar';

interface MobileNavProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenMobileMenu: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenMobileMenu,
}) => {
  const mainTabs = [
    { id: 'dashboard' as NavigationTab, label: 'Dash', icon: LayoutDashboard },
    { id: 'properties' as NavigationTab, label: 'Estates', icon: Building2 },
    { id: 'spatial3d' as NavigationTab, label: '3D Twin', icon: Box },
    { id: 'maintenance' as NavigationTab, label: 'Tasks', icon: Wrench },
    { id: 'expenses' as NavigationTab, label: 'Expenses', icon: Receipt },
    { id: 'ai-chat' as NavigationTab, label: 'AI', icon: Bot },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07080a]/95 backdrop-blur-xl border-t border-zinc-800/90 px-2 py-2 flex items-center justify-around">
      {mainTabs.map((t) => {
        const Icon = t.icon;
        const isActive = currentTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onSelectTab(t.id)}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
              isActive ? 'text-rose-400 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-rose-500' : ''}`} />
            <span>{t.label}</span>
          </button>
        );
      })}

      <button
        onClick={onOpenMobileMenu}
        className="flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium text-zinc-500 hover:text-zinc-300"
      >
        <Menu className="w-4 h-4" />
        <span>Menu</span>
      </button>
    </div>
  );
};
