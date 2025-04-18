
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProjectImageUpload from './ProjectImageUpload';

interface Project {
  id: string;
  title: string;
  category: string;
  location?: string;
  project?: string;
  construction?: string;
  completion?: string;
}

interface ProjectImage {
  id: string;
  image_url: string;
  is_cover: boolean;
}

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: Omit<Project, 'id'>) => void;
  onCancel: () => void;
  onImagesChange?: (images: ProjectImage[]) => void;
}

const ProjectForm = ({
  project,
  onSubmit,
  onCancel,
  onImagesChange
}: ProjectFormProps) => {
  const [title, setTitle] = useState(project?.title || '');
  const [category, setCategory] = useState(project?.category || 'viviendas');
  const [location, setLocation] = useState(project?.location || '');
  const [projectDesc, setProjectDesc] = useState(project?.project || '');
  const [construction, setConstruction] = useState(project?.construction || '');
  const [completion, setCompletion] = useState(project?.completion || '');
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (project) {
      const fetchImages = async () => {
        const { data, error } = await supabase
          .from('project_images')
          .select('*')
          .eq('project_id', project.id);

        if (error) {
          toast({
            title: 'Error',
            description: 'No se pudieron cargar las imágenes',
            variant: 'destructive',
          });
          return;
        }

        setProjectImages(data);
        if (onImagesChange) onImagesChange(data);
      };

      fetchImages();
    }
  }, [project, toast, onImagesChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      category,
      location,
      project: projectDesc,
      construction,
      completion
    });
  };

  const handleImagesChange = (images: ProjectImage[]) => {
    setProjectImages(images);
    if (onImagesChange) onImagesChange(images);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Select
            value={category}
            onValueChange={(value) => setCategory(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viviendas">Viviendas</SelectItem>
              <SelectItem value="reformas">Reformas</SelectItem>
              <SelectItem value="comunidades">Comunidades</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Ubicación</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="projectDesc">Descripción del Proyecto</Label>
          <Textarea
            id="projectDesc"
            value={projectDesc}
            onChange={(e) => setProjectDesc(e.target.value)}
            rows={4}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="construction">Construcción</Label>
          <Input
            id="construction"
            value={construction}
            onChange={(e) => setConstruction(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="completion">Finalización</Label>
          <Input
            id="completion"
            value={completion}
            onChange={(e) => setCompletion(e.target.value)}
          />
        </div>

        {project && (
          <div className="space-y-4">
            <Label>Imágenes del Proyecto</Label>
            <ProjectImageUpload 
              projectId={project.id} 
              images={projectImages} 
              onImagesChange={handleImagesChange} 
            />
          </div>
        )}
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {project ? 'Actualizar Proyecto' : 'Crear Proyecto'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ProjectForm;
