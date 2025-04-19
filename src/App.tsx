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
import ProjectDetail from "./pages/proyectos/ProjectDetail";
import Servicios from "./pages/Servicios";
import Noticias from "./pages/Noticias";
import Contacto from "./pages/Contacto";
import Admin from "./pages/Admin";
import Administracion from "./pages/Administracion";
import ProyectosAdmin from "./pages/administracion/ProyectosAdmin";
import NoticiasAdmin from "./pages/administracion/NoticiasAdmin";
import NotFound from "./pages/NotFound";
import NoticiaDetalle from "./pages/NoticiaDetalle";
import TerminosCondiciones from "./pages/TerminosCondiciones";
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad";

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
            <Route path="/proyectos/viviendas/:id" element={<ProjectDetail category="viviendas" />} />
            <Route path="/proyectos/reformas" element={<Reformas />} />
            <Route path="/proyectos/reformas/:id" element={<ProjectDetail category="reformas" />} />
            <Route path="/proyectos/comunidades" element={<Comunidades />} />
            <Route path="/proyectos/comunidades/:id" element={<ProjectDetail category="comunidades" />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/noticias/:id" element={<NoticiaDetalle />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/administracion" element={<Administracion />} />
            <Route path="/administracion/proyectos" element={<ProyectosAdmin />} />
            <Route path="/administracion/noticias" element={<NoticiasAdmin />} />
            <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />
            <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
