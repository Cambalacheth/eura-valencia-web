
import { useIsMobile } from "@/hooks/use-mobile";

const Hero = () => {
  const isMobile = useIsMobile();
  
  const images = [
    "/lovable-uploads/cc71ac42-bf0e-49d0-8bd2-a401cad228e9.png",
    "/lovable-uploads/f90b8ed1-f94d-4064-a81d-d5904caa73b2.png",
    "/lovable-uploads/3521ba97-4f39-4d85-9ca6-0268932b6c69.png",
    "/lovable-uploads/5008a3a7-c207-44d9-8dea-e39671d6f2e5.png",
    "/lovable-uploads/afa84875-76a6-4932-af22-81eadd591b9f.png"
  ];

  return (
    <div className="w-full bg-gray-600 text-white py-8 md:py-16">
      <div className="container mx-auto text-center px-4">
        <h1 className="text-3xl md:text-4xl font-light uppercase mb-4 px-2">
          "La arquitectura es la manifestación artística de la construcción"
        </h1>
        <p className="text-lg md:text-xl mb-6">Frank Lloyd Wright</p>
        <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory px-2 md:px-4 mt-6 scrollbar-hide">
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Proyecto ${index + 1}`}
              className="w-36 h-36 md:w-48 md:h-48 object-cover flex-shrink-0 snap-center rounded-md"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
