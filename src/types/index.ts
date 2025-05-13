
export type UserRole = 'admin' | 'inventory' | 'production' | 'packaging' | 'viewer';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  name: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface InventoryItem {
  id: string;
  type: 'bar' | 'bag';
  quantity: number;
  batchId?: string;
  dateCreated: Date;
  createdBy: string;
  status: 'available' | 'assigned' | 'used';
}

export interface Package {
  id: string;
  batchCode: string;
  bagsCount: number;
  dateCreated: Date;
  createdBy: string;
  status: 'available' | 'assigned' | 'used';
}

export interface ProductionRequest {
  id: string;
  requestDate: Date;
  requestBy: string;
  status: 'pending' | 'approved' | 'delivered' | 'rejected';
  items: ProductionRequestItem[];
}

export interface ProductionRequestItem {
  type: 'bar' | 'package';
  quantity: number;
  approvedQuantity?: number;
  inventoryItemIds?: string[];
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: 'inventory' | 'package' | 'request' | 'user';
  entityId: string;
  date: Date;
  performedBy: string;
  details?: string;
}

export interface DashboardStats {
  currentInventory: {
    bars: number;
    bags: number;
    packages: number;
  };
  dailyProduction: {
    date: string;
    bars: number;
    bags: number;
  }[];
  pendingRequests: number;
  completedRequests: number;
}
