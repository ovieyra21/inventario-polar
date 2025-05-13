
import { IceBar, PremierStepData } from '@/types/iceBar';
import { getIceBarsStore, updateIceBarStore } from './dataStore';

// Actualizar un paso del proceso Premier
export const updatePremierStep = async (barId: string, stepData: PremierStepData): Promise<IceBar | null> => {
  const iceBars = getIceBarsStore();
  const barIndex = iceBars.findIndex(bar => bar.id === barId);
  
  if (barIndex === -1) {
    return null;
  }
  
  const bar = { ...iceBars[barIndex] };
  
  if (bar.type !== 'premier' || !bar.premierProcess) {
    return null;
  }
  
  const now = new Date();
  
  // Actualizar el paso correspondiente
  if (stepData.step === 'extractorRemoved') {
    bar.premierProcess.extractorRemoved = now;
    bar.premierProcess.operator = stepData.operator;
  } else if (stepData.step === 'extractorPlaced') {
    bar.premierProcess.extractorPlaced = now;
    bar.premierProcess.operator = stepData.operator;
  }
  
  // Verificar si el proceso está completo
  if (bar.premierProcess.extractorRemoved && bar.premierProcess.extractorPlaced) {
    bar.premierProcess.isCompleted = true;
  }
  
  updateIceBarStore(bar);
  
  return bar;
};
