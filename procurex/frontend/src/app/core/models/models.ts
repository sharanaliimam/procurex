export interface Tender {
  _id?: string;
  tenderId: string;
  title: string;
  description?: string;
  category: 'Goods' | 'Works' | 'Services' | 'Consultancy';
  estimatedBudget: number;
  publicationDate: string;
  submissionDeadline: string;
  status: 'Draft' | 'Published' | 'Under Evaluation' | 'Awarded' | 'Closed';
  createdAt?: string;
}

export interface Vendor {
  _id?: string;
  vendorName: string;
  company: string;
  email: string;
  phone: string;
  businessCategory: 'Goods' | 'Works' | 'Services' | 'Consultancy';
  registrationDate?: string;
  status: 'Active' | 'Inactive' | 'Blacklisted';
}

export interface Bid {
  _id?: string;
  tender: string | Tender;
  vendor: string | Vendor;
  quotedAmount: number;
  submissionDate?: string;
  technicalScore?: number | null;
  financialScore?: number | null;
  overallScore?: number | null;
  status: 'Submitted' | 'Under Evaluation' | 'Approved' | 'Rejected';
}

export interface Evaluation {
  _id?: string;
  bid: string | Bid;
  tender: string | Tender;
  vendor: string | Vendor;
  technicalScore: number;
  financialScore: number;
  overallScore?: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  remarks?: string;
}

export interface ProcureDocument {
  _id?: string;
  tender: string | Tender;
  docType: string;
  fileName: string;
  originalName: string;
  filePath: string;
  uploadDate?: string;
}

export interface DashboardStats {
  totalTenders: number;
  activeTenders: number;
  completedTenders: number;
  registeredVendors: number;
  pendingEvaluations: number;
  totalProcurementValue: number;
  tendersByStatus: { status: string; count: number }[];
  recentTenders: Tender[];
  upcomingDeadlines: Tender[];
}

export interface AppNotification {
  type: 'warning' | 'success';
  message: string;
  date: string;
}

export interface ReportSummary {
  total: number;
  byStatus: { status: string; count: number }[];
  byCategory: { category: string; count: number }[];
  byMonth: { label: string; totalAmount: number; count: number }[];
}

export type UserRole = 'admin' | 'vendor';

export interface AuthUser {
  username: string;
  name: string;
  email: string;
  role: UserRole;
  vendorEmail?: string;
}
