
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { IceBar, PremierStepData } from '@/types/iceBar';
import { updatePremierStep } from '@/services/iceBarService';
import { Clock, AlertCircle, CheckCircle2, User } from "lucide-react";
import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';

interface PremierProcessManagerProps {
  iceBar: IceBar;
  onUpdate?: () => void;
}

const PremierProcessManager: React.FC<PremierProcessManagerProps> = ({ iceBar, onUpdate }) => {
  const { toast } = useToast();
  const [operator, setOperator] = useState(iceBar.premierProcess?.operator || '');
  const [loading, setLoading] = useState(false);

  if (!iceBar.premierProcess) {
    return null;
  }

  const processIsComplete = iceBar.premierProcess.isCompleted;
  const hasExtractorRemoved = !!iceBar.premierProcess.extractorRemoved;
  const hasExtractorPlaced = !!iceBar.premierProcess.extractorPlaced;

  const handleUpdateStep = async (step: 'extractorRemoved' | 'extractorPlaced') => {
    if (!operator) {
      toast({
        title: "Error",
        description: "Debe ingresar el nombre del operario",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const stepData: PremierStepData = {
        step,
        operator,
      };

      const updatedBar = await updatePremierStep(iceBar.id, stepData);

      if (updatedBar) {
        toast({
          title: "Paso actualizado",
          description: `Paso "${step === 'extractorRemoved' ? 'Extractor removido' : 'Extractor colocado'}" registrado correctamente.`,
        });

        // Si ambos pasos están completos
        if (step === 'extractorPlaced' && hasExtractorRemoved) {
          toast({
            title: "Proceso Premier completo",
            description: "Todos los pasos del proceso Premier han sido completados.",
          });
        }

        if (onUpdate) {
          onUpdate();
        }
      }
    } catch (error) {
      console.error('Error updating Premier step:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el paso del proceso Premier.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="text-lg text-purple-900 flex items-center">
          <span className="mr-2">⭐</span> Proceso Premier - Barra {iceBar.basket}-{iceBar.barNumber}
        </CardTitle>
        <CardDescription>
          Complete los pasos especiales para el hielo Premier
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white/80 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-sm text-gray-700">Tiempo transcurrido:</span>
            </div>
            <span className="font-medium text-sm">
              {formatDistance(new Date(), iceBar.fillingTime, { locale: es })}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-sm text-gray-700">Operario:</span>
            </div>
            <div className="flex-1 max-w-[200px]">
              <Input 
                type="text" 
                value={operator} 
                onChange={(e) => setOperator(e.target.value)} 
                placeholder="Nombre del operario"
                className="h-8 text-sm"
                disabled={loading || processIsComplete}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className={`rounded-lg p-4 relative overflow-hidden ${
            hasExtractorRemoved 
              ? 'bg-green-100 border border-green-300' 
              : 'bg-gray-100 border border-gray-300'
          }`}>
            <div className="flex items-start gap-3">
              {hasExtractorRemoved 
                ? <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" /> 
                : <AlertCircle className="h-5 w-5 text-gray-600 shrink-0" />
              }
              <div>
                <h4 className="font-medium">Paso 1: Quitar extractor de aire</h4>
                {hasExtractorRemoved ? (
                  <p className="text-sm mt-1">
                    Completado: {iceBar.premierProcess.extractorRemoved.toLocaleString()}
                    <br />
                    <span className="text-xs text-gray-600">
                      Operario: {iceBar.premierProcess.operator}
                    </span>
                  </p>
                ) : (
                  <p className="text-sm mt-1">Este paso debe completarse antes de continuar.</p>
                )}
              </div>
            </div>
            
            {!hasExtractorRemoved && !processIsComplete && (
              <Button 
                onClick={() => handleUpdateStep('extractorRemoved')} 
                className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                Marcar como completado
              </Button>
            )}
          </div>
          
          <div className={`rounded-lg p-4 relative overflow-hidden ${
            hasExtractorPlaced 
              ? 'bg-green-100 border border-green-300' 
              : 'bg-gray-100 border border-gray-300'
          } ${!hasExtractorRemoved && !hasExtractorPlaced ? 'opacity-60' : ''}`}>
            <div className="flex items-start gap-3">
              {hasExtractorPlaced 
                ? <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" /> 
                : <AlertCircle className="h-5 w-5 text-gray-600 shrink-0" />
              }
              <div>
                <h4 className="font-medium">Paso 2: Colocar extractor de aire</h4>
                {hasExtractorPlaced ? (
                  <p className="text-sm mt-1">
                    Completado: {iceBar.premierProcess.extractorPlaced.toLocaleString()}
                    <br />
                    <span className="text-xs text-gray-600">
                      Operario: {iceBar.premierProcess.operator}
                    </span>
                  </p>
                ) : (
                  <p className="text-sm mt-1">
                    {hasExtractorRemoved 
                      ? 'Complete este paso después de la preparación.' 
                      : 'Debe completar el Paso 1 primero.'}
                  </p>
                )}
              </div>
            </div>
            
            {hasExtractorRemoved && !hasExtractorPlaced && !processIsComplete && (
              <Button 
                onClick={() => handleUpdateStep('extractorPlaced')} 
                className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
                disabled={loading || !hasExtractorRemoved}
              >
                Marcar como completado
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      
      {processIsComplete && (
        <CardFooter className="bg-green-50 border-t border-green-200">
          <div className="w-full text-center text-green-800">
            <CheckCircle2 className="h-5 w-5 inline-block mr-2" />
            Proceso Premier completado correctamente
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default PremierProcessManager;
