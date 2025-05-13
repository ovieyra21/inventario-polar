
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { addNonSalesOutput } from '@/services/nonSalesOutputService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllStorage } from '@/services/storageService';
import { useAuth } from "@/contexts/AuthContext";

const NonSalesOutputForm = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    tipo: '',
    cantidad: '',
    motivo: 'cortesía',
    observaciones: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fecha || !formData.tipo || !formData.cantidad || !formData.motivo) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }
    
    // Validate cantidad is a positive number
    const cantidad = parseInt(formData.cantidad);
    if (isNaN(cantidad) || cantidad <= 0) {
      toast({
        title: "Error",
        description: "La cantidad debe ser un número positivo",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Add non-sales output
      addNonSalesOutput({
        fecha: formData.fecha,
        tipo: formData.tipo,
        cantidad,
        motivo: formData.motivo as 'cortesía' | 'uso_interno' | 'pérdida' | 'muestra',
        responsable: currentUser?.name || 'Usuario',
        observaciones: formData.observaciones
      });
      
      toast({
        title: "Éxito",
        description: `Salida de ${cantidad} unidades registrada correctamente`,
      });
      
      // Reset form
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        tipo: '',
        cantidad: '',
        motivo: 'cortesía',
        observaciones: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo registrar la salida",
        variant: "destructive",
      });
    }
  };

  // Get all available product types from storage
  const availableProducts = Array.from(new Set(
    getAllStorage().map(item => item.tipo)
  )).map(tipo => {
    const label = tipo.includes('bolsa5kg') ? 'Bolsa 5 kg' :
                  tipo.includes('bolsa3kg') ? 'Bolsa 3 kg' :
                  tipo === 'cubitostradicionales' ? 'Cubitos Tradicionales' :
                  tipo;
    return { value: tipo, label };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registro de Salida (No Venta)</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => handleChange('fecha', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tipo">Producto</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => handleChange('tipo', value)}
              >
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent>
                  {availableProducts.map(product => (
                    <SelectItem key={product.value} value={product.value}>
                      {product.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cantidad">Cantidad</Label>
              <Input
                id="cantidad"
                type="number"
                value={formData.cantidad}
                onChange={(e) => handleChange('cantidad', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo</Label>
              <Select
                value={formData.motivo}
                onValueChange={(value) => handleChange('motivo', value)}
              >
                <SelectTrigger id="motivo">
                  <SelectValue placeholder="Seleccionar motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cortesía">Cortesía</SelectItem>
                  <SelectItem value="uso_interno">Uso interno</SelectItem>
                  <SelectItem value="pérdida">Pérdida</SelectItem>
                  <SelectItem value="muestra">Muestra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones (opcional)</Label>
            <Input
              id="observaciones"
              value={formData.observaciones}
              onChange={(e) => handleChange('observaciones', e.target.value)}
            />
          </div>
          
          <Button type="submit" className="w-full md:w-auto">
            Registrar Salida
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NonSalesOutputForm;
