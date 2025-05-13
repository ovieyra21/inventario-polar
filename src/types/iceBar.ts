
export type IceBarType = 'standard' | 'premier';
export type IceBarStatus = 'production' | 'maturation' | 'ready' | 'delayed' | 'extracted';

export type PremierProcess = {
  extractorRemoved?: Date;
  extractorPlaced?: Date;
  operator?: string;
  isCompleted: boolean;
};

export interface IceBar {
  id: string;
  basket: string; // A-M
  barNumber: number; // 1-16
  type: IceBarType;
  status: IceBarStatus;
  fillingTime: Date;
  extractionTime?: Date;
  premierProcess?: PremierProcess;
  notifications: IceBarNotification[];
}

export interface IceBarNotification {
  id: string;
  type: 'maturationComplete' | 'premierStep' | 'delayed';
  time: Date;
  read: boolean;
}

export interface MatrixPosition {
  basket: string;
  barNumber: number;
}

export interface IceBarFormData {
  basket: string;
  barRange: 'first' | 'second'; // first: 1-8, second: 9-16
  type: IceBarType;
  operator: string;
}

export interface PremierStepData {
  step: 'extractorRemoved' | 'extractorPlaced';
  operator: string;
}
