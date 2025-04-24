
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import ServiceCard from './ServiceCard';

const services = [
  {
    title: "Reformas integrales",
    description: "Transformamos fachadas y eliminamos barreras arquitectónicas, mejorando la accesibilidad y estética de tu edificio, todo con un enfoque en la modernización y el respeto por su esencia.",
    image: "/lovable-uploads/cd4348a8-ae94-463b-aa14-98b1fa681e57.png"
  },
  {
    title: "Redacción de proyectos, gestión de licencias y subvenciones",
    description: "Nos ocupamos de todo el proceso técnico y burocrático: desde la redacción del proyecto y la obtención de licencias hasta la gestión de subvenciones. También realizamos informes de evaluación del edificio para garantizar su seguridad y eficiencia.",
    image: "/lovable-uploads/89e57273-5fe8-4f67-8f22-05bc18f2d04d.png"
  },
  {
    title: "Rehabilitación de edificios",
    description: "Damos nueva vida a edificaciones antiguas, mejorando su eficiencia, seguridad y confort sin perder su esencia.",
    image: "/lovable-uploads/02784e71-22c7-42c3-bcc0-025e4024caa0.png"
  },
  {
    title: "Obra nueva de viviendas unifamiliares",
    description: "Diseñamos y construimos hogares únicos, funcionales y sostenibles, adaptados a tu estilo de vida y necesidades.",
    image: "/lovable-uploads/f13378db-5915-4a5a-afdb-76fc3c6ffaa4.png"
  },
  {
    title: "Trabajos verticales",
    description: "Realizamos trabajos verticales con alpinistas expertos, asegurando mantenimiento y rehabilitación en alturas de manera segura y eficaz en fachadas, tejados y áreas de difícil acceso.",
    image: "/lovable-uploads/65754020-0ebd-4a0d-bbe2-aa427ad006e0.png"
  }
];

const ServicesGrid = () => {
  const isMobile = useIsMobile();

  return (
    <Carousel 
      opts={{
        align: "start",
        loop: true,
        slidesToScroll: 1,
        containScroll: "trimSnaps"
      }}
      className="w-full max-w-7xl mx-auto"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {services.map((service, index) => (
          <CarouselItem 
            key={index} 
            className="pl-2 md:pl-4 basis-full md:basis-1/3"
          >
            <ServiceCard
              title={service.title}
              description={service.description}
              image={service.image}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="hidden md:block">
        <CarouselPrevious className="-left-12" />
        <CarouselNext className="-right-12" />
      </div>
    </Carousel>
  );
};

export default ServicesGrid;
