
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

interface Project {
  id: string;
  title: string;
  category: string;
  location?: string;
  project?: string;
  construction?: string;
  completion?: string;
}

const ProjectForm = ({ 
  project, 
  onSubmit, 
  onCancel
}: { 
  project?: Project, 
  onSubmit: (data: Omit<Project, 'id'>) => void,
  onCancel: () => void 
}) => {
  const [title, setTitle] = useState(project?.title || '');
  const [category, setCategory] = useState(project?.category || 'viviendas');
  const [location, setLocation] = useState(project?.location || '');
  const [projectDesc, setProjectDesc] = useState(project?.project || '');
  const [construction, setConstruction] = useState(project?.construction || '');
  const [completion, setCompletion] = useState(project?.completion || '');

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setProjects(data || []);
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

  const openEditDialog = (project: Project) => {
    setCurrentProject(project);
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setCurrentProject(undefined);
  };

  const confirmDelete = (id: string) => {
    setProjectToDelete(id);
    setDeleteConfirmOpen(true);
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
            <DialogContent className="sm:max-w-[500px]">
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
                onCancel={closeDialog}
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
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>{categoryLabel(project.category)}</TableCell>
                  <TableCell>{project.location || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => openEditDialog(project)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => confirmDelete(project.id)}
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
