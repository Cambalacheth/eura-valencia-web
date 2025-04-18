
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ProjectImageUpload from '@/components/ProjectImageUpload';

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

const ProjectForm = ({ 
  project, 
  onSubmit, 
  onCancel,
  onImagesChange
}: { 
  project?: Project, 
  onSubmit: (data: Omit<Project, 'id'>) => void,
  onCancel: () => void,
  onImagesChange?: (images: ProjectImage[]) => void
}) => {
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

  const handleImageUpload = async (files: FileList) => {
    const file = files[0];
    if (!file || !project) return;

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
            project_id: project.id,
            image_url: publicUrl,
            is_cover: projectImages.length === 0 
          }
        ])
        .select()
        .single();

      if (dbError) throw dbError;

      setProjectImages(prev => [...prev, data]);
      if (onImagesChange) onImagesChange([...projectImages, data]);

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
        .eq('project_id', project?.id);

      // Then set the selected image as cover
      await supabase
        .from('project_images')
        .update({ is_cover: true })
        .eq('id', imageId);

      // Update local state
      const updatedImages = projectImages.map(img => ({
        ...img,
        is_cover: img.id === imageId
      }));

      setProjectImages(updatedImages);
      if (onImagesChange) onImagesChange(updatedImages);

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

      const updatedImages = projectImages.filter(img => img.id !== imageId);
      setProjectImages(updatedImages);
      if (onImagesChange) onImagesChange(updatedImages);

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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {projectImages.map((image) => (
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

const ProyectosAdmin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | undefined>(undefined);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [projectImages, setProjectImages] = useState<Record<string, ProjectImage[]>>({});

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Fetch projects and their images
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (projectsError) throw projectsError;
        
        const { data: imagesData, error: imagesError } = await supabase
          .from('project_images')
          .select('*');
        
        if (imagesError) throw imagesError;
        
        // Group images by project_id
        const imagesByProject = imagesData.reduce((acc: Record<string, ProjectImage[]>, img) => {
          if (!acc[img.project_id]) {
            acc[img.project_id] = [];
          }
          acc[img.project_id].push(img);
          return acc;
        }, {});
        
        setProjects(projectsData || []);
        setProjectImages(imagesByProject);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  const handleCreateProject = async (projectData: Omit<Project, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();
      
      if (error) throw error;
      
      setProjects((prev) => [data, ...prev]);
      setOpenDialog(false);
      
      toast({
        title: 'Éxito',
        description: 'Proyecto creado correctamente',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleUpdateProject = async (projectData: Omit<Project, 'id'>) => {
    if (!currentProject) return;
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', currentProject.id)
        .select()
        .single();
      
      if (error) throw error;
      
      setProjects((prev) => 
        prev.map((p) => (p.id === currentProject.id ? data : p))
      );
      setOpenDialog(false);
      setCurrentProject(undefined);
      
      toast({
        title: 'Éxito',
        description: 'Proyecto actualizado correctamente',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    
    try {
      // Delete all project images
      await supabase
        .from('project_images')
        .delete()
        .eq('project_id', projectToDelete);
      
      // Delete the project
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectToDelete);
      
      if (error) throw error;
      
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete));
      setDeleteConfirmOpen(false);
      setProjectToDelete(null);
      
      toast({
        title: 'Éxito',
        description: 'Proyecto eliminado correctamente',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const categoryLabel = (category: string) => {
    switch (category) {
      case 'viviendas': return 'Viviendas';
      case 'reformas': return 'Reformas';
      case 'comunidades': return 'Comunidades';
      default: return category;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-light">Gestión de Proyectos</h1>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Nuevo Proyecto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {currentProject ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
                </DialogTitle>
                <DialogDescription>
                  {currentProject 
                    ? 'Modifica los detalles del proyecto existente.' 
                    : 'Añade un nuevo proyecto al sitio web.'}
                </DialogDescription>
              </DialogHeader>
              <ProjectForm 
                project={currentProject} 
                onSubmit={currentProject ? handleUpdateProject : handleCreateProject}
                onCancel={() => {
                  setOpenDialog(false);
                  setCurrentProject(undefined);
                }}
                onImagesChange={(images) => {
                  if (currentProject) {
                    setProjectImages(prev => ({
                      ...prev,
                      [currentProject.id]: images
                    }));
                  }
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-8">Cargando proyectos...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8">
            No hay proyectos. Crea el primero con el botón de arriba.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Imágenes</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>{categoryLabel(project.category)}</TableCell>
                  <TableCell>{project.location || '-'}</TableCell>
                  <TableCell>{projectImages[project.id]?.length || 0} imágenes</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                          setCurrentProject(project);
                          setOpenDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                          setProjectToDelete(project.id);
                          setDeleteConfirmOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteProject}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ProyectosAdmin;
