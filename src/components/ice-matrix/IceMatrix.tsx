
import React, { useState, useEffect } from 'react';
import { getMatrixData } from '@/services/iceBarService';
import { IceBar } from '@/types/iceBar';
import IceBarCell from './IceBarCell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BASKETS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
const BAR_NUMBERS = Array.from({ length: 16 }, (_, i) => i + 1);

export const IceMatrix: React.FC = () => {
  const [matrix, setMatrix] = useState<(IceBar | null)[][]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'production' | 'maturation' | 'ready' | 'delayed'>('all');

  useEffect(() => {
    const fetchMatrix = async () => {
      setLoading(true);
      try {
        const matrixData = await getMatrixData();
        setMatrix(matrixData);
      } catch (error) {
        console.error('Error fetching matrix data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatrix();
    
    // Refrescar datos cada minuto para actualizar estados
    const interval = setInterval(fetchMatrix, 60000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <CardContent>
          <div className="animate-pulse">Cargando matriz de producción...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-x-auto">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between">
          <CardTitle className="text-2xl font-bold">Matriz de Producción</CardTitle>
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-full ${filter === 'all' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80'}`}
            >
              Todas
            </button>
            <button 
              onClick={() => setFilter('production')}
              className={`px-3 py-1 text-sm rounded-full ${filter === 'production' 
                ? 'bg-blue-500 text-white' 
                : 'bg-muted hover:bg-blue-100'}`}
            >
              En Producción
            </button>
            <button 
              onClick={() => setFilter('maturation')}
              className={`px-3 py-1 text-sm rounded-full ${filter === 'maturation' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-muted hover:bg-yellow-100'}`}
            >
              En Maduración
            </button>
            <button 
              onClick={() => setFilter('ready')}
              className={`px-3 py-1 text-sm rounded-full ${filter === 'ready' 
                ? 'bg-green-500 text-white' 
                : 'bg-muted hover:bg-green-100'}`}
            >
              Listas
            </button>
            <button 
              onClick={() => setFilter('delayed')}
              className={`px-3 py-1 text-sm rounded-full ${filter === 'delayed' 
                ? 'bg-red-500 text-white' 
                : 'bg-muted hover:bg-red-100'}`}
            >
              Retrasadas
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="ice-matrix w-full overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border font-bold bg-muted/50">Canastilla</th>
                {BAR_NUMBERS.map(num => (
                  <th key={num} className="p-2 border text-center font-bold bg-muted/50 w-12">
                    {num}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BASKETS.map((basket, rowIndex) => (
                <tr key={basket}>
                  <td className={`p-2 border text-center font-bold ${basket === 'M' ? 'bg-purple-100' : 'bg-muted/30'}`}>
                    {basket}
                  </td>
                  {BAR_NUMBERS.map(barNumber => {
                    const iceBar = matrix[rowIndex]?.[barNumber - 1] || null;
                    
                    // Aplicar filtro
                    if (filter !== 'all' && iceBar && iceBar.status !== filter) {
                      return (
                        <td key={barNumber} className="p-0 border bg-gray-50">
                          <div className="w-12 h-12"></div>
                        </td>
                      );
                    }
                    
                    return (
                      <td key={barNumber} className="p-0 border">
                        <IceBarCell 
                          iceBar={iceBar} 
                          basket={basket} 
                          barNumber={barNumber} 
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default IceMatrix;
