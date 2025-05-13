import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Check, X } from "lucide-react";
import { productionRequests } from "@/services/mockData";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import ProductionSimulator from '../components/production/ProductionSimulator';
import ProductionHistory from '../components/production/ProductionHistory';
import BolsaProductionForm from '../components/production/BolsaProductionForm';
import BolsaProductionDashboard from '../components/production/BolsaProductionDashboard';
import { addProductionHistory } from '../services/productionHistoryService';
import { Link } from "react-router-dom";

// Subcomponente para el formulario de nueva solicitud
function ProductionRequestDialog({ open, onOpenChange, onSubmit, newRequest, setNewRequest }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Solicitud
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Solicitud de Producción</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="bars">Barras de Hielo (piezas)</Label>
              <Input
                id="bars"
                type="number"
                value={newRequest.bars}
                onChange={(e) => setNewRequest({ ...newRequest, bars: e.target.value })}
                placeholder="Ingrese la cantidad de piezas"
              />
            </div>
            <div>
              <Label htmlFor="packages">Paquetes de 150 Bolsas</Label>
              <Input
                id="packages"
                type="number"
                value={newRequest.packages}
                onChange={(e) => setNewRequest({ ...newRequest, packages: e.target.value })}
                placeholder="Ingrese la cantidad de paquetes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Solicitar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Subcomponente para la tabla de solicitudes
function ProductionRequestsTable({ requests, isInventoryRole, isProductionRole, toast }) {
  return (
    <div className="overflow-x-auto">
      <table className="data-table w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 border text-left">ID</th>
            <th className="p-2 border text-left">Fecha</th>
            <th className="p-2 border text-left">Solicitado por</th>
            <th className="p-2 border text-left">Items</th>
            <th className="p-2 border text-left">Estado</th>
            <th className="p-2 border text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((req) => (
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>{format(new Date(req.requestDate), "dd/MM/yyyy HH:mm")}</td>
                <td>Supervisor de Producción</td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {req.items.map((item, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {`${item.quantity} ${item.type === "bar" ? "piezas" : "paquetes"}`}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full
                    ${req.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      req.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      req.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'}`}
                  >
                    {req.status === 'pending' ? 'Pendiente' :
                      req.status === 'approved' ? 'Aprobada' :
                      req.status === 'delivered' ? 'Entregada' : 'Rechazada'}
                  </span>
                </td>
                <td>
                  {req.status === 'pending' && isInventoryRole && (
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-600"
                        onClick={() => toast({ title: "Solicitud aprobada", description: `La solicitud ${req.id} ha sido aprobada` })}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => toast({ title: "Solicitud rechazada", description: `La solicitud ${req.id} ha sido rechazada`, variant: "destructive" })}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {req.status === 'approved' && isInventoryRole && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast({ title: "Entrega confirmada", description: `La entrega de la solicitud ${req.id} ha sido confirmada` })}
                    >
                      Marcar entregada
                    </Button>
                  )}
                  {req.status === 'approved' && isProductionRole && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast({ title: "Recepción confirmada", description: `La recepción de la solicitud ${req.id} ha sido confirmada` })}
                    >
                      Confirmar recepción
                    </Button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">No hay solicitudes registradas</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const Production = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [newRequest, setNewRequest] = useState({
    bars: "",
    packages: "",
  });
  const [activeTab, setActiveTab] = useState('simulation');
  const [mainContentTab, setMainContentTab] = useState('barras'); // New state for main content tabs
  const [newEntry, setNewEntry] = useState({ date: '', volume: '', product: '' });
  const PRODUCT_OPTIONS = [
    { value: 'barra', label: 'BARRA DE HIELO' },
    { value: 'bolsa5', label: 'BOLSA DE HIELO 5 KG' },
    { value: 'bolsa3', label: 'BOLSA DE HIELO 3 KG' },
    { value: 'premier3', label: 'HIELO PREMIER 3 KG' },
  ];

  const isProductionRole = currentUser?.role === "production";
  const isInventoryRole = currentUser?.role === "inventory" || currentUser?.role === "admin";
  
  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // Validar que al menos uno de los campos tenga valor y que sean números enteros positivos
    const barsValue = parseInt(newRequest.bars, 10);
    const packagesValue = parseInt(newRequest.packages, 10);
    if ((!barsValue && !packagesValue) || (barsValue < 0 || packagesValue < 0)) {
      toast({
        title: "Error",
        description: "Ingrese al menos una cantidad válida de barras (piezas) o paquetes",
        variant: "destructive",
      });
      return;
    }
    // Aquí se debería crear la solicitud en la base de datos o estado global, usando piezas
    toast({
      title: "Solicitud creada",
      description: `La solicitud de producción ha sido registrada (${barsValue || 0} piezas, ${packagesValue || 0} paquetes)`,
    });
    setOpenDialog(false);
    setNewRequest({ bars: "", packages: "" });
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.date || !newEntry.volume || !newEntry.product) {
      toast({
        title: 'Error',
        description: 'Por favor, complete todos los campos.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await addProductionHistory({
        date: new Date(newEntry.date).toISOString(),
        volume: parseInt(newEntry.volume, 10),
        product: newEntry.product,
      });
      toast({
        title: 'Éxito',
        description: 'Entrada añadida al histórico de producción.',
      });
      setNewEntry({ date: '', volume: '', product: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo añadir la entrada.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Producción</h1>
        
        <div className="flex items-center space-x-2">
          <Link to="/ice-production" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Gestión de Barras de Hielo
          </Link>
          
          <Link to="/storage" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Almacenamiento
          </Link>
          
          {isProductionRole && (
            <ProductionRequestDialog
              open={openDialog}
              onOpenChange={setOpenDialog}
              onSubmit={handleCreateRequest}
              newRequest={newRequest}
              setNewRequest={setNewRequest}
            />
          )}
        </div>
      </div>

      {/* Main Content Type Selection */}
      <div className="tabs grid grid-cols-2 gap-2">
        <button 
          onClick={() => setMainContentTab('barras')} 
          className={`px-4 py-2 text-center rounded-md ${mainContentTab === 'barras' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted hover:bg-muted/80'}`}
        >
          Barras de Hielo
        </button>
        <button 
          onClick={() => setMainContentTab('bolsas')} 
          className={`px-4 py-2 text-center rounded-md ${mainContentTab === 'bolsas' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted hover:bg-muted/80'}`}
        >
          Bolsas
        </button>
      </div>

      {/* Content for Barras or Bolsas based on selection */}
      {mainContentTab === 'barras' ? (
        <>
          <div className="tabs grid grid-cols-2 gap-2">
            <button 
              onClick={() => setActiveTab('simulation')} 
              className={`px-4 py-2 text-center rounded-md ${activeTab === 'simulation' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80'}`}
            >
              Simulación
            </button>
            <button 
              onClick={() => setActiveTab('history')} 
              className={`px-4 py-2 text-center rounded-md ${activeTab === 'history' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80'}`}
            >
              Histórico
            </button>
          </div>
          {activeTab === 'simulation' && <ProductionSimulator />}
          {activeTab === 'history' && <ProductionHistory />}

          <div className="add-entry-form border rounded-lg p-4 bg-card">
            <h2 className="text-xl font-bold mb-4">Añadir Entrada al Histórico</h2>
            <form onSubmit={handleAddEntry} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date">Fecha:</Label>
                  <Input
                    type="date"
                    id="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="volume">Volumen (piezas):</Label>
                  <Input
                    type="number"
                    id="volume"
                    value={newEntry.volume}
                    onChange={(e) => setNewEntry({ ...newEntry, volume: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="product">Producto:</Label>
                  <select
                    id="product"
                    className="w-full border rounded px-2 py-2"
                    value={newEntry.product}
                    onChange={(e) => setNewEntry({ ...newEntry, product: e.target.value })}
                  >
                    <option value="">Seleccione un producto</option>
                    {PRODUCT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Button type="submit">Añadir Registro</Button>
            </form>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <BolsaProductionForm />
          <BolsaProductionDashboard />
        </div>
      )}

      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="approved">Aprobadas</TabsTrigger>
          <TabsTrigger value="delivered">Entregadas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Solicitudes de Producción</CardTitle>
              <CardDescription>
                Todas las solicitudes realizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductionRequestsTable
                requests={productionRequests}
                isInventoryRole={isInventoryRole}
                isProductionRole={isProductionRole}
                toast={toast}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Solicitudes Pendientes</CardTitle>
              <CardDescription>
                Solicitudes que requieren atención
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductionRequestsTable
                requests={productionRequests.filter(r => r.status === 'pending')}
                isInventoryRole={isInventoryRole}
                isProductionRole={isProductionRole}
                toast={toast}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="approved" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Solicitudes Aprobadas</CardTitle>
              <CardDescription>
                Solicitudes aprobadas pendientes de entrega
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductionRequestsTable
                requests={productionRequests.filter(r => r.status === 'approved')}
                isInventoryRole={isInventoryRole}
                isProductionRole={isProductionRole}
                toast={toast}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="delivered" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Solicitudes Entregadas</CardTitle>
              <CardDescription>
                Solicitudes completadas y entregadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductionRequestsTable
                requests={productionRequests.filter(r => r.status === 'delivered')}
                isInventoryRole={isInventoryRole}
                isProductionRole={isProductionRole}
                toast={toast}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Production;
