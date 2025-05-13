
import { useIsMobile } from "@/hooks/use-mobile";

const ServiceImages = () => {
  const isMobile = useIsMobile();
  const images = [
    "/lovable-uploads/cc71ac42-bf0e-49d0-8bd2-a401cad228e9.png",
    "/lovable-uploads/f90b8ed1-f94d-4064-a81d-d5904caa73b2.png",
    "/lovable-uploads/3521ba97-4f39-4d85-9ca6-0268932b6c69.png",
    "/lovable-uploads/5008a3a7-c207-44d9-8dea-e39671d6f2e5.png",
    "/lovable-uploads/afa84875-76a6-4932-af22-81eadd591b9f.png"
  ];

  return (
    <div className="bg-gray-600 py-8 md:py-12">
      <div className="container mx-auto">
        <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory px-4 scrollbar-hide">
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Servicio ${index + 1}`}
              className="w-48 h-48 md:w-64 md:h-64 object-cover flex-shrink-0 snap-center rounded-md"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceImages;
