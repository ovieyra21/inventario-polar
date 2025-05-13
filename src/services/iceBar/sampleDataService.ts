
import { v4 as uuidv4 } from 'uuid';
import { IceBar } from '@/types/iceBar';
import { setIceBarsStore } from './dataStore';
import { getAllIceBars } from './queryService';

// Cargar datos iniciales de ejemplo (para desarrollo)
export const loadSampleData = async (): Promise<void> => {
  const now = new Date();
  
  // Crear algunas barras en diferentes estados
  const sampleBars: IceBar[] = [
    // Barras en producción (recién creadas)
    {
      id: uuidv4(),
      basket: 'A',
      barNumber: 1,
      type: 'standard',
      status: 'production',
      fillingTime: new Date(now.getTime() - (1 * 60 * 60 * 1000)), // 1 hora atrás
      notifications: []
    },
    {
      id: uuidv4(),
      basket: 'A',
      barNumber: 2,
      type: 'standard',
      status: 'production',
      fillingTime: new Date(now.getTime() - (1 * 60 * 60 * 1000)), // 1 hora atrás
      notifications: []
    },
    
    // Barras en maduración
    {
      id: uuidv4(),
      basket: 'B',
      barNumber: 5,
      type: 'standard',
      status: 'maturation',
      fillingTime: new Date(now.getTime() - (12 * 60 * 60 * 1000)), // 12 horas atrás
      notifications: []
    },
    
    // Barras listas
    {
      id: uuidv4(),
      basket: 'C',
      barNumber: 3,
      type: 'standard',
      status: 'ready',
      fillingTime: new Date(now.getTime() - (25 * 60 * 60 * 1000)), // 25 horas atrás
      notifications: [
        {
          id: uuidv4(),
          type: 'maturationComplete',
          time: new Date(now.getTime() - (1 * 60 * 60 * 1000)),
          read: false
        }
      ]
    },
    
    // Barras premier
    {
      id: uuidv4(),
      basket: 'M',
      barNumber: 2,
      type: 'premier',
      status: 'production',
      fillingTime: new Date(now.getTime() - (30 * 60 * 1000)), // 30 minutos atrás
      premierProcess: {
        extractorRemoved: new Date(now.getTime() - (45 * 60 * 1000)),
        operator: 'Juan Pérez',
        isCompleted: false
      },
      notifications: []
    }
  ];
  
  setIceBarsStore(sampleBars);
  
  // Actualizar estados
  await getAllIceBars();
};
