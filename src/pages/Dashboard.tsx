import * as React from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Calendar, Package, Clipboard } from "lucide-react";
import { dashboardStats, productionRequests } from "@/services/mockData";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { BarChart as Chart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useAuth } from "@/contexts/AuthContext";

const StatCard = ({ 
  icon: Icon, 
  value, 
  label, 
  color = "text-primary",
  trend,
}: { 
  icon: React.ElementType;
  value: string | number;
  label: string;
  color?: string;
  trend?: { value: number; isPositive: boolean };
}) => (
  <div className="stat-card">
    <div className="flex justify-between items-start">
      <div>
        <div className={`stat-value ${color}`}>{value}</div>
        <div className="stat-label">{label}</div>
      </div>
      <div className="p-3 rounded-full bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>
    </div>
    {trend && (
      <div className={`text-sm ${trend.isPositive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
        {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% vs. ayer
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const { currentUser } = useAuth();
  
  // Format production data for chart
  const chartData = dashboardStats.dailyProduction.map(day => ({
    date: day.date,
    "Barras (piezas)": day.bars,
    "Bolsas (uds)": day.bags
  }));

  // Get pending requests
  const pendingRequests = productionRequests.filter(req => req.status === 'pending');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Bienvenido, {currentUser?.name}
        </h1>
        <p className="text-muted-foreground">
          {format(new Date(), "EEEE d 'de' MMMM, yyyy", { locale: es })}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          icon={Package} 
          value={`${dashboardStats.currentInventory.bars} piezas`} 
          label="Barras disponibles"
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatCard 
          icon={Package} 
          value={dashboardStats.currentInventory.bags} 
          label="Bolsas disponibles"
          trend={{ value: 3.1, isPositive: true }}
        />
        <StatCard 
          icon={Package} 
          value={dashboardStats.currentInventory.packages} 
          label="Paquetes disponibles"
          trend={{ value: 1.5, isPositive: false }}
        />
        <StatCard 
          icon={Clipboard} 
          value={dashboardStats.pendingRequests} 
          label="Solicitudes pendientes"
          color={dashboardStats.pendingRequests > 0 ? "text-amber-500" : "text-primary"}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Producción Reciente</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <Chart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="Barras (piezas)" fill="#0ea5e9" />
                <Bar yAxisId="right" dataKey="Bolsas (uds)" fill="#6366f1" />
              </Chart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Solicitudes Recientes</h2>
          
          {pendingRequests.length > 0 ? (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">Solicitud #{request.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(request.requestDate), "dd/MM/yyyy HH:mm")}
                      </p>
                    </div>
                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                      Pendiente
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    {request.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>
                          {item.type === 'bar' ? 'Barras' : 'Paquetes'}:
                        </span>
                        <span className="font-medium">
                          {item.quantity} {item.type === 'bar' ? 'piezas' : 'uds'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>No hay solicitudes pendientes</p>
            </div>
          )}
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Actividad Reciente</h2>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Acción</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {/* Mostramos los últimos 5 registros de auditoria */}
              {Array(5).fill(0).map((_, i) => (
                <tr key={i}>
                  <td>{format(new Date(2024, 4, 5 - i, 14 - i * 2, 30), "dd/MM/yyyy HH:mm")}</td>
                  <td>Encargado de Inventario</td>
                  <td>{i % 2 === 0 ? "Ingreso de inventario" : "Aprobación de solicitud"}</td>
                  <td>{i % 2 === 0 ? "Ingreso de 500 piezas de barras" : "Solicitud #R20240505-" + i}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
