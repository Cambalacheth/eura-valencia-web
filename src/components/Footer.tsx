
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#404c54] p-6 md:p-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-4">
            <img 
              src="/lovable-uploads/34e3d519-9ea5-46a9-82e1-2630b4a035dc.png" 
              alt="EURA" 
              className="h-16 w-auto" 
            />
            <div className="space-y-2 text-white">
              <p>C/ Maximiliano Thous 41,1º</p>
              <p>Valencia, España</p>
              <p className="flex items-center">
                <a 
                  href="tel:+34963688323" 
                  className="hover:underline"
                >
                  +34 963 688 323
                </a>
              </p>
              <p className="flex items-center">
                <a 
                  href="mailto:mail@eura.es" 
                  className="hover:underline"
                  translate="no" // Prevents translation of email address
                >
                  mail@eura.es
                </a>
              </p>
              <div className="md:hidden flex items-center gap-2 pt-2">
                <a 
                  href="https://www.instagram.com/euraproyectosobrasyservicios" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white"
                >
                  <Instagram className="w-5 h-5" />
                  <span>Síguenos en Instagram</span>
                </a>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-48 md:h-64">
            <a 
              href="https://maps.app.goo.gl/cYw3i3gGZSg39er76" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <iframe
                title="ubicacion"
                width="100%"
                height="100%"
                frameBorder="0"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3079.744193255742!2d-0.3735286!3d39.4831417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd604f53c8d43d21%3A0xb13de63957ee6c05!2sC%2F%20Maximiliano%20Thous%2C%2041%2C%201%C2%BA%2C%2046009%20Valencia!5e0!3m2!1sen!2ses!4v1650000000000!5m2!1sen!2ses"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg shadow-lg"
              ></iframe>
            </a>
          </div>
        </div>
        {/* Enlaces ocultos temporalmente
        <div className="mt-8 pt-4 border-t border-gray-600">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-300">
            <Link to="/terminos-condiciones" className="hover:underline">
              Términos y Condiciones
            </Link>
            <Link to="/politica-privacidad" className="hover:underline">
              Política de Privacidad
            </Link>
          </div>
        </div>
        */}
      </div>
    </footer>
  );
};

export default Footer;
