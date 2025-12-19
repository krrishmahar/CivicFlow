export enum IssueCategory {
  POTHOLE = 'pothole',
  GARBAGE = 'garbage',
  STREETLIGHT = 'streetlight',
  WATER_LEAK = 'water_leak',
  DRAINAGE = 'drainage',
  ROAD_DAMAGE = 'road_damage',
  OTHER = 'other',
}

export enum IssuePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum IssueStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

export interface Issue {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: IssueCategory;
  priority: IssuePriority;
  status: IssueStatus;
  latitude: number;
  longitude: number;
  address?: string; // ✅ Optional
  imageUrls: string[];
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  isActive: boolean;
}

export interface CreateIssueData {
  userId: string;
  title: string;
  description: string;
  category: IssueCategory;
  latitude: number;
  longitude: number;
  address?: string; // ✅ Optional
  imageUrls?: string[]; // ✅ Optional
}

export interface UpdateIssueData {
  status?: IssueStatus;
  priority?: IssuePriority;
  assignedTo?: string;
  resolvedAt?: string;
}

export interface IssueFilters {
  status?: IssueStatus;
  category?: IssueCategory;
  userId?: string;
  limit?: number;
  offset?: number;
}

export interface Hotspot {
  id: string;
  centerLat: number;
  centerLng: number;
  radiusMeters: number;
  issueCount: number;
  category: IssueCategory;
  issueIds: string[];
  createdAt: string;
}
