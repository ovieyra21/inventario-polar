
import { IceBar } from '@/types/iceBar';

// Almacenamiento en memoria para desarrollo
// En producción, esto se conectaría a una base de datos
let iceBars: IceBar[] = [];

export const getIceBarsStore = (): IceBar[] => {
  return iceBars;
};

export const setIceBarsStore = (newBars: IceBar[]): void => {
  iceBars = newBars;
};

export const updateIceBarStore = (updatedBar: IceBar): void => {
  const barIndex = iceBars.findIndex(bar => bar.id === updatedBar.id);
  
  if (barIndex !== -1) {
    iceBars[barIndex] = updatedBar;
  }
};

export const addIceBarToStore = (iceBar: IceBar): void => {
  iceBars.push(iceBar);
};
