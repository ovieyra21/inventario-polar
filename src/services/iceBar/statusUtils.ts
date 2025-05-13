
import { IceBar, IceBarStatus } from '@/types/iceBar';
import { PRODUCTION_DURATION_MS, MATURATION_DURATION_MS, DELAYED_THRESHOLD_MS } from './constants';

// Función auxiliar para calcular el estado basado en el tiempo
export const calculateStatus = (bar: IceBar): IceBarStatus => {
  if (bar.extractionTime) {
    return 'extracted';
  }

  const now = new Date().getTime();
  const fillingTime = bar.fillingTime.getTime();
  const elapsedTime = now - fillingTime;

  if (elapsedTime < PRODUCTION_DURATION_MS) {
    return 'production';
  } else if (elapsedTime < MATURATION_DURATION_MS) {
    return 'maturation';
  } else {
    // Si ha pasado más de 1 hora después de la maduración, está retrasado
    return elapsedTime > MATURATION_DURATION_MS + DELAYED_THRESHOLD_MS ? 'delayed' : 'ready';
  }
};
