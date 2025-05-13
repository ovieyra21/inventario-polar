import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { addBolsaProduction } from '@/services/bolsaProductionService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import cuberaGrande from '/assets/cubera-grande.gif';

const DESCARGA_INTERVAL_MIN = 45;
const BOLSAS_POR_DESCARGA = 80;
const DESCARGAS_POR_TURNO = 8;
const HORA_INICIO = '06:15';

const BolsaProductionForm = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    turno: 'matutino',
    tipo: 'bolsa5kg',
    cantidad: '',
    observaciones: ''
  });

  const [descarga, setDescarga] = useState(1);
  const [progreso, setProgreso] = useState(0); // 0-100
  const [animando, setAnimando] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fecha || !formData.turno || !formData.tipo || !formData.cantidad) {
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
      // Add bolsa production
      addBolsaProduction({
        fecha: formData.fecha,
        turno: formData.turno as 'matutino' | 'vespertino' | 'nocturno',
        tipo: formData.tipo as 'bolsa5kg' | 'bolsa3kg' | 'cubitostradicionales',
        cantidad,
        responsable: currentUser?.name || 'Usuario',
        observaciones: formData.observaciones
      });
      
      toast({
        title: "Éxito",
        description: `Producción de ${cantidad} bolsas registrada correctamente`,
      });
      
      // Reset form
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        turno: 'matutino',
        tipo: 'bolsa5kg',
        cantidad: '',
        observaciones: ''
      });

      setDescarga((prev) => (prev < DESCARGAS_POR_TURNO ? prev + 1 : 1));
      setAnimando(false);
      setProgreso(0);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar la producción",
        variant: "destructive",
      });
    }
  };

  // Simula el proceso de descarga de hielo
  useEffect(() => {
    if (animando) {
      setProgreso(0);
      timerRef.current = setInterval(() => {
        setProgreso((prev) => {
          if (prev >= 100) {
            clearInterval(timerRef.current!);
            setAnimando(false);
            return 100;
          }
          return prev + 100 / (DESCARGA_INTERVAL_MIN * 60 / 2); // actualiza cada 2s
        });
      }, 2000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [animando]);

  const iniciarDescarga = () => {
    setAnimando(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registro de Producción de Bolsas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex flex-col items-center justify-center w-full md:w-1/2">
            <img src={cuberaGrande} alt="Máquina Grande" style={{ width: 180, marginBottom: 8 }} />
            <div style={{ width: 180, height: 16, background: '#e5e7eb', borderRadius: 8, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ width: `${progreso}%`, height: '100%', background: '#2563eb', transition: 'width 2s' }} />
            </div>
            <div style={{ fontWeight: 500, marginBottom: 8 }}>
              {animando
                ? `Descarga en proceso... (${Math.round(progreso)}%)`
                : `Descarga ${descarga} de ${DESCARGAS_POR_TURNO}`}
            </div>
            <Button onClick={iniciarDescarga} disabled={animando} variant="outline">
              {animando ? 'En proceso...' : 'Iniciar Descarga'}
            </Button>
            <div className="text-xs text-muted-foreground mt-2">Cada descarga produce ~80 bolsas de 5kg</div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 w-full md:w-1/2">
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
                <Label htmlFor="turno">Turno</Label>
                <Select
                  value={formData.turno}
                  onValueChange={(value) => handleChange('turno', value)}
                >
                  <SelectTrigger id="turno">
                    <SelectValue placeholder="Seleccionar turno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matutino">Matutino</SelectItem>
                    <SelectItem value="vespertino">Vespertino</SelectItem>
                    <SelectItem value="nocturno">Nocturno</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Bolsa</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => handleChange('tipo', value)}
                >
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bolsa5kg">Bolsa 5 kg</SelectItem>
                    <SelectItem value="bolsa3kg">Bolsa 3 kg</SelectItem>
                    <SelectItem value="cubitostradicionales">Cubitos Tradicionales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cantidad">Cantidad (bolsas)</Label>
                <Input
                  id="cantidad"
                  type="number"
                  value={formData.cantidad}
                  onChange={(e) => handleChange('cantidad', e.target.value)}
                  required
                />
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
              Registrar Producción
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default BolsaProductionForm;
