
import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#2C2C2C] p-8">
      <div className="container mx-auto flex justify-between">
        <div className="space-y-4">
          <img 
            src="/lovable-uploads/34e3d519-9ea5-46a9-82e1-2630b4a035dc.png" 
            alt="EURA" 
            className="h-16 w-auto" 
          />
          <div className="space-y-2 text-white">
            <p>C/ Maximiliano Thous 41,1º</p>
            <p>Valencia, España</p>
            <p>963 688 323</p>
            <p>mail@eura.es</p>
          </div>
        </div>
        <div className="w-1/2 h-64">
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
