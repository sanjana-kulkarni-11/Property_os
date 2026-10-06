export type PropertyType =
  | 'Villa'
  | 'Apartment'
  | 'House'
  | 'Farmhouse'
  | 'Commercial'
  | 'Office'
  | 'Land'
  | 'Vacation property';

export type PropertyStatus =
  | 'Owner Occupied'
  | 'Rented'
  | 'Vacant'
  | 'Under Maintenance';

export interface PropertySpecs {
  floors: number;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  parkingSpaces: number;
  yearBuilt: number;
  energyRating: string;
  architecturalStyle: string;
}

export interface Property {
  id: string;
  name: string;
  location: string;
  city: string;
  address: string;
  type: PropertyType;
  status: PropertyStatus;
  purchasePrice: number; // in INR
  purchaseDate: string;
  currentValue: number; // in INR
  monthlyIncome: number; // in INR
  monthlyExpenses: number; // in INR
  occupancyRate: number; // percentage (0 - 100)
  roi: number; // percentage
  image: string;
  gallery: string[];
  notes: string;
  specs: PropertySpecs;
  coordinates: {
    lat: number;
    lng: number;
  };
  features: string[];
}

export type ExpenseCategory =
  | 'Maintenance'
  | 'Electricity'
  | 'Water'
  | 'Internet'
  | 'Staff'
  | 'Security'
  | 'Insurance'
  | 'Property Tax'
  | 'Repairs'
  | 'Renovation'
  | 'Cleaning'
  | 'Landscaping'
  | 'Other';

export interface ExpenseAnomaly {
  isAnomaly: boolean;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  historicalAvg: number;
  currentAmount: number;
  diffPercent: number;
  explanation: string;
  recommendation: string;
}

export interface Expense {
  id: string;
  propertyId: string;
  propertyName: string;
  category: ExpenseCategory;
  amount: number;
  vendor: string;
  date: string;
  paymentMethod: 'Bank Wire' | 'Corporate Card' | 'Cheque' | 'UPI / Direct Debit';
  invoiceNumber: string;
  description: string;
  receipt?: string;
  createdBy: string;
  anomaly?: ExpenseAnomaly;
}

export type MaintenancePriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type MaintenanceStatus =
  | 'Reported'
  | 'Assigned'
  | 'In Progress'
  | 'Waiting'
  | 'Completed'
  | 'Cancelled';

export interface MaintenanceTicket {
  id: string;
  propertyId: string;
  propertyName: string;
  issue: string;
  description: string;
  category: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  assignedVendor: string;
  assignedStaff: string;
  estimatedCost: number;
  actualCost?: number;
  dueDate: string;
  createdAt: string;
  completedAt?: string;
  notes: string;
  photos: string[];
}

export type StaffRole =
  | 'Driver'
  | 'Cook'
  | 'Cleaner'
  | 'Security'
  | 'Gardener'
  | 'Caretaker'
  | 'Property Manager'
  | 'Other';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  phone: string;
  propertyId: string;
  propertyName: string;
  salary: number;
  joiningDate: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  emergencyContact: string;
  attendanceToday: 'Present' | 'Absent' | 'Leave';
  attendanceRate: number; // percentage
  avatar: string;
}

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  email: string;
  propertyId: string;
  propertyName: string;
  unit: string;
  leaseStart: string;
  leaseEnd: string;
  monthlyRent: number;
  securityDeposit: number;
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
  avatar?: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  phone: string;
  email: string;
  address: string;
  rating: number;
  services: string[];
  notes: string;
  jobsCompleted: number;
  totalSpending: number;
  averageInvoice: number;
  propertiesServed: string[];
}

export type DocumentCategory =
  | 'Sale deed'
  | 'Property agreement'
  | 'Insurance'
  | 'Tax'
  | 'Rental agreement'
  | 'Invoice'
  | 'Warranty'
  | 'Maintenance'
  | 'Identity'
  | 'Other';

export interface DocumentRecord {
  id: string;
  name: string;
  propertyId: string;
  propertyName: string;
  category: DocumentCategory;
  uploadDate: string;
  expiryDate?: string;
  description: string;
  fileSize: string;
  fileType: string;
  verified: boolean;
  docNumber?: string;
}

export interface InsurancePolicy {
  id: string;
  propertyId: string;
  propertyName: string;
  provider: string;
  policyNumber: string;
  coverage: number;
  premium: number;
  startDate: string;
  expiryDate: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
  documentName: string;
}

export type NotificationType =
  | 'Insurance expiry'
  | 'Document expiry'
  | 'Maintenance due'
  | 'Maintenance overdue'
  | 'Lease expiry'
  | 'Rent due'
  | 'Staff absence'
  | 'Expense anomaly'
  | 'AI insight';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  propertyName: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface AIInsight {
  id: string;
  category: 'FINANCIAL' | 'PROPERTY' | 'MAINTENANCE' | 'DOCUMENT' | 'EXPENSE';
  title: string;
  description: string;
  metricHighlight: string;
  confidence: number;
  recommendedAction: string;
  type: 'Data-based' | 'Calculated' | 'AI recommendation';
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  avatar: string;
  token?: string;
}
