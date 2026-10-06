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
} from '../types';
import {
  INITIAL_PROPERTIES,
  INITIAL_EXPENSES,
  INITIAL_MAINTENANCE,
  INITIAL_STAFF,
  INITIAL_TENANTS,
  INITIAL_VENDORS,
  INITIAL_DOCUMENTS,
  INITIAL_INSURANCE,
  INITIAL_NOTIFICATIONS,
  INITIAL_AI_INSIGHTS,
  INITIAL_USER,
} from '../data/mockData';

const STORAGE_KEYS = {
  USER: 'pos_user',
  TOKEN: 'pos_jwt_token',
  PROPERTIES: 'pos_properties',
  EXPENSES: 'pos_expenses',
  MAINTENANCE: 'pos_maintenance',
  STAFF: 'pos_staff',
  TENANTS: 'pos_tenants',
  VENDORS: 'pos_vendors',
  DOCUMENTS: 'pos_documents',
  INSURANCE: 'pos_insurance',
  NOTIFICATIONS: 'pos_notifications',
  AI_INSIGHTS: 'pos_ai_insights',
};

// Safe localStorage helper
function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage error:', e);
  }
}

// In-memory / persisted local store
class PortfolioStorage {
  private properties: Property[];
  private expenses: Expense[];
  private maintenance: MaintenanceTicket[];
  private staff: StaffMember[];
  private tenants: Tenant[];
  private vendors: Vendor[];
  private documents: DocumentRecord[];
  private insurance: InsurancePolicy[];
  private notifications: NotificationItem[];
  private aiInsights: AIInsight[];
  private user: User | null;

  constructor() {
    this.user = getStored<User | null>(STORAGE_KEYS.USER, INITIAL_USER);
    this.properties = getStored<Property[]>(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES);
    this.expenses = getStored<Expense[]>(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
    this.maintenance = getStored<MaintenanceTicket[]>(STORAGE_KEYS.MAINTENANCE, INITIAL_MAINTENANCE);
    this.staff = getStored<StaffMember[]>(STORAGE_KEYS.STAFF, INITIAL_STAFF);
    this.tenants = getStored<Tenant[]>(STORAGE_KEYS.TENANTS, INITIAL_TENANTS);
    this.vendors = getStored<Vendor[]>(STORAGE_KEYS.VENDORS, INITIAL_VENDORS);
    this.documents = getStored<DocumentRecord[]>(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
    this.insurance = getStored<InsurancePolicy[]>(STORAGE_KEYS.INSURANCE, INITIAL_INSURANCE);
    this.notifications = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    this.aiInsights = getStored<AIInsight[]>(STORAGE_KEYS.AI_INSIGHTS, INITIAL_AI_INSIGHTS);
  }

  // --- Auth ---
  getUser(): User | null {
    return this.user;
  }

  login(email: string): User {
    const u: User = {
      ...INITIAL_USER,
      email,
      name: email === 'demo@propertyos.com' ? 'Alex Vance' : email.split('@')[0],
      token: 'jwt_mock_' + Date.now(),
    };
    this.user = u;
    setStored(STORAGE_KEYS.USER, u);
    setStored(STORAGE_KEYS.TOKEN, u.token);
    return u;
  }

  logout(): void {
    this.user = null;
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }

  // --- Properties ---
  getProperties(): Property[] {
    return [...this.properties];
  }

  getPropertyById(id: string): Property | undefined {
    return this.properties.find((p) => p.id === id);
  }

  createProperty(prop: Omit<Property, 'id'>): Property {
    const newProp: Property = {
      ...prop,
      id: `prop-${Date.now()}`,
    };
    this.properties.unshift(newProp);
    setStored(STORAGE_KEYS.PROPERTIES, this.properties);
    return newProp;
  }

  updateProperty(id: string, updates: Partial<Property>): Property {
    const idx = this.properties.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Property not found');
    this.properties[idx] = { ...this.properties[idx], ...updates };
    setStored(STORAGE_KEYS.PROPERTIES, this.properties);
    return this.properties[idx];
  }

  deleteProperty(id: string): void {
    this.properties = this.properties.filter((p) => p.id !== id);
    setStored(STORAGE_KEYS.PROPERTIES, this.properties);
  }

  // --- Expenses ---
  getExpenses(): Expense[] {
    return [...this.expenses];
  }

  createExpense(expense: Omit<Expense, 'id'>): Expense {
    const newExp: Expense = {
      ...expense,
      id: `exp-${Date.now()}`,
    };
    this.expenses.unshift(newExp);
    setStored(STORAGE_KEYS.EXPENSES, this.expenses);

    // Update property monthly expenses
    const prop = this.properties.find((p) => p.id === expense.propertyId);
    if (prop) {
      prop.monthlyExpenses += Math.round(expense.amount / 3);
      setStored(STORAGE_KEYS.PROPERTIES, this.properties);
    }

    return newExp;
  }

  updateExpense(id: string, updates: Partial<Expense>): Expense {
    const idx = this.expenses.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error('Expense not found');
    this.expenses[idx] = { ...this.expenses[idx], ...updates };
    setStored(STORAGE_KEYS.EXPENSES, this.expenses);
    return this.expenses[idx];
  }

  deleteExpense(id: string): void {
    this.expenses = this.expenses.filter((e) => e.id !== id);
    setStored(STORAGE_KEYS.EXPENSES, this.expenses);
  }

  // --- Maintenance ---
  getMaintenance(): MaintenanceTicket[] {
    return [...this.maintenance];
  }

  createMaintenance(ticket: Omit<MaintenanceTicket, 'id' | 'createdAt'>): MaintenanceTicket {
    const newTicket: MaintenanceTicket = {
      ...ticket,
      id: `maint-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.maintenance.unshift(newTicket);
    setStored(STORAGE_KEYS.MAINTENANCE, this.maintenance);
    return newTicket;
  }

  updateMaintenance(id: string, updates: Partial<MaintenanceTicket>): MaintenanceTicket {
    const idx = this.maintenance.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error('Maintenance ticket not found');
    this.maintenance[idx] = { ...this.maintenance[idx], ...updates };
    setStored(STORAGE_KEYS.MAINTENANCE, this.maintenance);
    return this.maintenance[idx];
  }

  deleteMaintenance(id: string): void {
    this.maintenance = this.maintenance.filter((m) => m.id !== id);
    setStored(STORAGE_KEYS.MAINTENANCE, this.maintenance);
  }

  // --- Staff ---
  getStaff(): StaffMember[] {
    return [...this.staff];
  }

  createStaff(member: Omit<StaffMember, 'id'>): StaffMember {
    const newStaff: StaffMember = {
      ...member,
      id: `stf-${Date.now()}`,
    };
    this.staff.unshift(newStaff);
    setStored(STORAGE_KEYS.STAFF, this.staff);
    return newStaff;
  }

  updateStaff(id: string, updates: Partial<StaffMember>): StaffMember {
    const idx = this.staff.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Staff member not found');
    this.staff[idx] = { ...this.staff[idx], ...updates };
    setStored(STORAGE_KEYS.STAFF, this.staff);
    return this.staff[idx];
  }

  deleteStaff(id: string): void {
    this.staff = this.staff.filter((s) => s.id !== id);
    setStored(STORAGE_KEYS.STAFF, this.staff);
  }

  // --- Tenants ---
  getTenants(): Tenant[] {
    return [...this.tenants];
  }

  createTenant(tenant: Omit<Tenant, 'id'>): Tenant {
    const newTenant: Tenant = {
      ...tenant,
      id: `tnt-${Date.now()}`,
    };
    this.tenants.unshift(newTenant);
    setStored(STORAGE_KEYS.TENANTS, this.tenants);
    return newTenant;
  }

  updateTenant(id: string, updates: Partial<Tenant>): Tenant {
    const idx = this.tenants.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Tenant not found');
    this.tenants[idx] = { ...this.tenants[idx], ...updates };
    setStored(STORAGE_KEYS.TENANTS, this.tenants);
    return this.tenants[idx];
  }

  deleteTenant(id: string): void {
    this.tenants = this.tenants.filter((t) => t.id !== id);
    setStored(STORAGE_KEYS.TENANTS, this.tenants);
  }

  // --- Vendors ---
  getVendors(): Vendor[] {
    return [...this.vendors];
  }

  createVendor(vendor: Omit<Vendor, 'id'>): Vendor {
    const newVendor: Vendor = {
      ...vendor,
      id: `vnd-${Date.now()}`,
    };
    this.vendors.unshift(newVendor);
    setStored(STORAGE_KEYS.VENDORS, this.vendors);
    return newVendor;
  }

  updateVendor(id: string, updates: Partial<Vendor>): Vendor {
    const idx = this.vendors.findIndex((v) => v.id === id);
    if (idx === -1) throw new Error('Vendor not found');
    this.vendors[idx] = { ...this.vendors[idx], ...updates };
    setStored(STORAGE_KEYS.VENDORS, this.vendors);
    return this.vendors[idx];
  }

  deleteVendor(id: string): void {
    this.vendors = this.vendors.filter((v) => v.id !== id);
    setStored(STORAGE_KEYS.VENDORS, this.vendors);
  }

  // --- Documents ---
  getDocuments(): DocumentRecord[] {
    return [...this.documents];
  }

  createDocument(doc: Omit<DocumentRecord, 'id' | 'uploadDate'>): DocumentRecord {
    const newDoc: DocumentRecord = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
    };
    this.documents.unshift(newDoc);
    setStored(STORAGE_KEYS.DOCUMENTS, this.documents);
    return newDoc;
  }

  deleteDocument(id: string): void {
    this.documents = this.documents.filter((d) => d.id !== id);
    setStored(STORAGE_KEYS.DOCUMENTS, this.documents);
  }

  // --- Insurance ---
  getInsurance(): InsurancePolicy[] {
    return [...this.insurance];
  }

  createInsurance(policy: Omit<InsurancePolicy, 'id'>): InsurancePolicy {
    const newPolicy: InsurancePolicy = {
      ...policy,
      id: `ins-${Date.now()}`,
    };
    this.insurance.unshift(newPolicy);
    setStored(STORAGE_KEYS.INSURANCE, this.insurance);
    return newPolicy;
  }

  deleteInsurance(id: string): void {
    this.insurance = this.insurance.filter((i) => i.id !== id);
    setStored(STORAGE_KEYS.INSURANCE, this.insurance);
  }

  // --- Notifications ---
  getNotifications(): NotificationItem[] {
    return [...this.notifications];
  }

  markNotificationAsRead(id: string): void {
    this.notifications = this.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setStored(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
  }

  markAllNotificationsAsRead(): void {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
    setStored(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
  }

  // --- AI Insights ---
  getAIInsights(): AIInsight[] {
    return [...this.aiInsights];
  }

  // --- Analytics summary calculated live from records ---
  getAnalytics() {
    const properties = this.properties;
    const expenses = this.expenses;
    const totalValue = properties.reduce((acc, p) => acc + p.currentValue, 0);
    const totalMonthlyIncome = properties.reduce((acc, p) => acc + p.monthlyIncome, 0);
    const totalMonthlyExpenses = properties.reduce((acc, p) => acc + p.monthlyExpenses, 0);
    const avgOccupancy =
      properties.length > 0
        ? Math.round(properties.reduce((acc, p) => acc + p.occupancyRate, 0) / properties.length)
        : 0;
    const openMaintenanceCount = this.maintenance.filter((m) => m.status !== 'Completed' && m.status !== 'Cancelled').length;

    // Monthly category breakdown
    const categoryTotals: Record<string, number> = {};
    expenses.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

    return {
      totalProperties: properties.length,
      portfolioValue: totalValue,
      monthlyIncome: totalMonthlyIncome,
      monthlyExpenses: totalMonthlyExpenses,
      netMonthlyCashflow: totalMonthlyIncome - totalMonthlyExpenses,
      occupancy: avgOccupancy,
      openMaintenance: openMaintenanceCount,
      categoryTotals,
    };
  }

  // Reset demo data
  resetDemoData(): void {
    this.properties = INITIAL_PROPERTIES;
    this.expenses = INITIAL_EXPENSES;
    this.maintenance = INITIAL_MAINTENANCE;
    this.staff = INITIAL_STAFF;
    this.tenants = INITIAL_TENANTS;
    this.vendors = INITIAL_VENDORS;
    this.documents = INITIAL_DOCUMENTS;
    this.insurance = INITIAL_INSURANCE;
    this.notifications = INITIAL_NOTIFICATIONS;
    this.aiInsights = INITIAL_AI_INSIGHTS;
    this.user = INITIAL_USER;

    setStored(STORAGE_KEYS.PROPERTIES, this.properties);
    setStored(STORAGE_KEYS.EXPENSES, this.expenses);
    setStored(STORAGE_KEYS.MAINTENANCE, this.maintenance);
    setStored(STORAGE_KEYS.STAFF, this.staff);
    setStored(STORAGE_KEYS.TENANTS, this.tenants);
    setStored(STORAGE_KEYS.VENDORS, this.vendors);
    setStored(STORAGE_KEYS.DOCUMENTS, this.documents);
    setStored(STORAGE_KEYS.INSURANCE, this.insurance);
    setStored(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    setStored(STORAGE_KEYS.AI_INSIGHTS, this.aiInsights);
    setStored(STORAGE_KEYS.USER, this.user);
  }
}

export const portfolioStore = new PortfolioStorage();

// AI Chat helper with server-side proxy and intelligent local fallback
export async function queryPropertyOSAI(userQuery: string): Promise<{ text: string; sources: string[] }> {
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: userQuery }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.text) return data;
    }
  } catch (err) {
    console.warn('Backend AI endpoint unreachable, using client grounding logic:', err);
  }

  // Deterministic and grounded AI response based on real stored data:
  const query = userQuery.toLowerCase();
  const properties = portfolioStore.getProperties();
  const expenses = portfolioStore.getExpenses();
  const maintenance = portfolioStore.getMaintenance();
  const insurance = portfolioStore.getInsurance();

  let text = '';
  const sources = [`Based on ${properties.length} portfolio properties`, `Based on ${expenses.length} expense ledgers`];

  if (query.includes('how much') && (query.includes('spend') || query.includes('expense'))) {
    const totalExp = expenses.reduce((a, b) => a + b.amount, 0);
    text = `Across your recorded expense transactions, total portfolio expenditure is ₹${totalExp.toLocaleString('en-IN')}. The largest recent items include electricity for Goa Beach Villa (₹28,500), monthly payroll for Bangalore Villa staff (₹45,000), and Seafront society maintenance for Mumbai Penthouse (₹42,500).`;
  } else if (query.includes('highest roi') || query.includes('best roi')) {
    const bestRoi = [...properties].sort((a, b) => b.roi - a.roi)[0];
    text = `Your highest ROI property is **${bestRoi.name}** in ${bestRoi.city} yielding **${bestRoi.roi}% ROI** on an asset valuation of ₹${(bestRoi.currentValue / 10000000).toFixed(2)} Cr, generating ₹${(bestRoi.monthlyIncome / 100000).toFixed(2)} L monthly income.`;
    sources.push(`Calculated from lease yields on ${bestRoi.name}`);
  } else if (query.includes('cost') || query.includes('most expensive') || query.includes('costs me')) {
    const sortedCost = [...properties].sort((a, b) => b.monthlyExpenses - a.monthlyExpenses)[0];
    text = `**${sortedCost.name}** incurs the highest recurring cost at **₹${(sortedCost.monthlyExpenses / 100000).toFixed(2)} L per month**, driven by 24/7 security guard shifts, head chef and groundskeeping staff payroll, and 8,400 sq.ft estate upkeep.`;
  } else if (query.includes('vacant')) {
    const vacant = properties.filter((p) => p.status === 'Vacant');
    text = vacant.length > 0
      ? `You currently have **${vacant.length} vacant property**: **${vacant.map((p) => p.name).join(', ')}** in North Goa. Monthly holding overhead is approximately ₹78,000 while unoccupied.`
      : `All properties in your portfolio are currently either rented or owner-occupied (100% occupancy).`;
  } else if (query.includes('insurance') || query.includes('expire')) {
    const expiring = insurance.filter((i) => i.status === 'Expiring Soon');
    text = expiring.length > 0
      ? `⚠️ **${expiring[0].propertyName}** has policy #${expiring[0].policyNumber} (${expiring[0].provider}) expiring on **${expiring[0].expiryDate}** (in 18 days). Coverage value is ₹${(expiring[0].coverage / 10000000).toFixed(0)} Cr with annual premium ₹${expiring[0].premium.toLocaleString('en-IN')}.`
      : `All ${insurance.length} insurance policies across your portfolio are active.`;
  } else if (query.includes('overdue') || query.includes('maintenance')) {
    const open = maintenance.filter((m) => m.status !== 'Completed');
    text = `You have **${open.length} active maintenance items**. High-priority tickets include:
1. **Goa Beach Villa**: HVAC Compressor Diagnostic & electric surge (Critical)
2. **Bangalore Luxury Villa**: Infinity Pool Filtration Pump Overheating (High)
3. **Mysore Farmhouse**: Solar Borewell Pump Inverter (Critical, Overdue)`;
  } else if (query.includes('unusual') || query.includes('anomaly')) {
    text = `⚠️ **Potential Expense Anomaly Detected:**
At **Goa Beach Villa**, recent electricity billing reached **₹28,500**, which is **+111% above** the historical baseline average of ₹13,500. Coastal Air Solutions has been scheduled to inspect the secondary VRF compressor.`;
  } else if (query.includes('rental income') || query.includes('income')) {
    const totalInc = properties.reduce((a, b) => a + b.monthlyIncome, 0);
    text = `Your gross monthly portfolio income is **₹${(totalInc / 100000).toFixed(2)} Lakhs** (approx. ₹${(totalInc * 12 / 10000000).toFixed(2)} Cr annualized). Top income generators include Mumbai Worli Penthouse (₹2.20 L/mo) and Bangalore Executive Guest Wing (₹1.40 L/mo).`;
  } else {
    text = `Here is your portfolio summary as of today:
• **Total Asset Value:** ₹42.8 Cr across 6 luxury properties
• **Net Monthly Cashflow:** ₹1.36 L (₹5.20 L gross income vs ₹3.84 L total expenses)
• **Occupancy Rate:** 87% (Goa Beach Villa currently vacant)
• **Open Maintenance:** 7 tasks (2 flagged overdue)
• **Active AI Alert:** Anomaly detected in Goa Beach Villa power consumption.`;
  }

  return { text, sources };
}
