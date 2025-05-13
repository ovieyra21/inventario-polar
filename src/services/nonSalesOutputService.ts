
import { v4 as uuidv4 } from 'uuid';
import { removeFromStorage } from './storageService';

export interface NonSalesOutput {
  id: string;
  fecha: string;
  tipo: string; // Type of product
  cantidad: number;
  motivo: 'cortesía' | 'uso_interno' | 'pérdida' | 'muestra';
  responsable: string;
  observaciones?: string;
}

// In-memory storage for non-sales outputs
const salidasNoVentas: NonSalesOutput[] = [];

// Get all non-sales outputs
export const getAllNonSalesOutputs = () => {
  return [...salidasNoVentas];
};

// Get outputs by date range
export const getNonSalesOutputsByDateRange = (startDate: string, endDate: string) => {
  return salidasNoVentas.filter(
    (salida) => salida.fecha >= startDate && salida.fecha <= endDate
  );
};

// Add new non-sales output
export const addNonSalesOutput = (salidaData: Omit<NonSalesOutput, 'id'>) => {
  try {
    // First, remove from storage
    removeFromStorage(salidaData.tipo, salidaData.cantidad, salidaData.motivo);
    
    // Then register the output
    const newSalida: NonSalesOutput = {
      id: uuidv4(),
      ...salidaData
    };
    
    salidasNoVentas.push(newSalida);
    return newSalida;
  } catch (error) {
    throw error;
  }
};

// Get output statistics
export const getNonSalesOutputStats = () => {
  return salidasNoVentas.reduce((acc, curr) => {
    acc[curr.motivo] = (acc[curr.motivo] || 0) + curr.cantidad;
    return acc;
  }, {} as Record<string, number>);
};
