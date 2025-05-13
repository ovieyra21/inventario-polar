
import { v4 as uuidv4 } from 'uuid';
import { IceBar, MatrixPosition } from '@/types/iceBar';
import { getIceBarsStore, setIceBarsStore } from './dataStore';
import { calculateStatus } from './statusUtils';
import { BASKET_LETTERS } from './constants';

// Obtener todas las barras actualizando sus estados
export const getAllIceBars = async (): Promise<IceBar[]> => {
  const iceBars = getIceBarsStore();
  // Actualizar los estados de todas las barras según el tiempo transcurrido
  const updatedBars = iceBars.map(bar => {
    if (bar.status !== 'extracted') {
      const newStatus = calculateStatus(bar);
      
      // Si el estado ha cambiado a "listo", agregar notificación
      if (newStatus === 'ready' && bar.status !== 'ready' && bar.status !== 'delayed') {
        bar.notifications.push({
          id: uuidv4(),
          type: 'maturationComplete',
          time: new Date(),
          read: false
        });
      }
      
      return { ...bar, status: newStatus };
    }
    return bar;
  });
  
  setIceBarsStore(updatedBars);
  return updatedBars;
};

// Obtener una barra por ID
export const getIceBarById = async (barId: string): Promise<IceBar | null> => {
  const iceBars = getIceBarsStore();
  const bar = iceBars.find(bar => bar.id === barId);
  
  if (!bar) {
    return null;
  }
  
  // Actualizar el estado según el tiempo transcurrido
  const updatedBar = { ...bar, status: calculateStatus(bar) };
  
  return updatedBar;
};

// Obtener barras por posición (canasta y número)
export const getIceBarByPosition = async (position: MatrixPosition): Promise<IceBar | null> => {
  const iceBars = getIceBarsStore();
  const bar = iceBars.find(
    bar => 
      bar.basket === position.basket && 
      bar.barNumber === position.barNumber && 
      bar.status !== 'extracted'
  );
  
  if (!bar) {
    return null;
  }
  
  // Actualizar el estado según el tiempo transcurrido
  const updatedBar = { ...bar, status: calculateStatus(bar) };
  
  return updatedBar;
};

// Generar datos para la matriz completa
export const getMatrixData = async (): Promise<(IceBar | null)[][]> => {
  // Obtener todas las barras con estados actualizados
  const allBars = await getAllIceBars();
  
  // Crear matriz vacía
  const matrix: (IceBar | null)[][] = [];
  
  // Llenar la matriz con null inicialmente
  for (let i = 0; i < BASKET_LETTERS.length; i++) {
    matrix[i] = Array(16).fill(null);
  }
  
  // Llenar la matriz con barras existentes
  for (const bar of allBars) {
    if (bar.status !== 'extracted') {
      const basketIndex = BASKET_LETTERS.indexOf(bar.basket);
      if (basketIndex !== -1) {
        matrix[basketIndex][bar.barNumber - 1] = bar;
      }
    }
  }
  
  return matrix;
};

// Verificar si una posición está disponible
export const isPositionAvailable = async (position: MatrixPosition): Promise<boolean> => {
  const bar = await getIceBarByPosition(position);
  return bar === null;
};
