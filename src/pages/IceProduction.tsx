
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IceMatrix from '@/components/ice-matrix/IceMatrix';
import IceProductionForm from '@/components/ice-production/IceProductionForm';
import { getIceBarStats, getUnreadNotifications } from '@/services/iceBarService';
import { useToast } from '@/hooks/use-toast';

const IceProduction = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    production: 0,
    maturation: 0,
    ready: 0,
    delayed: 0,
    extracted24h: 0
  });

  // Cargar estadísticas
  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await getIceBarStats();
        setStats(stats);
      } catch (error) {
        console.error('Error loading ice bar stats:', error);
      }
    };
    
    loadStats();
    
    // Refrescar datos cada minuto
    const interval = setInterval(loadStats, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Verificar notificaciones
  useEffect(() => {
    const checkNotifications = async () => {
      try {
        const { count, bars } = await getUnreadNotifications();
        
        if (count > 0) {
          // Mostrar toast con las barras listas
          const readyBars = bars.filter(bar => 
            bar.status === 'ready' || bar.status === 'delayed'
          );
          
          if (readyBars.length > 0) {
            toast({
              title: `${readyBars.length} barras listas para extraer`,
              description: readyBars.map(bar => `${bar.basket}-${bar.barNumber}`).join(', '),
              variant: "default",
            });
          }
        }
      } catch (error) {
        console.error('Error checking notifications:', error);
      }
    };
    
    // Verificar al cargar y cada 5 minutos
    checkNotifications();
    const interval = setInterval(checkNotifications, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [toast]);

  return (
    <div className="space-y-6 animate-fade-in p-6">
      <h1 className="text-3xl font-bold tracking-tight">Gestión de Barras de Hielo</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-700">En Producción</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{stats.production}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-yellow-700">En Maduración</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{stats.maturation}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-700">Listas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{stats.ready}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-red-700">Retrasadas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{stats.delayed}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-700">Extraídas (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-600">{stats.extracted24h}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="matrix" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="matrix">Matriz de Producción</TabsTrigger>
          <TabsTrigger value="register">Registrar Producción</TabsTrigger>
        </TabsList>
        
        <TabsContent value="matrix" className="space-y-4">
          <IceMatrix />
        </TabsContent>
        
        <TabsContent value="register" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="lg:col-span-1">
              <IceProductionForm />
            </div>
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Instrucciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg">Producción Estándar</h3>
                    <ol className="list-decimal list-inside space-y-2 mt-2 ml-4">
                      <li>Seleccione una canastilla disponible (A-L)</li>
                      <li>Elija el rango de barras (1-8 o 9-16)</li>
                      <li>Ingrese el nombre del operario</li>
                      <li>Haga click en "Registrar Producción"</li>
                    </ol>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-medium text-lg">Producción Premier</h3>
                    <ol className="list-decimal list-inside space-y-2 mt-2 ml-4">
                      <li>Seleccione la canastilla M</li>
                      <li>Elija el rango de barras (1-8 o 9-16)</li>
                      <li>Ingrese el nombre del operario</li>
                      <li>Haga click en "Registrar Producción"</li>
                      <li>Complete los pasos adicionales del proceso Premier</li>
                    </ol>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-medium text-lg">Extracción de Barras</h3>
                    <p className="mt-2">Las barras listas para extraer aparecen en verde en la matriz. Haga click sobre ellas para marcarlas como extraídas.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IceProduction;
