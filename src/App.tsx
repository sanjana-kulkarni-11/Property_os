import React, { useState, useEffect } from 'react';
import { portfolioStore } from './services/api';
import {
  Property,
  Expense,
  MaintenanceTicket,
  StaffMember,
  Tenant,
  Vendor,
  DocumentRecord,
  InsurancePolicy,
  NotificationItem,
  AIInsight,
  User,
} from './types';
import { Header } from './components/layout/Header';
import { Sidebar, NavigationTab } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { NotificationsDrawer } from './components/modals/NotificationsDrawer';
import { AICommandBar } from './components/modals/AICommandBar';
import { AuthModal } from './components/auth/AuthModal';

import { DashboardView } from './components/views/DashboardView';
import { PropertiesView } from './components/views/PropertiesView';
import { PropertyDetailView } from './components/views/PropertyDetailView';
import { Spatial3DView } from './components/views/Spatial3DView';
import { ExpensesView } from './components/views/ExpensesView';
import { MaintenanceView } from './components/views/MaintenanceView';
import { StaffView } from './components/views/StaffView';
import { TenantsView } from './components/views/TenantsView';
import { VendorsView } from './components/views/VendorsView';
import { DocumentsView } from './components/views/DocumentsView';
import { InsuranceView } from './components/views/InsuranceView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { AIChatView } from './components/views/AIChatView';
import { AIInsightsView } from './components/views/AIInsightsView';
import { SettingsView } from './components/views/SettingsView';

export default function App() {
  const [user, setUser] = useState<User | null>(() => portfolioStore.getUser());
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Core Data States
  const [properties, setProperties] = useState<Property[]>(() => portfolioStore.getProperties());
  const [expenses, setExpenses] = useState<Expense[]>(() => portfolioStore.getExpenses());
  const [maintenance, setMaintenance] = useState<MaintenanceTicket[]>(() =>
    portfolioStore.getMaintenance()
  );
  const [staff, setStaff] = useState<StaffMember[]>(() => portfolioStore.getStaff());
  const [tenants, setTenants] = useState<Tenant[]>(() => portfolioStore.getTenants());
  const [vendors, setVendors] = useState<Vendor[]>(() => portfolioStore.getVendors());
  const [documents, setDocuments] = useState<DocumentRecord[]>(() =>
    portfolioStore.getDocuments()
  );
  const [insurance, setInsurance] = useState<InsurancePolicy[]>(() =>
    portfolioStore.getInsurance()
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    portfolioStore.getNotifications()
  );
  const [insights, setInsights] = useState<AIInsight[]>(() => portfolioStore.getAIInsights());

  // UI Overlays
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(!user);

  // Sync state helpers
  const refreshAllState = () => {
    setProperties(portfolioStore.getProperties());
    setExpenses(portfolioStore.getExpenses());
    setMaintenance(portfolioStore.getMaintenance());
    setStaff(portfolioStore.getStaff());
    setTenants(portfolioStore.getTenants());
    setVendors(portfolioStore.getVendors());
    setDocuments(portfolioStore.getDocuments());
    setInsurance(portfolioStore.getInsurance());
    setNotifications(portfolioStore.getNotifications());
    setInsights(portfolioStore.getAIInsights());
    setUser(portfolioStore.getUser());
  };

  // Keyboard shortcut Cmd+K for Command Bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandBarOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // CRUD Operations - Properties
  const handleCreateProperty = (newProp: Omit<Property, 'id'>) => {
    portfolioStore.createProperty(newProp);
    refreshAllState();
  };
  const handleUpdateProperty = (id: string, updates: Partial<Property>) => {
    portfolioStore.updateProperty(id, updates);
    refreshAllState();
  };
  const handleDeleteProperty = (id: string) => {
    portfolioStore.deleteProperty(id);
    if (selectedProperty?.id === id) {
      setSelectedProperty(null);
    }
    refreshAllState();
  };

  // CRUD Operations - Expenses
  const handleCreateExpense = (exp: Omit<Expense, 'id'>) => {
    portfolioStore.createExpense(exp);
    refreshAllState();
  };
  const handleUpdateExpense = (id: string, updates: Partial<Expense>) => {
    portfolioStore.updateExpense(id, updates);
    refreshAllState();
  };
  const handleDeleteExpense = (id: string) => {
    portfolioStore.deleteExpense(id);
    refreshAllState();
  };

  // CRUD Operations - Maintenance
  const handleCreateMaintenance = (m: Omit<MaintenanceTicket, 'id' | 'createdAt'>) => {
    portfolioStore.createMaintenance(m);
    refreshAllState();
  };
  const handleUpdateMaintenance = (id: string, updates: Partial<MaintenanceTicket>) => {
    portfolioStore.updateMaintenance(id, updates);
    refreshAllState();
  };
  const handleDeleteMaintenance = (id: string) => {
    portfolioStore.deleteMaintenance(id);
    refreshAllState();
  };

  // CRUD Operations - Staff
  const handleCreateStaff = (s: Omit<StaffMember, 'id'>) => {
    portfolioStore.createStaff(s);
    refreshAllState();
  };
  const handleUpdateStaff = (id: string, updates: Partial<StaffMember>) => {
    portfolioStore.updateStaff(id, updates);
    refreshAllState();
  };
  const handleDeleteStaff = (id: string) => {
    portfolioStore.deleteStaff(id);
    refreshAllState();
  };

  // CRUD Operations - Tenants
  const handleCreateTenant = (t: Omit<Tenant, 'id'>) => {
    portfolioStore.createTenant(t);
    refreshAllState();
  };
  const handleUpdateTenant = (id: string, updates: Partial<Tenant>) => {
    portfolioStore.updateTenant(id, updates);
    refreshAllState();
  };
  const handleDeleteTenant = (id: string) => {
    portfolioStore.deleteTenant(id);
    refreshAllState();
  };

  // CRUD Operations - Vendors
  const handleCreateVendor = (v: Omit<Vendor, 'id'>) => {
    portfolioStore.createVendor(v);
    refreshAllState();
  };
  const handleUpdateVendor = (id: string, updates: Partial<Vendor>) => {
    portfolioStore.updateVendor(id, updates);
    refreshAllState();
  };
  const handleDeleteVendor = (id: string) => {
    portfolioStore.deleteVendor(id);
    refreshAllState();
  };

  // CRUD Operations - Documents
  const handleCreateDocument = (d: Omit<DocumentRecord, 'id' | 'uploadDate'>) => {
    portfolioStore.createDocument(d);
    refreshAllState();
  };
  const handleDeleteDocument = (id: string) => {
    portfolioStore.deleteDocument(id);
    refreshAllState();
  };

  // CRUD Operations - Insurance
  const handleCreateInsurance = (ins: Omit<InsurancePolicy, 'id'>) => {
    portfolioStore.createInsurance(ins);
    refreshAllState();
  };
  const handleDeleteInsurance = (id: string) => {
    portfolioStore.deleteInsurance(id);
    refreshAllState();
  };

  // Notifications helpers
  const handleMarkNotificationAsRead = (id: string) => {
    portfolioStore.markNotificationAsRead(id);
    refreshAllState();
  };
  const handleMarkAllNotificationsAsRead = () => {
    portfolioStore.markAllNotificationsAsRead();
    refreshAllState();
  };

  // Reset Demo Data
  const handleResetDemoData = () => {
    portfolioStore.resetDemoData();
    refreshAllState();
    setSelectedProperty(null);
  };

  // Tenant Maintenance Request Dispatch
  const handleTenantMaintenanceRequest = (propertyId: string, issue: string) => {
    const prop = properties.find((p) => p.id === propertyId);
    portfolioStore.createMaintenance({
      propertyId,
      propertyName: prop?.name || 'Estate',
      issue: `Tenant Work Order: ${issue}`,
      description: `Reported through tenant portal: ${issue}`,
      category: 'General Repairs',
      priority: 'High',
      status: 'Reported',
      assignedVendor: 'CityPlumb Express',
      assignedStaff: 'Unassigned',
      estimatedCost: 8500,
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      notes: 'Tenant self-reported issue.',
      photos: [],
    });
    refreshAllState();
    setCurrentTab('maintenance');
  };

  // Auth Handler
  const handleAuthSuccess = (loggedUser: User) => {
    setUser(loggedUser);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    portfolioStore.logout();
    setUser(null);
    setIsAuthModalOpen(true);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex min-h-screen bg-[#07080a] text-zinc-100 antialiased selection:bg-rose-500/30 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setSelectedProperty(null);
          setCurrentTab(tab);
        }}
        openMaintenanceCount={maintenance.filter((m) => m.status !== 'Completed').length}
        anomaliesCount={expenses.filter((e) => e.anomaly?.isAnomaly).length}
      />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <Header
          user={user}
          onOpenCommandBar={() => setIsCommandBarOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          unreadNotificationsCount={unreadCount}
          onLogout={handleLogout}
          onResetDemo={handleResetDemoData}
          onOpenSpatial3D={() => {
            setSelectedProperty(null);
            setCurrentTab('spatial3d');
          }}
        />

        {/* View Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Detailed Property Dashboard View when an estate is selected */}
          {selectedProperty ? (
            <PropertyDetailView
              property={selectedProperty}
              onBack={() => setSelectedProperty(null)}
              expenses={expenses}
              maintenance={maintenance}
              documents={documents}
              staff={staff}
              tenants={tenants}
              vendors={vendors}
              insurance={insurance}
              onAddExpenseForProperty={(propId) => {
                setCurrentTab('expenses');
                setSelectedProperty(null);
              }}
              onAddMaintenanceForProperty={(propId) => {
                setCurrentTab('maintenance');
                setSelectedProperty(null);
              }}
            />
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <DashboardView
                  properties={properties}
                  expenses={expenses}
                  maintenance={maintenance}
                  insurance={insurance}
                  insights={insights}
                  onSelectProperty={(prop) => setSelectedProperty(prop)}
                  onNavigateTab={(tab) => setCurrentTab(tab as NavigationTab)}
                />
              )}

              {currentTab === 'properties' && (
                <PropertiesView
                  properties={properties}
                  onSelectProperty={(prop) => setSelectedProperty(prop)}
                  onCreateProperty={handleCreateProperty}
                  onUpdateProperty={handleUpdateProperty}
                  onDeleteProperty={handleDeleteProperty}
                />
              )}

              {currentTab === 'spatial3d' && (
                <Spatial3DView
                  properties={properties}
                  onSelectPropertyDetail={(prop) => setSelectedProperty(prop)}
                />
              )}

              {currentTab === 'expenses' && (
                <ExpensesView
                  expenses={expenses}
                  properties={properties}
                  onCreateExpense={handleCreateExpense}
                  onUpdateExpense={handleUpdateExpense}
                  onDeleteExpense={handleDeleteExpense}
                />
              )}

              {currentTab === 'maintenance' && (
                <MaintenanceView
                  maintenance={maintenance}
                  properties={properties}
                  staff={staff}
                  vendors={vendors}
                  onCreateMaintenance={handleCreateMaintenance}
                  onUpdateMaintenance={handleUpdateMaintenance}
                  onDeleteMaintenance={handleDeleteMaintenance}
                />
              )}

              {currentTab === 'staff' && (
                <StaffView
                  staff={staff}
                  properties={properties}
                  onCreateStaff={handleCreateStaff}
                  onUpdateStaff={handleUpdateStaff}
                  onDeleteStaff={handleDeleteStaff}
                />
              )}

              {currentTab === 'tenants' && (
                <TenantsView
                  tenants={tenants}
                  properties={properties}
                  onCreateTenant={handleCreateTenant}
                  onUpdateTenant={handleUpdateTenant}
                  onDeleteTenant={handleDeleteTenant}
                  onRequestMaintenance={handleTenantMaintenanceRequest}
                />
              )}

              {currentTab === 'vendors' && (
                <VendorsView
                  vendors={vendors}
                  properties={properties}
                  onCreateVendor={handleCreateVendor}
                  onUpdateVendor={handleUpdateVendor}
                  onDeleteVendor={handleDeleteVendor}
                />
              )}

              {currentTab === 'documents' && (
                <DocumentsView
                  documents={documents}
                  properties={properties}
                  onCreateDocument={handleCreateDocument}
                  onDeleteDocument={handleDeleteDocument}
                />
              )}

              {currentTab === 'insurance' && (
                <InsuranceView
                  insurance={insurance}
                  properties={properties}
                  onCreateInsurance={handleCreateInsurance}
                  onDeleteInsurance={handleDeleteInsurance}
                />
              )}

              {currentTab === 'analytics' && (
                <AnalyticsView
                  properties={properties}
                  expenses={expenses}
                  maintenance={maintenance}
                  vendors={vendors}
                />
              )}

              {currentTab === 'ai-chat' && <AIChatView />}

              {currentTab === 'ai-insights' && (
                <AIInsightsView
                  insights={insights}
                  onNavigateTab={(tab) => setCurrentTab(tab as NavigationTab)}
                />
              )}

              {currentTab === 'notifications' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-heading font-bold text-white">Notifications Center</h2>
                  <div className="space-y-3">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-white text-sm">{n.title}</div>
                          <div className="text-xs text-zinc-400 mt-0.5">{n.message}</div>
                          <div className="text-[10px] font-mono text-zinc-500 mt-1">{n.propertyName} · {n.timestamp}</div>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-rose-400 font-semibold uppercase">
                          {n.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentTab === 'settings' && (
                <SettingsView user={user} onResetDemo={handleResetDemoData} />
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setSelectedProperty(null);
          setCurrentTab(tab);
        }}
        onOpenMobileMenu={() => setIsCommandBarOpen(true)}
      />

      {/* Notifications Drawer Slide-over */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onNavigateToTab={(tab) => {
          setSelectedProperty(null);
          setCurrentTab(tab as NavigationTab);
        }}
      />

      {/* Global AI Command Bar (Cmd + K) */}
      <AICommandBar
        isOpen={isCommandBarOpen}
        onClose={() => setIsCommandBarOpen(false)}
        onNavigate={(tab) => {
          setSelectedProperty(null);
          setCurrentTab(tab as NavigationTab);
        }}
        properties={properties}
        expenses={expenses}
        maintenance={maintenance}
        insurance={insurance}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onSuccess={handleAuthSuccess}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
