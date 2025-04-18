
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ServiceCard from './ServiceCard';

const services = [
  {
    title: "Redacción de proyectos, gestión de licencias y subvenciones",
    description: "Nos ocupamos de todo el proceso técnico y burocrático: desde la redacción del proyecto y la obtención de licencias hasta la gestión de subvenciones. También realizamos informes de evaluación del edificio para garantizar su seguridad y eficiencia.",
    image: "/lovable-uploads/89e57273-5fe8-4f67-8f22-05bc18f2d04d.png"
  },
  {
    title: "Obra nueva de viviendas unifamiliares",
    description: "Diseñamos y construimos hogares únicos, funcionales y sostenibles, adaptados a tu estilo de vida y necesidades.",
    image: "/lovable-uploads/ab938959-4860-462b-b782-3cbadb271c17.png"
  },
  {
    title: "Rehabilitación de edificios",
    description: "Damos nueva vida a edificaciones antiguas, mejorando su eficiencia, seguridad y confort sin perder su esencia.",
    image: "/lovable-uploads/5aa295e0-5d63-4b25-86a1-1275a29b8d0b.png"
  },
  {
    title: "Reformas integrales",
    description: "Transformamos fachadas y eliminamos barreras arquitectónicas, mejorando la accesibilidad y estética de tu edificio, todo con un enfoque en la modernización y el respeto por su esencia.",
    image: "/lovable-uploads/b55232a4-3d6e-4398-8125-00c60d8f0c98.png"
  },
  {
    title: "Trabajos verticales",
    description: "Realizamos trabajos verticales con alpinistas expertos, asegurando mantenimiento y rehabilitación en alturas de manera segura y eficaz en fachadas, tejados y áreas de difícil acceso.",
    image: "/lovable-uploads/65754020-0ebd-4a0d-bbe2-aa427ad006e0.png"
  }
];

const ServicesGrid = () => {
  return (
    <Carousel className="w-full max-w-5xl mx-auto">
      <CarouselContent>
        {services.map((service, index) => (
          <CarouselItem key={index}>
            <ServiceCard
              title={service.title}
              description={service.description}
              image={service.image}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
};

export default ServicesGrid;
