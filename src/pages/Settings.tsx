import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const { toast } = useToast();
  
  // Mock settings state
  const [settings, setSettings] = useState({
    // System settings
    companyName: "Hielo Polar del Centro",
    packageSize: "150",
    barrasAlertThreshold: "200",
    bolsasAlertThreshold: "1000",
    paquetesAlertThreshold: "10",
    
    // Features
    enableAuditLogs: true,
    enableNotifications: true,
    enableBatchTracking: true,
    
    // Email notifications
    notifyLowStock: true,
    notifyNewRequests: true,
    notifyRequestApproval: true,
  });
  
  const handleChange = (field: string, value: string | boolean) => {
    setSettings({
      ...settings,
      [field]: value,
    });
  };
  
  const handleSaveGeneralSettings = () => {
    toast({
      title: "Configuración guardada",
      description: "Los ajustes generales han sido actualizados",
    });
  };
  
  const handleSaveNotificationSettings = () => {
    toast({
      title: "Configuración guardada",
      description: "Los ajustes de notificaciones han sido actualizados",
    });
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración del Sistema</h1>
        <p className="text-muted-foreground">
          Ajustes generales y parámetros de la aplicación
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ajustes Generales</CardTitle>
            <CardDescription>
              Configuración básica del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nombre de la Empresa</Label>
                <Input
                  id="companyName"
                  value={settings.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="packageSize">Tamaño de Paquete (bolsas)</Label>
                <Input
                  id="packageSize"
                  type="number"
                  value={settings.packageSize}
                  onChange={(e) => handleChange("packageSize", e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Número de bolsas por paquete estándar
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="barrasAlertThreshold">Alerta de Barras (piezas)</Label>
                <Input
                  id="barrasAlertThreshold"
                  type="number"
                  value={settings.barrasAlertThreshold}
                  onChange={(e) => handleChange("barrasAlertThreshold", e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Límite para alertas de stock bajo de barras
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bolsasAlertThreshold">Alerta de Bolsas (uds)</Label>
                <Input
                  id="bolsasAlertThreshold"
                  type="number"
                  value={settings.bolsasAlertThreshold}
                  onChange={(e) => handleChange("bolsasAlertThreshold", e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Límite para alertas de stock bajo de bolsas
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paquetesAlertThreshold">Alerta de Paquetes (uds)</Label>
                <Input
                  id="paquetesAlertThreshold"
                  type="number"
                  value={settings.paquetesAlertThreshold}
                  onChange={(e) => handleChange("paquetesAlertThreshold", e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Límite para alertas de stock bajo de paquetes
                </p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <h3 className="font-medium">Características del Sistema</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableAuditLogs">Registro de Auditoría</Label>
                  <p className="text-sm text-muted-foreground">
                    Registrar todas las acciones de los usuarios
                  </p>
                </div>
                <Switch
                  id="enableAuditLogs"
                  checked={settings.enableAuditLogs}
                  onCheckedChange={(checked) => handleChange("enableAuditLogs", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableNotifications">Notificaciones en Sistema</Label>
                  <p className="text-sm text-muted-foreground">
                    Mostrar notificaciones en la interfaz
                  </p>
                </div>
                <Switch
                  id="enableNotifications"
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => handleChange("enableNotifications", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableBatchTracking">Seguimiento de Lotes</Label>
                  <p className="text-sm text-muted-foreground">
                    Seguimiento detallado por lotes y códigos
                  </p>
                </div>
                <Switch
                  id="enableBatchTracking"
                  checked={settings.enableBatchTracking}
                  onCheckedChange={(checked) => handleChange("enableBatchTracking", checked)}
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button onClick={handleSaveGeneralSettings}>
                Guardar Cambios
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notificaciones</CardTitle>
            <CardDescription>
              Configuración de alertas y notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifyLowStock">Alertas de Stock Bajo</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificar cuando el inventario esté por debajo del umbral
                  </p>
                </div>
                <Switch
                  id="notifyLowStock"
                  checked={settings.notifyLowStock}
                  onCheckedChange={(checked) => handleChange("notifyLowStock", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifyNewRequests">Nuevas Solicitudes</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificar cuando se cree una nueva solicitud de producción
                  </p>
                </div>
                <Switch
                  id="notifyNewRequests"
                  checked={settings.notifyNewRequests}
                  onCheckedChange={(checked) => handleChange("notifyNewRequests", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifyRequestApproval">Aprobación de Solicitudes</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificar cuando se apruebe una solicitud
                  </p>
                </div>
                <Switch
                  id="notifyRequestApproval"
                  checked={settings.notifyRequestApproval}
                  onCheckedChange={(checked) => handleChange("notifyRequestApproval", checked)}
                />
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <h3 className="font-medium">Destinatarios de Notificaciones</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">admin@hielopolar.com</Badge>
                <Badge variant="outline">inventario@hielopolar.com</Badge>
                <Badge variant="outline">produccion@hielopolar.com</Badge>
                <Badge variant="outline">+ Agregar</Badge>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button onClick={handleSaveNotificationSettings}>
                Guardar Notificaciones
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Información del Sistema</CardTitle>
            <CardDescription>
              Datos técnicos de la aplicación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Versión</h3>
                <p>1.0.0</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Última Actualización</h3>
                <p>11 de Mayo, 2025</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Desarrollado por</h3>
                <p>Lovable AI</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Soporte</h3>
                <p>soporte@hielopolar.com</p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-between">
              <Button variant="outline">Realizar Backup</Button>
              <Button variant="outline" className="text-destructive hover:text-destructive">
                Restaurar Datos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
