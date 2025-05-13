
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, CheckCircle, File } from "lucide-react";
import { packages } from "@/services/mockData";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Packaging = () => {
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [bagsCount, setBagsCount] = useState("");
  
  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the bags count
    const count = parseInt(bagsCount);
    if (isNaN(count) || count <= 0) {
      toast({
        title: "Error",
        description: "Ingrese una cantidad válida de bolsas",
        variant: "destructive",
      });
      return;
    }
    
    // Calculate full packages (150 bags each)
    const fullPackages = Math.floor(count / 150);
    const remainingBags = count % 150;
    
    if (fullPackages === 0) {
      toast({
        title: "Cantidad insuficiente",
        description: "Se requieren al menos 150 bolsas para crear un paquete",
        variant: "destructive",
      });
      return;
    }
    
    // Show success message
    toast({
      title: "Paquetes creados",
      description: `Se han creado ${fullPackages} paquetes completos${remainingBags > 0 ? ` (${remainingBags} bolsas restantes)` : ''}`,
    });
    
    setOpenDialog(false);
    setBagsCount("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Empaquetado de Bolsas</h1>
        
        <div className="flex items-center space-x-2">
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crear Paquete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Paquete</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleCreatePackage}>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="bagsCount">Cantidad de Bolsas</Label>
                    <div className="mt-1">
                      <Input
                        id="bagsCount"
                        type="number"
                        value={bagsCount}
                        onChange={(e) => setBagsCount(e.target.value)}
                        placeholder="Ingrese la cantidad total de bolsas"
                        required
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Cada paquete contiene 150 bolsas. Se generarán paquetes completos 
                      y se registrarán las bolsas restantes.
                    </p>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Crear</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline">
            <File className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Paquetes Disponibles</CardTitle>
            <CardDescription>
              Total: {packages.filter(p => p.status === 'available').length} paquetes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-5xl font-bold text-primary">
                {packages.filter(p => p.status === 'available').length}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Bolsas por Paquete</CardTitle>
            <CardDescription>
              Cantidad estándar por paquete
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-5xl font-bold text-primary">150</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Bolsas Empaquetadas</CardTitle>
            <CardDescription>
              En todos los paquetes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-5xl font-bold text-primary">
                {packages.reduce((sum, pkg) => sum + pkg.bagsCount, 0)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Paquetes</CardTitle>
          <CardDescription>
            Historial de todos los paquetes creados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Fecha</th>
                  <th>Bolsas</th>
                  <th>Creado por</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {packages.length > 0 ? (
                  packages.map((pkg) => (
                    <tr key={pkg.id}>
                      <td>{pkg.batchCode}</td>
                      <td>{format(new Date(pkg.dateCreated), "dd/MM/yyyy HH:mm")}</td>
                      <td>{pkg.bagsCount}</td>
                      <td>Encargado de Inventario</td>
                      <td>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full
                          ${pkg.status === 'available' ? 'bg-green-100 text-green-800' : 
                           pkg.status === 'assigned' ? 'bg-amber-100 text-amber-800' : 
                           'bg-gray-100 text-gray-800'}`}
                        >
                          {pkg.status === 'available' ? 'Disponible' : 
                           pkg.status === 'assigned' ? 'Asignado' : 'Utilizado'}
                        </span>
                      </td>
                      <td>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={pkg.status !== 'available'}
                          onClick={() => {
                            toast({
                              title: "Paquete marcado como revisado",
                              description: `Paquete ${pkg.batchCode} verificado correctamente`,
                            });
                          }}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4">No hay paquetes registrados</td>
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

export default Packaging;
