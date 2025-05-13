
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Home, BarChart, Package, Clipboard, Users, LogOut, Menu, Settings, Database } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserRole } from "@/types";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { currentUser, logout, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: Home,
      roles: ["admin", "inventory", "production", "packaging", "viewer"] as UserRole[],
    },
    {
      title: "Inventario",
      path: "/inventory",
      icon: Package,
      roles: ["admin", "inventory", "production"] as UserRole[],
    },
    {
      title: "Empaquetado",
      path: "/packaging",
      icon: Package,
      roles: ["admin", "inventory", "packaging"] as UserRole[],
    },
    {
      title: "Producción",
      path: "/production",
      icon: Clipboard,
      roles: ["admin", "inventory", "production"] as UserRole[],
    },
    {
      title: "Almacenamiento",
      path: "/storage",
      icon: Database,
      roles: ["admin", "inventory", "production"] as UserRole[],
    },
    {
      title: "Reportes",
      path: "/reports",
      icon: BarChart,
      roles: ["admin", "inventory", "production", "viewer"] as UserRole[],
    },
    {
      title: "Usuarios",
      path: "/users",
      icon: Users,
      roles: ["admin"] as UserRole[],
    },
    {
      title: "Configuración",
      path: "/settings",
      icon: Settings,
      roles: ["admin"] as UserRole[],
    },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
          <SidebarHeader className="p-4">
            <div className="flex flex-col items-center space-y-2">
              <div className="text-xl font-bold text-white">Hielo Polar</div>
              <div className="text-xs text-sidebar-foreground/70">Sistema de Gestión</div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-sidebar-foreground/70">Navegación</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems
                    .filter((item) => hasPermission(item.roles))
                    .map((item) => (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton
                          className={location.pathname === item.path ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                          onClick={() => navigate(item.path)}
                        >
                          <div className="flex items-center space-x-3">
                            <item.icon className="h-5 w-5" />
                            <span>{item.title}</span>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between px-4 border-b bg-white dark:bg-background">
            <div className="flex items-center">
              <SidebarTrigger>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
              </SidebarTrigger>
              <h1 className="text-lg font-semibold">
                {menuItems.find((item) => item.path === location.pathname)?.title || "Hielo Polar"}
              </h1>
            </div>
            
            {currentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
                    </Avatar>
                    <span>{currentUser.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <span className="text-sm">Usuario: {currentUser.username}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span className="text-sm">Rol: {currentUser.role}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
          
          <footer className="h-12 border-t flex items-center justify-center text-sm text-muted-foreground">
            &copy; 2024 Hielo Polar del Centro
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
