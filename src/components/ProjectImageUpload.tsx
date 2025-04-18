
import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProjectImage {
  id: string;
  image_url: string;
  is_cover: boolean;
}

interface ProjectImageUploadProps {
  projectId: string;
  images: ProjectImage[];
  onImagesChange: (images: ProjectImage[]) => void;
}

const ProjectImageUpload = ({ projectId, images, onImagesChange }: ProjectImageUploadProps) => {
  const { toast } = useToast();

  const handleImageUpload = async (files: FileList) => {
    const file = files[0];
    if (!file || !projectId) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('projects')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('projects')
        .getPublicUrl(filePath);

      const { data, error: dbError } = await supabase
        .from('project_images')
        .insert([
          { 
            project_id: projectId,
            image_url: publicUrl,
            is_cover: images.length === 0 
          }
        ])
        .select()
        .single();

      if (dbError) throw dbError;

      const updatedImages = [...images, data];
      onImagesChange(updatedImages);

      toast({
        title: 'Éxito',
        description: 'Imagen subida correctamente',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSetCover = async (imageId: string) => {
    try {
      // First, set all images as not cover
      await supabase
        .from('project_images')
        .update({ is_cover: false })
        .eq('project_id', projectId);

      // Then set the selected image as cover
      await supabase
        .from('project_images')
        .update({ is_cover: true })
        .eq('id', imageId);

      // Update local state
      const updatedImages = images.map(img => ({
        ...img,
        is_cover: img.id === imageId
      }));

      onImagesChange(updatedImages);

      toast({
        title: 'Éxito',
        description: 'Imagen de portada actualizada',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('project_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      const updatedImages = images.filter(img => img.id !== imageId);
      onImagesChange(updatedImages);

      toast({
        title: 'Éxito',
        description: 'Imagen eliminada correctamente',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <img 
              src={image.image_url} 
              alt="Imagen del proyecto" 
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                variant={image.is_cover ? "default" : "secondary"}
                size="sm"
                onClick={() => handleSetCover(image.id)}
              >
                {image.is_cover ? 'Portada' : 'Hacer portada'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteImage(image.id)}
              >
                Eliminar
              </Button>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-center w-full h-48 border-2 border-dashed rounded-lg">
          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
            <ImageIcon className="w-8 h-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">Agregar imagen</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProjectImageUpload;
