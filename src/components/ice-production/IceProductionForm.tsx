
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IceBarFormData } from '@/types/iceBar';
import { createIceBar, isPositionAvailable } from '@/services/iceBarService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

const IceProductionForm: React.FC = () => {
  const { toast } = useToast();
  const [isPremierSelected, setIsPremierSelected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<IceBarFormData>({
    defaultValues: {
      basket: '',
      barRange: 'first',
      type: 'standard',
      operator: ''
    },
  });
  
  const handleBasketChange = (value: string) => {
    form.setValue('basket', value);
    
    // Actualizar el tipo automáticamente si se selecciona canastilla M
    if (value === 'M') {
      form.setValue('type', 'premier');
      setIsPremierSelected(true);
    } else {
      form.setValue('type', 'standard');
      setIsPremierSelected(false);
    }
  };
  
  const handleTypeChange = (value: 'standard' | 'premier') => {
    form.setValue('type', value);
    setIsPremierSelected(value === 'premier');
    
    // Si se selecciona premier pero no es canastilla M, cambiar a M
    if (value === 'premier' && form.getValues('basket') !== 'M') {
      form.setValue('basket', 'M');
    }
  };
  
  const onSubmit = async (data: IceBarFormData) => {
    setIsSubmitting(true);
    
    try {
      // Verificar disponibilidad
      const startBar = data.barRange === 'first' ? 1 : 9;
      const endBar = data.barRange === 'first' ? 8 : 16;
      
      for (let barNumber = startBar; barNumber <= endBar; barNumber++) {
        const isAvailable = await isPositionAvailable({
          basket: data.basket,
          barNumber
        });
        
        if (!isAvailable) {
          toast({
            title: "Error de disponibilidad",
            description: `La posición ${data.basket}-${barNumber} ya está ocupada.`,
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }
      
      // Todo está disponible, crear las barras
      const createdBars = await createIceBar(data);
      
      toast({
        title: "Barras registradas con éxito",
        description: `Se han registrado ${createdBars.length} barras en la canastilla ${data.basket}.`,
      });
      
      // Si es Premier, mostrar instrucciones adicionales
      if (data.type === 'premier') {
        toast({
          title: "Proceso Premier iniciado",
          description: "Recuerde completar los pasos del proceso especial Premier.",
        });
      }
      
      // Resetear formulario
      form.reset({
        basket: '',
        barRange: 'first',
        type: 'standard',
        operator: ''
      });
      setIsPremierSelected(false);
      
    } catch (error) {
      console.error('Error registrando barras:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al registrar las barras de hielo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="bg-gradient-to-br from-gray-100 to-blue-50 border border-blue-100">
      <CardHeader>
        <CardTitle className="text-2xl text-blue-900">Registro de Producción</CardTitle>
        <CardDescription>Registre nuevas barras de hielo en producción</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="basket"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Canastilla</FormLabel>
                    <Select
                      onValueChange={handleBasketChange}
                      value={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione una canastilla" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'].map((basket) => (
                          <SelectItem 
                            key={basket} 
                            value={basket}
                            className={basket === 'M' ? 'text-purple-700 font-medium' : ''}
                          >
                            Canastilla {basket} {basket === 'M' ? '(Premier)' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="barRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rango de Barras</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione un rango" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="first">1-8</SelectItem>
                        <SelectItem value="second">9-16</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Hielo</FormLabel>
                    <Select
                      onValueChange={(value) => handleTypeChange(value as 'standard' | 'premier')}
                      value={field.value}
                      disabled={isSubmitting || form.getValues('basket') === 'M'}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="standard">Estándar</SelectItem>
                        <SelectItem value="premier">Premier</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="operator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operario</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nombre del operario" 
                        {...field} 
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {isPremierSelected && (
              <div className="bg-purple-50 border border-purple-200 rounded-md p-4 mt-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-purple-600" />
                  <div>
                    <h4 className="font-medium text-purple-900">Proceso Premier</h4>
                    <p className="text-sm text-purple-700">
                      Las barras Premier requieren completar un proceso especial.
                      Los pasos específicos estarán disponibles después del registro.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <CardFooter className="px-0 pb-0">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium py-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registrando...' : 'Registrar Producción'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default IceProductionForm;
