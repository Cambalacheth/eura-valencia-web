
import { useState } from 'react';
import { Upload } from 'lucide-react';
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
  isNewProject?: boolean;
}

const ProjectImageUpload = ({ 
  projectId, 
  images, 
  onImagesChange, 
  isNewProject = false 
}: ProjectImageUploadProps) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  // Handle file drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const handleImageUpload = async (files: FileList) => {
    const file = files[0];
    if (!file || !projectId) return;

    try {
      // For new projects, we'll store the image temporarily and associate it when the project is created
      if (isNewProject) {
        // Create a unique file path
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('projects')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('projects')
          .getPublicUrl(filePath);

        // Create a temporary image object for the UI
        const tempImage = {
          id: fileName, // Using the filename as temporary ID
          image_url: publicUrl,
          is_cover: images.length === 0
        };

        // Update local state
        const updatedImages = [...images, tempImage];
        onImagesChange(updatedImages);

        toast({
          title: 'Éxito',
          description: 'Imagen subida correctamente. Se guardará cuando cree el proyecto.',
        });

        return;
      }

      // Regular upload for existing projects
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
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Error al subir la imagen',
        variant: 'destructive',
      });
    }
  };

  const handleSetCover = async (imageId: string) => {
    try {
      // For new projects, just update local state
      if (isNewProject) {
        const updatedImages = images.map(img => ({
          ...img,
          is_cover: img.id === imageId
        }));
        
        onImagesChange(updatedImages);
        
        toast({
          title: 'Éxito',
          description: 'Imagen de portada actualizada',
        });
        return;
      }

      // First, set all images as not cover
      const { error: updateAllError } = await supabase
        .from('project_images')
        .update({ is_cover: false })
        .eq('project_id', projectId);

      if (updateAllError) throw updateAllError;

      // Then set the selected image as cover
      const { error: updateOneError } = await supabase
        .from('project_images')
        .update({ is_cover: true })
        .eq('id', imageId);

      if (updateOneError) throw updateOneError;

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
      console.error('Set cover error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Error al actualizar la portada',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      // For new projects, just update local state
      if (isNewProject) {
        const updatedImages = images.filter(img => img.id !== imageId);
        
        // If we removed the cover image, set a new one
        if (images.find(img => img.id === imageId)?.is_cover && updatedImages.length > 0) {
          updatedImages[0].is_cover = true;
        }
        
        onImagesChange(updatedImages);
        
        toast({
          title: 'Éxito',
          description: 'Imagen eliminada correctamente',
        });
        return;
      }

      const { error: deleteError } = await supabase
        .from('project_images')
        .delete()
        .eq('id', imageId);

      if (deleteError) throw deleteError;

      const updatedImages = images.filter(img => img.id !== imageId);
      
      // If we removed the cover image, set a new one if available
      const wasRemovingCoverImage = images.find(img => img.id === imageId)?.is_cover;
      
      if (wasRemovingCoverImage && updatedImages.length > 0) {
        // Set a new cover image
        const newCoverId = updatedImages[0].id;
        const { error: updateError } = await supabase
          .from('project_images')
          .update({ is_cover: true })
          .eq('id', newCoverId);
          
        if (updateError) throw updateError;
          
        // Update the local state
        updatedImages[0].is_cover = true;
      }
      
      onImagesChange(updatedImages);

      toast({
        title: 'Éxito',
        description: 'Imagen eliminada correctamente',
      });
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Error al eliminar la imagen',
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
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
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
        <div 
          className={`flex items-center justify-center w-full h-48 border-2 border-dashed rounded-lg ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">
              {isDragging ? 'Soltar aquí' : 'Agregar imagen (o arrastrar aquí)'}
            </span>
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
