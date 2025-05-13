
import React from 'react';
import { IceBar } from '@/types/iceBar';
import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getIceBarById, extractIceBar } from '@/services/iceBarService';
import { useToast } from '@/hooks/use-toast';

interface IceBarCellProps {
  iceBar: IceBar | null;
  basket: string;
  barNumber: number;
}

const IceBarCell: React.FC<IceBarCellProps> = ({ iceBar, basket, barNumber }) => {
  const { toast } = useToast();

  if (!iceBar) {
    return (
      <div className="w-12 h-12 flex items-center justify-center text-gray-300 text-xs">
        -
      </div>
    );
  }

  const handleExtractBar = async () => {
    try {
      if (iceBar) {
        await extractIceBar(iceBar.id);
        toast({
          title: "Barra extraída con éxito",
          description: `Barra ${iceBar.basket}-${iceBar.barNumber} marcada como extraída`,
        });
      }
    } catch (error) {
      console.error('Error extracting ice bar:', error);
      toast({
        title: "Error al extraer la barra",
        description: "No se pudo marcar la barra como extraída",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: IceBar['status']) => {
    switch (status) {
      case 'production':
        return 'bg-gradient-to-br from-blue-400 to-blue-600';
      case 'maturation':
        return 'bg-gradient-to-br from-yellow-400 to-yellow-600';
      case 'ready':
        return 'bg-gradient-to-br from-green-400 to-green-600';
      case 'delayed':
        return 'bg-gradient-to-br from-red-400 to-red-600';
      default:
        return 'bg-gray-200';
    }
  };

  const getStatusEmoji = (status: IceBar['status']) => {
    switch (status) {
      case 'production':
        return '🔵';
      case 'maturation':
        return '🟡';
      case 'ready':
        return '🟢';
      case 'delayed':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const getStatusText = (status: IceBar['status']) => {
    switch (status) {
      case 'production':
        return 'En producción';
      case 'maturation':
        return 'En maduración';
      case 'ready':
        return 'Lista para extraer';
      case 'delayed':
        return 'Retrasada';
      default:
        return 'Desconocido';
    }
  };

  const formatElapsedTime = (date: Date) => {
    return formatDistance(new Date(), date, { addSuffix: true, locale: es });
  };

  const isPremier = iceBar.type === 'premier';
  const statusClass = getStatusColor(iceBar.status);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`w-12 h-12 ${statusClass} rounded flex items-center justify-center cursor-pointer transition-transform hover:scale-105 ${isPremier ? 'ring-2 ring-purple-500' : ''}`}
            onClick={iceBar.status === 'ready' || iceBar.status === 'delayed' ? handleExtractBar : undefined}
          >
            <span className="text-white font-bold">
              {isPremier ? '★' : ''}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <div className="p-1 space-y-2">
            <div className="font-bold flex gap-2 items-center">
              {getStatusEmoji(iceBar.status)} {basket}-{barNumber} 
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200">
                {isPremier ? 'Premier' : 'Estándar'}
              </span>
            </div>
            <div className="text-sm">
              <p>Estado: <span className="font-medium">{getStatusText(iceBar.status)}</span></p>
              <p>Llenado: <span className="font-medium">{iceBar.fillingTime.toLocaleString()}</span></p>
              <p>Tiempo: <span className="font-medium">{formatElapsedTime(iceBar.fillingTime)}</span></p>
              
              {isPremier && iceBar.premierProcess && (
                <div className="mt-1 pt-1 border-t border-dashed border-gray-200">
                  <p className="font-medium">Proceso Premier:</p>
                  <ul className="text-xs space-y-1">
                    <li className="flex items-center gap-1">
                      {iceBar.premierProcess.extractorRemoved ? '✅' : '⬜'} 
                      Extractor removido
                    </li>
                    <li className="flex items-center gap-1">
                      {iceBar.premierProcess.extractorPlaced ? '✅' : '⬜'} 
                      Extractor colocado
                    </li>
                    {iceBar.premierProcess.operator && (
                      <li>Operador: {iceBar.premierProcess.operator}</li>
                    )}
                  </ul>
                </div>
              )}
              
              {(iceBar.status === 'ready' || iceBar.status === 'delayed') && (
                <p className="text-xs mt-2 italic text-gray-500">Click para extraer</p>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default IceBarCell;
