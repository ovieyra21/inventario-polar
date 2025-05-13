import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { dashboardStats } from "@/services/mockData";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line
} from "recharts";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "react-router-dom";
import { getConsumptionByArea } from "@/services/iceBarService";
import { useToast } from "@/components/ui/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

declare module 'jspdf-autotable';

const Reports = () => {
  const [reportType, setReportType] = useState("daily");
  const [dateRange, setDateRange] = useState("7days");
  const [consumptionByArea, setConsumptionByArea] = useState<{ name: string; value: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const { toast } = useToast();
  
  // Definimos años disponibles (año actual y 3 años anteriores)
  const currentYear = new Date().getFullYear();
  const availableYears = [
    currentYear.toString(),
    (currentYear - 1).toString(),
    (currentYear - 2).toString(),
    (currentYear - 3).toString()
  ];
  
  // Cargar datos de consumo por área
  useEffect(() => {
    const loadConsumptionData = async () => {
      if (reportType === 'consumption') {
        setIsLoading(true);
        try {
          // Pasamos el año seleccionado al servicio
          const data = await getConsumptionByArea(parseInt(selectedYear));
          setConsumptionByArea(data);
        } catch (error) {
          console.error("Error al cargar datos de consumo:", error);
          toast({
            title: "Error",
            description: "No se pudieron cargar los datos de consumo por área",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadConsumptionData();
  }, [reportType, selectedYear, toast]);
  
  // Generate daily production data for the chart
  const dailyData = [...Array(parseInt(dateRange.replace("days", ""))).keys()]
    .map(i => {
      const date = subDays(new Date(), i);
      return {
        date: format(date, "dd MMM", { locale: es }),
        "Barras (piezas)": Math.floor(Math.random() * 1000) + 500,
        "Bolsas (uds)": Math.floor(Math.random() * 5000) + 2000
      };
    })
    .reverse();
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  // Monthly trend data
  const monthlyTrend = [
    { name: "Ene", barras: 25000, bolsas: 120000 },
    { name: "Feb", barras: 28000, bolsas: 132000 },
    { name: "Mar", barras: 26000, bolsas: 125000 },
    { name: "Abr", barras: 30000, bolsas: 140000 },
    { name: "May", barras: 24000, bolsas: 115000 }
  ];

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte Detallado de Producción", 14, 16);
    autoTable(doc, {
      startY: 22,
      head: [["Fecha", "Barras (piezas)", "Bolsas (uds)", "Paquetes estimados"]],
      body: dailyData.map(row => [
        row.date,
        row["Barras (piezas)"],
        row["Bolsas (uds)"],
        Math.floor(row["Bolsas (uds)"] / 150)
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [14, 165, 233] },
    });
    doc.save("reporte-produccion.pdf");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Reportes y Métricas</h1>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <File className="h-4 w-4 mr-2" />
            Exportar a PDF
          </Button>
          <Link to="/ice-production">
            <Button variant="default">
              Ver Producción de Barras
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center mb-4 space-x-2">
            <div className="font-medium">Tipo de Reporte:</div>
            <Select
              value={reportType}
              onValueChange={setReportType}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Producción Diaria</SelectItem>
                <SelectItem value="consumption">Consumo por Área</SelectItem>
                <SelectItem value="trend">Tendencia Mensual</SelectItem>
              </SelectContent>
            </Select>
            
            {reportType === "daily" && (
              <>
                <div className="font-medium">Rango:</div>
                <Select
                  value={dateRange}
                  onValueChange={setDateRange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Últimos 7 días</SelectItem>
                    <SelectItem value="14days">Últimos 14 días</SelectItem>
                    <SelectItem value="30days">Últimos 30 días</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
            
            {reportType === "consumption" && (
              <>
                <div className="font-medium">Año:</div>
                <Select
                  value={selectedYear}
                  onValueChange={setSelectedYear}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>
                {reportType === "daily" 
                  ? "Producción Diaria" 
                  : reportType === "consumption"
                  ? `Consumo por Área (${selectedYear})`
                  : "Tendencia Mensual"
                }
              </CardTitle>
              <CardDescription>
                {reportType === "daily" 
                  ? `Datos de los últimos ${dateRange.replace("days", " días")}` 
                  : reportType === "consumption"
                  ? "Distribución del consumo de hielo por área"
                  : "Evolución mensual de producción"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                {reportType === "daily" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={dailyData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="Barras (piezas)" fill="#0ea5e9" />
                      <Bar yAxisId="right" dataKey="Bolsas (uds)" fill="#6366f1" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                )}
                
                {reportType === "consumption" && (
                  <ResponsiveContainer width="100%" height="100%">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-pulse text-lg">Cargando datos...</div>
                      </div>
                    ) : (
                      <RechartsPieChart>
                        <Pie
                          data={consumptionByArea}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {consumptionByArea.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [`${value} unidades`, 'Consumo']} />
                      </RechartsPieChart>
                    )}
                  </ResponsiveContainer>
                )}
                
                {reportType === "trend" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={monthlyTrend}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="barras" name="Barras (piezas)" stroke="#0ea5e9" activeDot={{ r: 8 }} />
                      <Line yAxisId="right" type="monotone" dataKey="bolsas" name="Bolsas (uds)" stroke="#6366f1" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Mes</CardTitle>
              <CardDescription>Datos acumulados del mes actual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="font-medium">Total Barras Producidas:</div>
                  <div className="font-bold">28,450 piezas</div>
                </div>
                <div className="flex justify-between">
                  <div className="font-medium">Total Bolsas Producidas:</div>
                  <div className="font-bold">135,600 uds</div>
                </div>
                <div className="flex justify-between">
                  <div className="font-medium">Paquetes Creados:</div>
                  <div className="font-bold">904 paquetes</div>
                </div>
                <div className="flex justify-between">
                  <div className="font-medium">Solicitudes Completadas:</div>
                  <div className="font-bold">48 solicitudes</div>
                </div>
                <div className="flex justify-between">
                  <div className="font-medium">Eficiencia de Producción:</div>
                  <div className="font-bold text-green-600">98.2%</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>KPIs de Producción</CardTitle>
              <CardDescription>Indicadores clave de rendimiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <div className="text-sm font-medium">Cumplimiento de Metas</div>
                    <div className="text-sm font-medium">95%</div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <div className="text-sm font-medium">Utilización de Capacidad</div>
                    <div className="text-sm font-medium">87%</div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <div className="text-sm font-medium">Tiempo de Respuesta</div>
                    <div className="text-sm font-medium">92%</div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-2 bg-purple-500 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <div className="text-sm font-medium">Control de Inventario</div>
                    <div className="text-sm font-medium">98%</div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-2 bg-amber-500 rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
            <Button className="h-auto py-4 flex flex-col items-center justify-center space-y-2" onClick={handleExportPDF}>
              <File className="h-6 w-6" />
              <span>Reporte Completo</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center space-y-2" onClick={handleExportPDF}>
              <File className="h-6 w-6" />
              <span>Reporte de Producción</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center space-y-2" onClick={handleExportPDF}>
              <File className="h-6 w-6" />
              <span>Análisis de Consumo</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center space-y-2" onClick={handleExportPDF}>
              <File className="h-6 w-6" />
              <span>Exportar Datos</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
