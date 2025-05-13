
import { v4 as uuidv4 } from 'uuid';

// Types
export interface BolsaProduction {
  id: string;
  fecha: string;
  turno: 'matutino' | 'vespertino' | 'nocturno';
  tipo: 'bolsa5kg' | 'bolsa3kg' | 'cubitostradicionales';
  cantidad: number;
  responsable: string;
  observaciones?: string;
  estado: 'listo' | 'en_proceso';
}

// In-memory storage for bolsa production
const bolsasProduccion: BolsaProduction[] = [];

// Get all bolsa production records
export const getAllBolsaProduction = () => {
  return [...bolsasProduccion];
};

// Get bolsa production by date range
export const getBolsaProductionByDateRange = (startDate: string, endDate: string) => {
  return bolsasProduccion.filter(
    (bolsa) => bolsa.fecha >= startDate && bolsa.fecha <= endDate
  );
};

// Add new bolsa production record
export const addBolsaProduction = (bolsaData: Omit<BolsaProduction, 'id' | 'estado'>) => {
  const newBolsa: BolsaProduction = {
    id: uuidv4(),
    ...bolsaData,
    estado: 'listo' // Default to 'listo'
  };

  bolsasProduccion.push(newBolsa);
  
  // Update storage automatically
  import('./storageService').then(storageService => {
    storageService.addToStorage({
      tipo: bolsaData.tipo,
      cantidad: bolsaData.cantidad,
      fechaIngreso: bolsaData.fecha,
      origen: 'producción',
      observaciones: bolsaData.observaciones || ''
    });
  });
  
  return newBolsa;
};

// Get production statistics for dashboard
export const getBolsaProductionStats = () => {
  const today = new Date().toISOString().split('T')[0];
  
  const dailyProduction = bolsasProduccion.filter(bolsa => bolsa.fecha === today);
  
  const byTipo = dailyProduction.reduce((acc, curr) => {
    acc[curr.tipo] = (acc[curr.tipo] || 0) + curr.cantidad;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalToday: dailyProduction.reduce((sum, bolsa) => sum + bolsa.cantidad, 0),
    byTipo
  };
};
