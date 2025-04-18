
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./context/AuthContext";

import Index from "./pages/Index";
import Nosotros from "./pages/Nosotros";
import Proyectos from "./pages/Proyectos";
import Viviendas from "./pages/proyectos/Viviendas";
import Reformas from "./pages/proyectos/Reformas";
import Comunidades from "./pages/proyectos/Comunidades";
import Servicios from "./pages/Servicios";
import Noticias from "./pages/Noticias";
import Contacto from "./pages/Contacto";
import Admin from "./pages/Admin";
import Administracion from "./pages/Administracion";
import ProyectosAdmin from "./pages/administracion/ProyectosAdmin";
import NoticiasAdmin from "./pages/administracion/NoticiasAdmin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/proyectos" element={<Proyectos />} />
            <Route path="/proyectos/viviendas" element={<Viviendas />} />
            <Route path="/proyectos/reformas" element={<Reformas />} />
            <Route path="/proyectos/comunidades" element={<Comunidades />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/administracion" element={<Administracion />} />
            <Route path="/administracion/proyectos" element={<ProyectosAdmin />} />
            <Route path="/administracion/noticias" element={<NoticiasAdmin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
