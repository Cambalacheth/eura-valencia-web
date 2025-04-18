
const ServiceImages = () => {
  const images = [
    "/lovable-uploads/d5e63232-e698-4b46-9a94-2ab790f78602.png",
    "/lovable-uploads/d6ed35f3-c109-4702-adb7-3c08ab60d80c.png",
    "/lovable-uploads/cc71ac42-bf0e-49d0-8bd2-a401cad228e9.png",
    "/lovable-uploads/f90b8ed1-f94d-4064-a81d-d5904caa73b2.png",
    "/lovable-uploads/3521ba97-4f39-4d85-9ca6-0268932b6c69.png",
    "/lovable-uploads/5008a3a7-c207-44d9-8dea-e39671d6f2e5.png",
    "/lovable-uploads/afa84875-76a6-4932-af22-81eadd591b9f.png"
  ];

  return (
    <div className="container mx-auto py-12">
      <div className="flex justify-center gap-4 overflow-x-auto">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Servicio ${index + 1}`}
            className="w-64 h-64 object-cover"
          />
        ))}
      </div>
    </div>
  );
};

export default ServiceImages;
