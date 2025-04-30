
import Layout from '../components/Layout';
import ServicesGrid from '../components/ServicesGrid';
import ServiceImages from '../components/ServiceImages';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

const Servicios = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      const container = carouselRef.current.querySelector('[data-embla-container]');
      if (container) {
        container.scrollBy({ left: -300, behavior: 'smooth' });
      }
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const container = carouselRef.current.querySelector('[data-embla-container]');
      if (container) {
        container.scrollBy({ left: 300, behavior: 'smooth' });
      }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-light text-center mb-12">SERVICIOS</h1>
        
        <div ref={carouselRef} className="relative">
          <ServicesGrid />
          
          {/* Mobile navigation buttons */}
          <div className="flex justify-center gap-4 mt-6 md:hidden">
            <Button 
              onClick={scrollLeft}
              variant="outline" 
              size="lg"
              className="flex items-center justify-center h-12 w-12 rounded-full shadow-lg"
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Anterior</span>
            </Button>
            <Button 
              onClick={scrollRight}
              variant="outline" 
              size="lg"
              className="flex items-center justify-center h-12 w-12 rounded-full shadow-lg"
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Siguiente</span>
            </Button>
          </div>
        </div>
        
        <ServiceImages />
      </div>
    </Layout>
  );
};

export default Servicios;
