
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash, UserPlus } from "lucide-react";
import { users } from "@/services/mockData";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserRole } from "@/types";

const roleLabels: Record<UserRole, string> = {
  admin: "Administrador",
  inventory: "Encargado de Inventario",
  production: "Supervisor de Producción",
  packaging: "Operario de Empaque",
  viewer: "Visor de Reportes"
};

const Users = () => {
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    role: "inventory" as UserRole,
    password: "",
    confirmPassword: "",
  });
  
  const handleOpenEditDialog = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setFormData({
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        password: "",
        confirmPassword: "",
      });
      setEditingUser(userId);
      setOpenDialog(true);
    }
  };
  
  const handleOpenNewDialog = () => {
    setFormData({
      username: "",
      name: "",
      email: "",
      role: "inventory",
      password: "",
      confirmPassword: "",
    });
    setEditingUser(null);
    setOpenDialog(true);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match for new users
    if (!editingUser && formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would call an API to create/update the user
    toast({
      title: editingUser ? "Usuario actualizado" : "Usuario creado",
      description: `El usuario ${formData.username} ha sido ${editingUser ? "actualizado" : "creado"} exitosamente`,
    });
    
    setOpenDialog(false);
  };
  
  const handleDeleteUser = (userId: string) => {
    // In a real app, this would call an API to delete the user
    toast({
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado exitosamente",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
        
        <Button onClick={handleOpenNewDialog}>
          <UserPlus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>
      
      <Alert>
        <AlertDescription>
          Los usuarios tienen distintos niveles de acceso según su rol. Solo los administradores pueden gestionar usuarios.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios del Sistema</CardTitle>
          <CardDescription>
            Listado de todos los usuarios registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Fecha de Creación</th>
                  <th>Último Acceso</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-secondary">
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td>{format(new Date(user.createdAt), "dd/MM/yyyy")}</td>
                    <td>
                      {user.lastLogin 
                        ? format(new Date(user.lastLogin), "dd/MM/yyyy HH:mm") 
                        : "Nunca"
                      }
                    </td>
                    <td>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditDialog(user.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          disabled={user.role === 'admin'} // Prevent deleting admin users
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="username">Nombre de Usuario</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  readOnly={!!editingUser} // Don't allow changing username for existing users
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="role">Rol</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Seleccione un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="inventory">Encargado de Inventario</SelectItem>
                    <SelectItem value="production">Supervisor de Producción</SelectItem>
                    <SelectItem value="packaging">Operario de Empaque</SelectItem>
                    <SelectItem value="viewer">Visor de Reportes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {!editingUser && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required={!editingUser}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required={!editingUser}
                    />
                  </div>
                </>
              )}
              
              {editingUser && (
                <div className="grid gap-2">
                  <Label htmlFor="resetPassword">Resetear Contraseña (opcional)</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Dejar en blanco para mantener la actual"
                  />
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingUser ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
