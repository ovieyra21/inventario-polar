
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StorageDashboard from '@/components/storage/StorageDashboard';
import NonSalesOutputForm from '@/components/nonsales/NonSalesOutputForm';
import NonSalesOutputList from '@/components/nonsales/NonSalesOutputList';
import { useAuth } from '@/contexts/AuthContext';

const Storage = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const { hasPermission } = useAuth();
  
  const canEditInventory = hasPermission(["admin", "inventory"]);

  return (
    <div className="space-y-6 animate-fade-in p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Almacenamiento</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="inventory">Inventario</TabsTrigger>
          <TabsTrigger value="outputs">Registrar Salida</TabsTrigger>
          <TabsTrigger value="outputs-history">Histórico de Salidas</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="animate-fade-in mt-6">
          <StorageDashboard />
        </TabsContent>

        <TabsContent value="outputs" className="animate-fade-in mt-6">
          {canEditInventory ? (
            <NonSalesOutputForm />
          ) : (
            <div className="p-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-md">
              No tienes permisos para registrar salidas. Contacta a un administrador.
            </div>
          )}
        </TabsContent>

        <TabsContent value="outputs-history" className="animate-fade-in mt-6">
          <NonSalesOutputList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Storage;
