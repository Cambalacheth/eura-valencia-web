
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import ProjectCard from '../../components/ProjectCard';

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

const Reformas = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectImages, setProjectImages] = useState<Record<string, ProjectImage[]>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('category', 'reformas')
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

  // Get cover image for a project
  const getProjectCoverImage = (projectId: string): string | undefined => {
    const images = projectImages[projectId] || [];
    const coverImage = images.find(img => img.is_cover);
    return coverImage?.image_url || images[0]?.image_url;
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-light mb-8">Reformas Restaurantes y Oficinas</h1>
        
        {loading ? (
          <div className="text-center py-8">Cargando proyectos...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8">
            No hay proyectos en esta categoría.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                image={getProjectCoverImage(project.id) || '/placeholder.svg'}
                link={`/proyectos/reformas/${project.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Reformas;
