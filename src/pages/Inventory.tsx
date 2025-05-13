
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, File, Filter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { inventoryItems } from "@/services/mockData";
import { format } from "date-fns";

const Inventory = () => {
  const { hasPermission } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [filter, setFilter] = useState("all");
  const canEdit = hasPermission(["admin", "inventory"]);
  
  const bars = inventoryItems.filter((item) => item.type === "bar");
  const bags = inventoryItems.filter((item) => item.type === "bag");
  
  const filteredBars = filter === "all" 
    ? bars 
    : bars.filter((item) => item.status === filter);
  
  const filteredBags = filter === "all" 
    ? bags
    : bags.filter((item) => item.status === filter);

  // Mock form state
  const [newItem, setNewItem] = useState({
    type: "bar",
    quantity: "",
    batchId: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API to add the item
    console.log("Adding new inventory item", newItem);
    setOpenDialog(false);
    
    // Reset form
    setNewItem({
      type: "bar",
      quantity: "",
      batchId: ""
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <Select
              value={filter}
              onValueChange={setFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="available">Disponible</SelectItem>
                <SelectItem value="assigned">Asignado</SelectItem>
                <SelectItem value="used">Utilizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {canEdit && (
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Ingreso
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>Registrar Nuevo Ingreso</DialogTitle>
                    <DialogDescription>
                      Ingrese los detalles del nuevo lote de materia prima.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="itemType">Tipo</Label>
                      <Select
                        value={newItem.type}
                        onValueChange={(value) => setNewItem({ ...newItem, type: value })}
                      >
                        <SelectTrigger id="itemType">
                          <SelectValue placeholder="Seleccione tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bar">Barras de Hielo</SelectItem>
                          <SelectItem value="bag">Bolsas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="quantity">
                        Cantidad ({newItem.type === "bar" ? "kg" : "unidades"})
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="batchId">Lote (opcional)</Label>
                      <Input
                        id="batchId"
                        type="text"
                        value={newItem.batchId}
                        onChange={(e) => setNewItem({ ...newItem, batchId: e.target.value })}
                        placeholder="Código de lote"
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Guardar</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
          
          <Button variant="outline">
            <File className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="bars">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="bars">Barras de Hielo</TabsTrigger>
          <TabsTrigger value="bags">Bolsas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bars" className="animate-fade-in">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Inventario de Barras de Hielo</CardTitle>
              <CardDescription>
                Stock disponible: {bars.reduce((sum, item) => item.status === 'available' ? sum + item.quantity : sum, 0)} kg
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Lote</th>
                      <th>Cantidad (kg)</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBars.length > 0 ? (
                      filteredBars.map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.batchId || '-'}</td>
                          <td>{item.quantity}</td>
                          <td>{format(new Date(item.dateCreated), "dd/MM/yyyy HH:mm")}</td>
                          <td>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full
                              ${item.status === 'available' ? 'bg-green-100 text-green-800' :
                              item.status === 'assigned' ? 'bg-amber-100 text-amber-800' :
                              'bg-gray-100 text-gray-800'}`}
                            >
                              {item.status === 'available' ? 'Disponible' :
                               item.status === 'assigned' ? 'Asignado' : 'Utilizado'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-4">No hay registros que mostrar</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bags" className="animate-fade-in">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Inventario de Bolsas</CardTitle>
              <CardDescription>
                Stock disponible: {bags.reduce((sum, item) => item.status === 'available' ? sum + item.quantity : sum, 0)} unidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Lote</th>
                      <th>Cantidad (uds)</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBags.length > 0 ? (
                      filteredBags.map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.batchId || '-'}</td>
                          <td>{item.quantity}</td>
                          <td>{format(new Date(item.dateCreated), "dd/MM/yyyy HH:mm")}</td>
                          <td>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full
                              ${item.status === 'available' ? 'bg-green-100 text-green-800' :
                              item.status === 'assigned' ? 'bg-amber-100 text-amber-800' :
                              'bg-gray-100 text-gray-800'}`}
                            >
                              {item.status === 'available' ? 'Disponible' :
                               item.status === 'assigned' ? 'Asignado' : 'Utilizado'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-4">No hay registros que mostrar</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Inventory;
