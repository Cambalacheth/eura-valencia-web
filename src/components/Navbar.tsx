
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const { isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <nav className="w-full px-6 py-4 bg-white/95 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-2xl">
          <img alt="eura" className="h-16 w-auto" src="/lovable-uploads/95252566-91fc-464d-8826-37dcc103a140.png" />
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="hover:underline underline-offset-8 decoration-2">Inicio</Link>
          <Link to="/nosotros" className="hover:underline underline-offset-8 decoration-2">Nosotros</Link>
          <Link to="/proyectos" className="hover:underline underline-offset-8 decoration-2">Proyectos</Link>
          <Link to="/servicios" className="hover:underline underline-offset-8 decoration-2">Servicios</Link>
          <Link to="/noticias" className="hover:underline underline-offset-8 decoration-2">Noticias</Link>
          <Link to="/contacto" className="hover:underline underline-offset-8 decoration-2">Contacto</Link>
          {isAdmin && (
            <Link to="/administracion" className="flex items-center gap-1 hover:underline underline-offset-8 decoration-2">
              <Settings className="w-4 h-4" />
              Administración
            </Link>
          )}
          <a href="https://www.instagram.com/euraproyectosobrasyservicios" target="_blank" rel="noopener noreferrer">
            <Instagram className="w-5 h-5" />
          </a>
        </div>
        
        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[84px] bg-white z-40 p-4">
          <div className="flex flex-col space-y-6 text-lg">
            <Link to="/" className="py-2 hover:bg-gray-100 px-4 rounded-md" onClick={toggleMenu}>Inicio</Link>
            <Link to="/nosotros" className="py-2 hover:bg-gray-100 px-4 rounded-md" onClick={toggleMenu}>Nosotros</Link>
            <Link to="/proyectos" className="py-2 hover:bg-gray-100 px-4 rounded-md" onClick={toggleMenu}>Proyectos</Link>
            <Link to="/servicios" className="py-2 hover:bg-gray-100 px-4 rounded-md" onClick={toggleMenu}>Servicios</Link>
            <Link to="/noticias" className="py-2 hover:bg-gray-100 px-4 rounded-md" onClick={toggleMenu}>Noticias</Link>
            <Link to="/contacto" className="py-2 hover:bg-gray-100 px-4 rounded-md" onClick={toggleMenu}>Contacto</Link>
            {isAdmin && (
              <Link to="/administracion" className="flex items-center gap-1 py-2 hover:bg-gray-100 px-4 rounded-md" onClick={toggleMenu}>
                <Settings className="w-4 h-4" />
                Administración
              </Link>
            )}
            <div className="pt-4 border-t">
              <a 
                href="https://www.instagram.com/euraproyectosobrasyservicios" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Instagram className="w-5 h-5" />
                <span>Síguenos en Instagram</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
