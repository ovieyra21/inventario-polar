
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllBolsaProduction, BolsaProduction } from '@/services/bolsaProductionService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const BolsaProductionDashboard = () => {
  const [bolsas, setBolsas] = useState<BolsaProduction[]>([]);
  const [filter, setFilter] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadBolsaProduction();
  }, [filter]);

  const loadBolsaProduction = () => {
    const allBolsas = getAllBolsaProduction();
    const filtered = allBolsas.filter(
      bolsa => bolsa.fecha >= filter.startDate && bolsa.fecha <= filter.endDate
    );
    setBolsas(filtered);
  };

  const getTipoLabel = (tipo: string) => {
    switch(tipo) {
      case 'bolsa5kg': return 'Bolsa 5 kg';
      case 'bolsa3kg': return 'Bolsa 3 kg';
      case 'cubitostradicionales': return 'Cubitos Tradicionales';
      default: return tipo;
    }
  };

  const getTurnoLabel = (turno: string) => {
    switch(turno) {
      case 'matutino': return 'Matutino';
      case 'vespertino': return 'Vespertino';
      case 'nocturno': return 'Nocturno';
      default: return turno;
    }
  };

  // Calculate summary by type
  const summary = bolsas.reduce((acc, bolsa) => {
    acc[bolsa.tipo] = (acc[bolsa.tipo] || 0) + bolsa.cantidad;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Producción de Bolsas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(summary).map(([tipo, cantidad]) => (
              <Card key={tipo} className="bg-muted">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <h3 className="text-lg font-semibold">{getTipoLabel(tipo)}</h3>
                  <p className="text-3xl font-bold">{cantidad}</p>
                  <p className="text-sm text-muted-foreground">bolsas</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Histórico de Producción</CardTitle>
            <div className="flex items-center space-x-2">
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
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Fecha</th>
                  <th className="text-left p-2">Turno</th>
                  <th className="text-left p-2">Tipo</th>
                  <th className="text-right p-2">Cantidad</th>
                  <th className="text-left p-2">Responsable</th>
                  <th className="text-left p-2">Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {bolsas.length > 0 ? (
                  bolsas.map((bolsa) => (
                    <tr key={bolsa.id} className="border-b hover:bg-muted">
                      <td className="p-2">
                        {format(new Date(bolsa.fecha), 'dd MMM yyyy', { locale: es })}
                      </td>
                      <td className="p-2">{getTurnoLabel(bolsa.turno)}</td>
                      <td className="p-2">{getTipoLabel(bolsa.tipo)}</td>
                      <td className="p-2 text-right">{bolsa.cantidad}</td>
                      <td className="p-2">{bolsa.responsable}</td>
                      <td className="p-2">{bolsa.observaciones || '-'}</td>
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

export default BolsaProductionDashboard;
