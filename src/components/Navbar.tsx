
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const { isAdmin } = useAuth();

  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-2xl font-light">eura</Link>
      <div className="flex items-center gap-8">
        <Link to="/" className="hover:underline underline-offset-8 decoration-2">Inicio</Link>
        <Link to="/nosotros" className="hover:underline underline-offset-8 decoration-2">Nosotros</Link>
        <Link to="/proyectos" className="hover:underline underline-offset-8 decoration-2">Proyectos</Link>
        <Link to="/servicios" className="hover:underline underline-offset-8 decoration-2">Servicios</Link>
        <Link to="/noticias" className="hover:underline underline-offset-8 decoration-2">Noticias</Link>
        <Link to="/contacto" className="hover:underline underline-offset-8 decoration-2">Contacto</Link>
        {isAdmin && (
          <Link to="/admin" className="hover:underline underline-offset-8 decoration-2">Admin</Link>
        )}
        <a href="https://www.instagram.com/euraproyectosobrasyservicios" target="_blank" rel="noopener noreferrer">
          <Instagram className="w-5 h-5" />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
