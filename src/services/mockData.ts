import { User, InventoryItem, Package, ProductionRequest, AuditLog, DashboardStats } from "../types";

// Mock Users
export const users: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@hielopolar.com",
    role: "admin",
    name: "Administrador",
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
  },
  {
    id: "2",
    username: "inventario",
    email: "inventario@hielopolar.com",
    role: "inventory",
    name: "Encargado de Inventario",
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
  },
  {
    id: "3",
    username: "produccion",
    email: "produccion@hielopolar.com",
    role: "production",
    name: "Supervisor de Producción",
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
  },
  {
    id: "4",
    username: "empaque",
    email: "empaque@hielopolar.com",
    role: "packaging",
    name: "Operario de Empaque",
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
  },
  {
    id: "5",
    username: "visor",
    email: "visor@hielopolar.com",
    role: "viewer",
    name: "Usuario de Reportes",
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
  },
];

// Mock Inventory Items
export const inventoryItems: InventoryItem[] = [
  {
    id: "i1",
    type: "bar",
    quantity: 1000, // piezas
    batchId: "B20240501-1",
    dateCreated: new Date("2024-05-01"),
    createdBy: "2",
    status: "available",
  },
  {
    id: "i2",
    type: "bag",
    quantity: 5000, // bolsas
    batchId: "BG20240501-1",
    dateCreated: new Date("2024-05-01"),
    createdBy: "2",
    status: "available",
  },
  {
    id: "i3",
    type: "bar",
    quantity: 800, // piezas
    batchId: "B20240502-1",
    dateCreated: new Date("2024-05-02"),
    createdBy: "2",
    status: "available",
  },
  {
    id: "i4",
    type: "bag",
    quantity: 3000, // bolsas
    batchId: "BG20240502-1",
    dateCreated: new Date("2024-05-02"),
    createdBy: "2",
    status: "available",
  },
];

// Mock Packages
export const packages: Package[] = [
  {
    id: "p1",
    batchCode: "PKG20240501-1",
    bagsCount: 150,
    dateCreated: new Date("2024-05-01"),
    createdBy: "2",
    status: "available",
  },
  {
    id: "p2",
    batchCode: "PKG20240501-2",
    bagsCount: 150,
    dateCreated: new Date("2024-05-01"),
    createdBy: "2",
    status: "available",
  },
  {
    id: "p3",
    batchCode: "PKG20240502-1",
    bagsCount: 150,
    dateCreated: new Date("2024-05-02"),
    createdBy: "2",
    status: "assigned",
  },
];

// Mock Production Requests
export const productionRequests: ProductionRequest[] = [
  {
    id: "r1",
    requestDate: new Date("2024-05-01"),
    requestBy: "3",
    status: "approved",
    items: [
      {
        type: "bar",
        quantity: 200, // piezas
        approvedQuantity: 200, // piezas
        inventoryItemIds: ["i1"],
      },
      {
        type: "package",
        quantity: 2, // paquetes
        approvedQuantity: 2, // paquetes
        inventoryItemIds: ["p1", "p2"],
      },
    ],
  },
  {
    id: "r2",
    requestDate: new Date("2024-05-02"),
    requestBy: "3",
    status: "pending",
    items: [
      {
        type: "bar",
        quantity: 300, // piezas
      },
      {
        type: "package",
        quantity: 1, // paquete
      },
    ],
  },
  {
    id: "r3",
    requestDate: new Date("2024-05-03"),
    requestBy: "3",
    status: "delivered",
    items: [
      {
        type: "bar",
        quantity: 150, // piezas
        approvedQuantity: 150, // piezas
        inventoryItemIds: ["i3"],
      },
    ],
  },
];

// Mock Audit Logs
export const auditLogs: AuditLog[] = [
  {
    id: "a1",
    action: "create",
    entityType: "inventory",
    entityId: "i1",
    date: new Date("2024-05-01T09:00:00"),
    performedBy: "2",
    details: "Ingreso de 1000 piezas de barras de hielo",
  },
  {
    id: "a2",
    action: "create",
    entityType: "inventory",
    entityId: "i2",
    date: new Date("2024-05-01T09:30:00"),
    performedBy: "2",
    details: "Ingreso de 5000 bolsas",
  },
  {
    id: "a3",
    action: "create",
    entityType: "package",
    entityId: "p1",
    date: new Date("2024-05-01T11:00:00"),
    performedBy: "2",
    details: "Creación de paquete de 150 bolsas",
  },
  {
    id: "a4",
    action: "update",
    entityType: "request",
    entityId: "r1",
    date: new Date("2024-05-01T14:00:00"),
    performedBy: "2",
    details: "Aprobación de solicitud de producción",
  },
];

// Mock Dashboard Stats
export const dashboardStats: DashboardStats = {
  currentInventory: {
    bars: 1650, // piezas
    bags: 7850, // bolsas
    packages: 3, // paquetes
  },
  dailyProduction: [
    {
      date: "2024-05-01",
      bars: 1000, // piezas
      bags: 5000, // bolsas
    },
    {
      date: "2024-05-02",
      bars: 800, // piezas
      bags: 3000, // bolsas
    },
    {
      date: "2024-05-03",
      bars: 750, // piezas
      bags: 3500, // bolsas
    },
    {
      date: "2024-05-04",
      bars: 900, // piezas
      bags: 4200, // bolsas
    },
    {
      date: "2024-05-05",
      bars: 820, // piezas
      bags: 3800, // bolsas
    },
  ],
  pendingRequests: 1,
  completedRequests: 2,
};
