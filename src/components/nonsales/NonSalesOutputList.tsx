
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNonSalesOutputsByDateRange, NonSalesOutput } from '@/services/nonSalesOutputService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const NonSalesOutputList = () => {
  const [outputs, setOutputs] = useState<NonSalesOutput[]>([]);
  const [filter, setFilter] = useState({
    motivo: 'all',
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadOutputs();
  }, [filter]);

  const loadOutputs = () => {
    const filtered = getNonSalesOutputsByDateRange(filter.startDate, filter.endDate);
    if (filter.motivo !== 'all') {
      setOutputs(filtered.filter(output => output.motivo === filter.motivo));
    } else {
      setOutputs(filtered);
    }
  };

  const getMotivoLabel = (motivo: string) => {
    switch(motivo) {
      case 'cortesía': return 'Cortesía';
      case 'uso_interno': return 'Uso interno';
      case 'pérdida': return 'Pérdida';
      case 'muestra': return 'Muestra';
      default: return motivo;
    }
  };

  const getTipoLabel = (tipo: string) => {
    if (tipo.includes('bolsa5kg')) return 'Bolsa 5 kg';
    if (tipo.includes('bolsa3kg')) return 'Bolsa 3 kg';
    if (tipo === 'cubitostradicionales') return 'Cubitos Tradicionales';
    return tipo;
  };

  // Calculate summary by motivo
  const summary = outputs.reduce((acc, output) => {
    acc[output.motivo] = (acc[output.motivo] || 0) + output.cantidad;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center flex-wrap gap-2">
            <CardTitle>Historial de Salidas (No Ventas)</CardTitle>
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <Select
                value={filter.motivo}
                onValueChange={(value) => setFilter({...filter, motivo: value})}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filtrar por motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los motivos</SelectItem>
                  <SelectItem value="cortesía">Cortesía</SelectItem>
                  <SelectItem value="uso_interno">Uso interno</SelectItem>
                  <SelectItem value="pérdida">Pérdida</SelectItem>
                  <SelectItem value="muestra">Muestra</SelectItem>
                </SelectContent>
              </Select>
              
              <input
                type="date"
                className="border rounded p-1"
                value={filter.startDate}
                onChange={(e) => setFilter({...filter, startDate: e.target.value})}
              />
              <span>a</span>
              <input
                type="date"
                className="border rounded p-1"
                value={filter.endDate}
                onChange={(e) => setFilter({...filter, endDate: e.target.value})}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {Object.entries(summary).map(([motivo, cantidad]) => (
              <Card key={motivo} className="bg-muted">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <h3 className="text-lg font-semibold">{getMotivoLabel(motivo)}</h3>
                  <p className="text-3xl font-bold">{cantidad}</p>
                  <p className="text-sm text-muted-foreground">unidades</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Fecha</th>
                  <th className="text-left p-2">Producto</th>
                  <th className="text-right p-2">Cantidad</th>
                  <th className="text-left p-2">Motivo</th>
                  <th className="text-left p-2">Responsable</th>
                  <th className="text-left p-2">Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {outputs.length > 0 ? (
                  outputs.map((output) => (
                    <tr key={output.id} className="border-b hover:bg-muted">
                      <td className="p-2">
                        {format(new Date(output.fecha), 'dd MMM yyyy', { locale: es })}
                      </td>
                      <td className="p-2">
                        <Badge variant="outline">
                          {getTipoLabel(output.tipo)}
                        </Badge>
                      </td>
                      <td className="p-2 text-right">{output.cantidad}</td>
                      <td className="p-2">
                        <Badge 
                          variant="secondary" 
                          className={
                            output.motivo === 'cortesía' ? 'bg-blue-100 text-blue-800' :
                            output.motivo === 'uso_interno' ? 'bg-green-100 text-green-800' :
                            output.motivo === 'pérdida' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                          }
                        >
                          {getMotivoLabel(output.motivo)}
                        </Badge>
                      </td>
                      <td className="p-2">{output.responsable}</td>
                      <td className="p-2">{output.observaciones || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-2 text-center">No hay registros para el período seleccionado</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NonSalesOutputList;
