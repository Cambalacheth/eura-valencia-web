
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProjectForm from '@/components/ProjectForm';

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

const ProyectosAdmin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | undefined>(undefined);
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
      setLoading(true);
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
        console.error('Error fetching projects:', error);
        toast({
          title: 'Error',
          description: error.message || 'Error al cargar los proyectos',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  const handleCreateProject = async (
    projectData: Omit<Project, 'id'>, 
    tempImages?: ProjectImage[]
  ) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();
      
      if (error) throw error;
      
      // If we have temporary images, save them to the database
      if (tempImages && tempImages.length > 0) {
        console.log('Processing temporary images:', tempImages);
        
        // Map the temporary images to the new project
        const projectImagesData = tempImages.map(img => ({
          project_id: data.id,
          image_url: img.image_url,
          is_cover: img.is_cover
        }));
        
        // Insert all images at once
        const { error: imageError, data: savedImages } = await supabase
          .from('project_images')
          .insert(projectImagesData)
          .select();
          
        if (imageError) {
          console.error('Error saving images:', imageError);
          toast({
            title: 'Advertencia',
            description: 'Proyecto creado, pero hubo un problema al guardar algunas imágenes',
            variant: 'destructive',
          });
        } else {
          console.log('Images saved successfully:', savedImages);
          
          // Update local state with the saved images
          setProjectImages(prev => ({
            ...prev,
            [data.id]: savedImages
          }));
        }
      }
      
      setProjects((prev) => [data, ...prev]);
      setIsCreating(false);
      
      toast({
        title: 'Éxito',
        description: 'Proyecto creado correctamente',
      });
    } catch (error: any) {
      console.error('Create project error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Error al crear el proyecto',
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
      setCurrentProject(undefined);
      
      toast({
        title: 'Éxito',
        description: 'Proyecto actualizado correctamente',
      });
    } catch (error: any) {
      console.error('Update project error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Error al actualizar el proyecto',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.')) {
      return;
    }
    
    try {
      // Delete all project images first
      const { error: imageDeleteError } = await supabase
        .from('project_images')
        .delete()
        .eq('project_id', projectId);
      
      if (imageDeleteError) {
        console.error('Error deleting images:', imageDeleteError);
        // Continue with project deletion even if image deletion fails
      }
      
      // Then delete the project
      const { error: projectDeleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      
      if (projectDeleteError) throw projectDeleteError;
      
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      
      toast({
        title: 'Éxito',
        description: 'Proyecto eliminado correctamente',
      });
    } catch (error: any) {
      console.error('Delete project error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Error al eliminar el proyecto',
        variant: 'destructive',
      });
    }
  };

  const handleImagesChange = (projectId: string, images: ProjectImage[]) => {
    setProjectImages(prev => ({
      ...prev,
      [projectId]: images
    }));
  };

  const categoryLabel = (category: string) => {
    switch (category) {
      case 'viviendas': return 'Viviendas';
      case 'reformas': return 'Reformas';
      case 'comunidades': return 'Comunidades';
      default: return category;
    }
  };

  if (isCreating || currentProject) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => {
                setIsCreating(false);
                setCurrentProject(undefined);
              }}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a la lista
            </Button>
          </div>
          
          <div className="mb-8">
            <h1 className="text-4xl font-light">
              {isCreating ? "Crear Nuevo Proyecto" : "Editar Proyecto"}
            </h1>
          </div>

          <ProjectForm 
            project={currentProject}
            onSubmit={isCreating ? handleCreateProject : handleUpdateProject}
            onCancel={() => {
              setIsCreating(false);
              setCurrentProject(undefined);
            }}
            onImagesChange={currentProject 
              ? (images) => handleImagesChange(currentProject.id, images) 
              : undefined}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-light">Gestión de Proyectos</h1>
          <Button onClick={() => setIsCreating(true)}>
            Nuevo Proyecto
          </Button>
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
                        onClick={() => setCurrentProject(project)}
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </Layout>
  );
};

export default ProyectosAdmin;
