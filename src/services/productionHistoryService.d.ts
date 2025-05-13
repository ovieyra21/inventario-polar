declare module "services/productionHistoryService" {
  export interface ProductionHistoryEntry {
    date: string;
    volume: number;
  }

  export function fetchProductionHistory(): Promise<ProductionHistoryEntry[]>;
}
