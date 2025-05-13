
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllStorage, StorageItem } from '@/services/storageService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const StorageDashboard = () => {
  const [items, setItems] = useState<StorageItem[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadStorage();
  }, [filter]);

  const loadStorage = () => {
    const allItems = getAllStorage();
    if (filter === 'all') {
      setItems(allItems);
    } else {
      setItems(allItems.filter(item => {
        if (filter === 'bolsas') return item.tipo.includes('bolsa') || item.tipo === 'cubitostradicionales';
        if (filter === 'barras') return item.tipo.includes('barra');
        return item.tipo === filter;
      }));
    }
  };

  // Calculate storage summary
  const summary = items.reduce((acc, item) => {
    // Group by type
    const type = item.tipo.includes('bolsa') || item.tipo === 'cubitostradicionales' 
      ? 'bolsas' 
      : item.tipo.includes('barra') 
        ? 'barras' 
        : 'otros';
    
    if (!acc[type]) acc[type] = { total: 0, unidad: item.unidad };
    acc[type].total += item.cantidad;
    return acc;
  }, {} as Record<string, { total: number, unidad: string }>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Inventario de Productos</CardTitle>
            <Select
              value={filter}
              onValueChange={setFilter}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los productos</SelectItem>
                <SelectItem value="bolsas">Bolsas</SelectItem>
                <SelectItem value="barras">Barras de hielo</SelectItem>
                <SelectItem value="bolsa5kg">Bolsas 5 kg</SelectItem>
                <SelectItem value="bolsa3kg">Bolsas 3 kg</SelectItem>
                <SelectItem value="cubitostradicionales">Cubitos tradicionales</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(summary).map(([type, data]) => (
              <Card key={type} className="bg-muted">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <h3 className="text-lg font-semibold">{type === 'bolsas' ? 'Bolsas' : type === 'barras' ? 'Barras de hielo' : 'Otros'}</h3>
                  <p className="text-3xl font-bold">{data.total}</p>
                  <p className="text-sm text-muted-foreground">{data.unidad}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="overflow-x-auto mt-6">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Tipo</th>
                  <th className="text-right p-2">Cantidad</th>
                  <th className="text-left p-2">Unidad</th>
                  <th className="text-left p-2">Fecha ingreso</th>
                  <th className="text-left p-2">Origen</th>
                  <th className="text-left p-2">Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-muted">
                      <td className="p-2">
                        <Badge variant="outline">
                          {item.tipo.includes('bolsa5kg') ? 'Bolsa 5 kg' :
                           item.tipo.includes('bolsa3kg') ? 'Bolsa 3 kg' :
                           item.tipo === 'cubitostradicionales' ? 'Cubitos Tradicionales' :
                           item.tipo}
                        </Badge>
                      </td>
                      <td className="p-2 text-right">{item.cantidad}</td>
                      <td className="p-2">{item.unidad}</td>
                      <td className="p-2">
                        {format(new Date(item.fechaIngreso), 'dd MMM yyyy', { locale: es })}
                      </td>
                      <td className="p-2">{item.origen}</td>
                      <td className="p-2">{item.observaciones || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-2 text-center">No hay elementos en inventario</td>
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

export default StorageDashboard;
