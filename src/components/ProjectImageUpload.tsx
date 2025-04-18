
import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ProjectImage {
  id: string;
  image_url: string;
  is_cover: boolean;
}

interface ProjectImageUploadProps {
  projectId: string;
  images: ProjectImage[];
  onImagesChange: (images: ProjectImage[]) => void;
  isNewProject?: boolean;
  maxImages?: number;
}

const ProjectImageUpload = ({ 
  projectId, 
  images, 
  onImagesChange, 
  isNewProject = false,
  maxImages = 5 
}: ProjectImageUploadProps) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || images.length >= maxImages) return;

    try {
      const uploaders = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `projects/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('projects')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('projects')
          .getPublicUrl(filePath);

        return { 
          id: fileName, 
          image_url: publicUrl, 
          is_cover: images.length === 0 
        };
      });

      const newImages = await Promise.all(uploaders);
      const updatedImages = [...images, ...newImages].slice(0, maxImages);
      
      onImagesChange(updatedImages);

      toast({
        title: 'Éxito',
        description: `${newImages.length} imagen(es) subida(s)`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al subir imágenes',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteImage = (imageId: string) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    
    // Automatically set a new cover if the current cover was deleted
    if (updatedImages.length > 0 && !updatedImages.some(img => img.is_cover)) {
      updatedImages[0].is_cover = true;
    }

    onImagesChange(updatedImages);
  };

  const handleSetCover = (imageId: string) => {
    const updatedImages = images.map(img => ({
      ...img,
      is_cover: img.id === imageId
    }));

    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <AspectRatio ratio={4/3}>
              <img 
                src={image.image_url} 
                alt="Imagen del proyecto" 
                className="w-full h-full object-cover rounded-lg"
              />
            </AspectRatio>
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2 rounded-lg">
              <Button
                variant={image.is_cover ? "default" : "secondary"}
                size="sm"
                onClick={() => handleSetCover(image.id)}
                className="w-full"
              >
                {image.is_cover ? 'Portada ✓' : 'Hacer portada'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteImage(image.id)}
                className="w-full"
              >
                Eliminar
              </Button>
            </div>
            {image.is_cover && (
              <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                Portada
              </div>
            )}
          </div>
        ))}
        {images.length < maxImages && (
          <div 
            className={`flex items-center justify-center aspect-[4/3] border-2 border-dashed rounded-lg ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'}`}
          >
            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-500">
                {`Agregar imagen (${images.length}/${maxImages})`}
              </span>
              <input
                type="file"
                multiple
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectImageUpload;
