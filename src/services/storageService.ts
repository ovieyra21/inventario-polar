
import { v4 as uuidv4 } from 'uuid';

export interface StorageItem {
  id: string;
  tipo: string;
  cantidad: number;
  unidad: 'bolsas' | 'kg' | 'barras';
  fechaIngreso: string;
  origen: 'producción' | 'ajuste' | 'devolución';
  observaciones: string;
}

// In-memory storage for inventory
const almacen: StorageItem[] = [];

// Get all items in storage
export const getAllStorage = () => {
  return [...almacen];
};

// Get storage by item type
export const getStorageByType = (tipo: string) => {
  return almacen.filter(item => item.tipo === tipo);
};

// Get total quantity by type
export const getTotalQuantityByType = (tipo: string) => {
  return almacen
    .filter(item => item.tipo === tipo)
    .reduce((sum, item) => sum + item.cantidad, 0);
};

// Add item to storage
export const addToStorage = (itemData: Omit<StorageItem, 'id' | 'unidad'>) => {
  const newItem: StorageItem = {
    id: uuidv4(),
    ...itemData,
    unidad: determineUnit(itemData.tipo)
  };
  
  almacen.push(newItem);
  return newItem;
};

// Determine the unit based on item type
const determineUnit = (tipo: string): 'bolsas' | 'kg' | 'barras' => {
  if (tipo.startsWith('bolsa') || tipo === 'cubitostradicionales') {
    return 'bolsas';
  } else if (tipo.includes('barra')) {
    return 'barras';
  } else {
    return 'kg';
  }
};

// Remove from storage (for sales or non-sales outputs)
export const removeFromStorage = (tipo: string, cantidad: number, motivo: string) => {
  // Check if we have enough in storage
  const available = getTotalQuantityByType(tipo);
  if (available < cantidad) {
    throw new Error(`Inventario insuficiente: ${available} ${determineUnit(tipo)} disponibles`);
  }
  
  // Find items to reduce, starting with oldest
  const itemsToReduce = [...almacen]
    .filter(item => item.tipo === tipo)
    .sort((a, b) => a.fechaIngreso.localeCompare(b.fechaIngreso));
  
  let remainingToRemove = cantidad;
  
  for (const item of itemsToReduce) {
    if (remainingToRemove <= 0) break;
    
    if (item.cantidad <= remainingToRemove) {
      // Remove entire item
      remainingToRemove -= item.cantidad;
      const index = almacen.findIndex(i => i.id === item.id);
      almacen.splice(index, 1);
    } else {
      // Reduce item quantity
      item.cantidad -= remainingToRemove;
      remainingToRemove = 0;
    }
  }
  
  return true;
};
