
import { IceBar } from '@/types/iceBar';
import { getIceBarsStore, updateIceBarStore } from './dataStore';

// Marcar una barra como extraída
export const extractIceBar = async (barId: string): Promise<IceBar | null> => {
  const iceBars = getIceBarsStore();
  const barIndex = iceBars.findIndex(bar => bar.id === barId);
  
  if (barIndex === -1) {
    return null;
  }
  
  const bar = { ...iceBars[barIndex] };
  bar.status = 'extracted';
  bar.extractionTime = new Date();
  
  updateIceBarStore(bar);
  
  return bar;
};
