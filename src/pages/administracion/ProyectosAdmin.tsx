
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
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
                onImagesChange={currentProject 
                  ? (images) => handleImagesChange(currentProject.id, images) 
                  : undefined}
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
