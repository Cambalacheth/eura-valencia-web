import { useState, useEffect } from 'react';
import { supabase, VALID_PROJECT_CATEGORIES } from '@/integrations/supabase/client';
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
  onSubmit: (data: Omit<Project, 'id'>, tempImages?: ProjectImage[]) => void;
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
  const [category, setCategory] = useState(project?.category || VALID_PROJECT_CATEGORIES[0]);
  const [location, setLocation] = useState(project?.location || '');
  const [projectDesc, setProjectDesc] = useState(project?.project || '');
  const [construction, setConstruction] = useState(project?.construction || '');
  const [completion, setCompletion] = useState(project?.completion || '');
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [tempProjectId] = useState(`temp-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (project) {
      const fetchImages = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('project_images')
            .select('*')
            .eq('project_id', project.id);

          if (error) {
            throw error;
          }

          setProjectImages(data || []);
          if (onImagesChange) onImagesChange(data || []);
        } catch (error: any) {
          console.error('Error fetching images:', error);
          toast({
            title: 'Error',
            description: 'No se pudieron cargar las imágenes',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      };

      fetchImages();
    }
  }, [project, toast, onImagesChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!VALID_PROJECT_CATEGORIES.includes(category as any)) {
      toast({
        title: 'Error',
        description: 'Categoría no válida. Seleccione una de las opciones disponibles.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!project && projectImages.length > 0) {
      onSubmit({
        title,
        category,
        location,
        project: projectDesc,
        construction,
        completion
      }, projectImages);
    } else {
      onSubmit({
        title,
        category,
        location,
        project: projectDesc,
        construction,
        completion
      });
    }
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
            placeholder="Nombre del proyecto"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Select
            value={category}
            onValueChange={(value) => setCategory(value)}
            required
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {VALID_PROJECT_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === 'viviendas' ? 'Viviendas' : 
                   cat === 'reformas' ? 'Reformas' : 
                   cat === 'comunidades' ? 'Comunidades' : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Ubicación</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Localización del proyecto"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="projectDesc">Descripción del Proyecto</Label>
          <Textarea
            id="projectDesc"
            value={projectDesc}
            onChange={(e) => setProjectDesc(e.target.value)}
            rows={4}
            placeholder="Descripción del proyecto"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="construction">Construcción</Label>
          <Input
            id="construction"
            value={construction}
            onChange={(e) => setConstruction(e.target.value)}
            placeholder="Detalles de construcción"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="completion">Finalización</Label>
          <Input
            id="completion"
            value={completion}
            onChange={(e) => setCompletion(e.target.value)}
            placeholder="Fecha o año de finalización"
          />
        </div>

        <div className="space-y-4 pt-4">
          <Label className="text-lg font-medium">Imágenes del Proyecto</Label>
          {loading ? (
            <div className="text-center py-8">Cargando imágenes...</div>
          ) : (
            <ProjectImageUpload 
              projectId={project ? project.id : tempProjectId}
              images={projectImages}
              onImagesChange={handleImagesChange}
              isNewProject={!project}
            />
          )}
        </div>
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
