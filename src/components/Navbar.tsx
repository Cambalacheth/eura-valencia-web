import { Link } from 'react-router-dom';
import { Instagram, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const { isAdmin } = useAuth();

  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-2xl">
        <img src="/lovable-uploads/db449622-5d1b-4948-bd31-36b83f3697ac.png" alt="eura" className="h-12" />
      </Link>
      <div className="flex items-center gap-8">
        <Link to="/" className="hover:underline underline-offset-8 decoration-2">Inicio</Link>
        <Link to="/nosotros" className="hover:underline underline-offset-8 decoration-2">Nosotros</Link>
        <Link to="/proyectos" className="hover:underline underline-offset-8 decoration-2">Proyectos</Link>
        <Link to="/servicios" className="hover:underline underline-offset-8 decoration-2">Servicios</Link>
        <Link to="/noticias" className="hover:underline underline-offset-8 decoration-2">Noticias</Link>
        <Link to="/contacto" className="hover:underline underline-offset-8 decoration-2">Contacto</Link>
        {isAdmin && (
          <>
            <Link to="/administracion" className="flex items-center gap-1 hover:underline underline-offset-8 decoration-2">
              <Settings className="w-4 h-4" />
              Administración
            </Link>
          </>
        )}
        <a href="https://www.instagram.com/euraproyectosobrasyservicios" target="_blank" rel="noopener noreferrer">
          <Instagram className="w-5 h-5" />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
