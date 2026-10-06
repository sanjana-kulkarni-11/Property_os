import React from 'react';
import { X, CheckCheck, AlertTriangle, ShieldCheck, Clock, FileText, Zap, DollarSign } from 'lucide-react';
import { NotificationItem } from '../../types';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNavigateToTab,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'Expense anomaly':
        return <Zap className="w-4 h-4 text-rose-400" />;
      case 'Insurance expiry':
        return <ShieldCheck className="w-4 h-4 text-amber-400" />;
      case 'Maintenance overdue':
      case 'Maintenance due':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'Rent due':
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      default:
        return <FileText className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#0a0c12] border-l border-zinc-800 h-full flex flex-col shadow-2xl z-10">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-semibold text-white tracking-tight">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-rose-950 text-rose-300 border border-rose-800/60 text-xs px-2 py-0.5 rounded-full font-mono">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                title="Mark all read"
              >
                <CheckCheck className="w-3.5 h-3.5 text-rose-400" />
                <span>Mark all</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-sm">
              No notifications at this time.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onMarkAsRead(item.id);
                  if (item.actionUrl && onNavigateToTab) {
                    const tab = item.actionUrl.replace('/', '');
                    onNavigateToTab(tab);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  item.read
                    ? 'bg-zinc-900/40 border-zinc-800/60 opacity-70 hover:opacity-100'
                    : 'bg-zinc-900/90 border-zinc-700/80 shadow-lg'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-zinc-800/80 shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-semibold">
                        {item.propertyName}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.timestamp}
                      </span>
                    </div>
                    <h5 className="text-xs font-semibold text-white mt-0.5 leading-snug">
                      {item.title}
                    </h5>
                    <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
