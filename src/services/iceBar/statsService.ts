
import { getIceBarsStore } from './dataStore';
import { getAllIceBars } from './queryService';

// Obtener estadísticas para el dashboard
export const getIceBarStats = async (): Promise<{
  production: number;
  maturation: number;
  ready: number;
  delayed: number;
  extracted24h: number;
}> => {
  const allBars = await getAllIceBars();
  
  const now = new Date().getTime();
  const last24h = now - (24 * 60 * 60 * 1000);
  
  return {
    production: allBars.filter(bar => bar.status === 'production').length,
    maturation: allBars.filter(bar => bar.status === 'maturation').length,
    ready: allBars.filter(bar => bar.status === 'ready').length,
    delayed: allBars.filter(bar => bar.status === 'delayed').length,
    extracted24h: allBars.filter(
      bar => bar.status === 'extracted' && 
      bar.extractionTime && 
      bar.extractionTime.getTime() > last24h
    ).length
  };
};

// Obtener datos de consumo por área
export const getConsumptionByArea = async (year?: number): Promise<{ name: string; value: number }[]> => {
  const allBars = getIceBarsStore();
  
  // Determinar el año a filtrar (si no se proporciona, usar el año actual)
  const filterYear = year || new Date().getFullYear();
  const startDate = new Date(filterYear, 0, 1); // 1 de enero del año especificado
  const endDate = new Date(filterYear, 11, 31, 23, 59, 59); // 31 de diciembre del año especificado
  
  // Agrupar barras extraídas por área (usando la letra de la canasta como área)
  const areaMap: Record<string, number> = {};
  
  allBars.forEach(bar => {
    if (
      bar.status === 'extracted' && 
      bar.extractionTime && 
      bar.extractionTime >= startDate &&
      bar.extractionTime <= endDate
    ) {
      // Determinar el área basado en la letra de la canasta
      // A-C: Área 1, D-F: Área 2, G-I: Área 3, J-M: Área 4
      let areaName = 'Área 1';
      
      if (bar.basket >= 'D' && bar.basket <= 'F') {
        areaName = 'Área 2';
      } else if (bar.basket >= 'G' && bar.basket <= 'I') {
        areaName = 'Área 3';
      } else if (bar.basket >= 'J') {
        areaName = 'Área 4';
      }
      
      areaMap[areaName] = (areaMap[areaName] || 0) + 1;
    }
  });
  
  // Si no hay datos de consumo para el año seleccionado, usar datos de ejemplo diferenciados por año
  if (Object.keys(areaMap).length === 0) {
    // Datos de ejemplo basados en el año para demostración
    if (filterYear === new Date().getFullYear()) {
      return [
        { name: "Área 1", value: 45 },
        { name: "Área 2", value: 25 },
        { name: "Área 3", value: 20 },
        { name: "Área 4", value: 10 }
      ];
    } else if (filterYear === new Date().getFullYear() - 1) {
      return [
        { name: "Área 1", value: 38 },
        { name: "Área 2", value: 32 },
        { name: "Área 3", value: 18 },
        { name: "Área 4", value: 12 }
      ];
    } else if (filterYear === new Date().getFullYear() - 2) {
      return [
        { name: "Área 1", value: 30 },
        { name: "Área 2", value: 30 },
        { name: "Área 3", value: 25 },
        { name: "Área 4", value: 15 }
      ];
    } else {
      return [
        { name: "Área 1", value: 25 },
        { name: "Área 2", value: 25 },
        { name: "Área 3", value: 30 },
        { name: "Área 4", value: 20 }
      ];
    }
  }
  
  // Convertir el mapa a un array de objetos
  return Object.entries(areaMap).map(([name, value]) => ({
    name,
    value
  }));
};
