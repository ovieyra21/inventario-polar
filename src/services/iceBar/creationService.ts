
import { v4 as uuidv4 } from 'uuid';
import { IceBar, IceBarFormData } from '@/types/iceBar';
import { getIceBarsStore, addIceBarToStore } from './dataStore';

// Crear una nueva barra de hielo
export const createIceBar = async (formData: IceBarFormData): Promise<IceBar[]> => {
  const { basket, barRange, type, operator } = formData;
  
  // Determinar los números de barra según el rango
  const startBar = barRange === 'first' ? 1 : 9;
  const endBar = barRange === 'first' ? 8 : 16;
  
  const newBars: IceBar[] = [];
  const iceBars = getIceBarsStore();
  
  // Crear barras para el rango completo
  for (let barNumber = startBar; barNumber <= endBar; barNumber++) {
    // Verificar si la barra ya existe
    const existingBar = iceBars.find(
      bar => bar.basket === basket && bar.barNumber === barNumber && bar.status !== 'extracted'
    );
    
    if (!existingBar) {
      const now = new Date();
      
      const newBar: IceBar = {
        id: uuidv4(),
        basket,
        barNumber,
        type,
        status: 'production',
        fillingTime: now,
        notifications: [],
      };
      
      // Si es una barra Premier, inicializar su proceso especial
      if (type === 'premier') {
        newBar.premierProcess = {
          operator,
          isCompleted: false,
        };
      }
      
      addIceBarToStore(newBar);
      newBars.push(newBar);
    }
  }
  
  return newBars;
};
