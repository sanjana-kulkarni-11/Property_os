import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  Command,
  Box,
  User as UserIcon,
  LogOut,
  RefreshCw,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { User, NotificationItem } from '../../types';

interface HeaderProps {
  user: User | null;
  onOpenCommandBar: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
  onLogout: () => void;
  onResetDemo: () => void;
  onOpenSpatial3D: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenCommandBar,
  onOpenNotifications,
  unreadNotificationsCount,
  onLogout,
  onResetDemo,
  onOpenSpatial3D,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-[#07080a]/90 backdrop-blur-xl border-b border-zinc-800/80 px-4 lg:px-8 flex items-center justify-between">
      {/* Left: Search / Command Bar Trigger */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onOpenCommandBar}
          className="w-full flex items-center justify-between px-3.5 py-2 bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-200 transition-all text-sm group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-zinc-500 group-hover:text-rose-400 transition-colors" />
            <span className="text-zinc-400 text-xs sm:text-sm">
              Search properties, expenses, maintenance, or ask AI...
            </span>
          </div>
          <div className="flex items-center gap-1 bg-zinc-800/90 px-2 py-0.5 rounded text-[11px] font-mono text-zinc-400 border border-zinc-700/60">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right: Actions, 3D Toggle, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* 3D Spatial Twin Button */}
        <button
          onClick={onOpenSpatial3D}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-rose-500/50 text-xs font-medium text-zinc-200 transition-all"
        >
          <Box className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
          <span>3D Twin</span>
        </button>

        {/* AI Quick Query */}
        <button
          onClick={onOpenCommandBar}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-950/40 to-zinc-900 hover:from-rose-900/50 hover:to-zinc-800 border border-rose-500/30 text-xs font-medium text-rose-200 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden md:inline">PropertyOS AI</span>
        </button>

        {/* Notifications Icon */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl bg-zinc-900/70 hover:bg-zinc-800 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1 rounded-xl hover:bg-zinc-800/60 transition-colors border border-transparent hover:border-zinc-800"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-zinc-700"
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-zinc-200">{user?.name || 'Alex Vance'}</div>
              <div className="text-[10px] text-zinc-400 font-mono">Vance Family Office</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0b0d13] border border-zinc-800 rounded-xl shadow-2xl py-1.5 z-50">
              <div className="px-3.5 py-2 border-b border-zinc-800/80">
                <p className="text-xs font-semibold text-zinc-100">{user?.name || 'Alex Vance'}</p>
                <p className="text-[11px] text-zinc-400 truncate">{user?.email || 'demo@propertyos.com'}</p>
                <span className="inline-block mt-1 text-[9px] font-mono uppercase bg-rose-950/60 text-rose-300 border border-rose-800/50 px-1.5 py-0.5 rounded">
                  {user?.role || 'Principal Investor'}
                </span>
              </div>

              <button
                onClick={() => {
                  onResetDemo();
                  setProfileOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-zinc-300 hover:bg-zinc-800/60 hover:text-white transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
                <span>Reset Demo Seed Data</span>
              </button>

              <button
                onClick={() => {
                  onLogout();
                  setProfileOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-950/30 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
