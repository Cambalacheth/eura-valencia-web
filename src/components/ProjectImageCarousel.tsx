import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ProjectImage {
  id: string;
  image_url: string;
  is_cover?: boolean;
}

interface ProjectImageCarouselProps {
  images: ProjectImage[];
  title: string;
}

const ProjectImageCarousel = ({ images, title }: ProjectImageCarouselProps) => {
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!fullScreenMode) return;
      
      if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'Escape') {
        setFullScreenMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullScreenMode]);

  if (images.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No hay imágenes disponibles</p>
      </div>
    );
  }

  return (
    <div className="w-full" tabIndex={0}>
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={image.id}>
              <div 
                className="cursor-pointer"
                onClick={() => {
                  setCurrentImageIndex(index);
                  setFullScreenMode(true);
                }}
              >
                <AspectRatio ratio={4/3} className="bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={image.image_url} 
                    alt={`${title} - Imagen ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                    <Maximize className="w-8 h-8 text-white" />
                  </div>
                </AspectRatio>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>

      {/* Thumbnail gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2 mt-4">
          {images.slice(0, 5).map((image, index) => (
            <div 
              key={image.id} 
              className="aspect-square cursor-pointer rounded-md overflow-hidden"
              onClick={() => {
                setCurrentImageIndex(index);
                setFullScreenMode(true);
              }}
            >
              <img 
                src={image.image_url} 
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover hover:opacity-80 transition-opacity"
              />
            </div>
          ))}
          {images.length > 5 && (
            <div 
              className="aspect-square cursor-pointer rounded-md overflow-hidden bg-gray-200 flex items-center justify-center"
              onClick={() => setFullScreenMode(true)}
            >
              <span className="text-gray-600 font-medium">+{images.length - 5}</span>
            </div>
          )}
        </div>
      )}

      {/* Fullscreen image viewer */}
      {fullScreenMode && (
        <div 
          className="fixed inset-0 z-50 bg-black flex items-center justify-center" 
          onClick={() => setFullScreenMode(false)}
        >
          <div 
            className="relative w-full h-full" 
            onClick={e => e.stopPropagation()}
          >
            <img
              src={images[currentImageIndex].image_url}
              alt={`${title} - Imagen ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            />

            <Button 
              variant="outline" 
              size="icon" 
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 border-none text-white"
              onClick={() => setFullScreenMode(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 border-none text-white"
              onClick={prevImage}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 border-none text-white"
              onClick={nextImage}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center">
              <span className="text-white bg-black/50 px-4 py-2 rounded-md">
                {currentImageIndex + 1} / {images.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectImageCarousel;
