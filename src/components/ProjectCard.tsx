
import { Link } from 'react-router-dom';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ProjectCardProps {
  title: string;
  image: string;
  link: string;
  category?: string;
}

interface SubProject {
  id: string;
  title: string;
  image_url?: string;
}

const ProjectCard = ({ title, image, link, category }: ProjectCardProps) => {
  const { data: subProjects } = useQuery({
    queryKey: ['subProjects', category],
    queryFn: async () => {
      if (!category) return [];
      
      const { data: projects } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          project_images!inner(image_url)
        `)
        .eq('category', category)
        .order('created_at', { ascending: false })
        .limit(3);

      return projects?.map(project => ({
        id: project.id,
        title: project.title,
        image_url: project.project_images?.[0]?.image_url
      })) || [];
    },
    enabled: !!category
  });

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link to={link} className="block w-full h-full group">
          <div className="relative overflow-hidden rounded-xl h-full shadow-lg transform transition-all duration-300 hover:scale-[1.02]">
            <AspectRatio ratio={4/3}>
              <div className="relative w-full h-full">
                <img src={image} alt={title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-all duration-300 group-hover:bg-black/40">
                  <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-light text-center px-8">{title}</h3>
                </div>
              </div>
            </AspectRatio>
          </div>
        </Link>
      </HoverCardTrigger>
      {subProjects && subProjects.length > 0 && (
        <HoverCardContent className="w-80 p-0">
          <div className="grid gap-2">
            {subProjects.map((subProject: SubProject) => (
              <Link 
                key={subProject.id} 
                to={`${link}/${subProject.id}`}
                className="block group relative overflow-hidden rounded-lg"
              >
                <AspectRatio ratio={16/9}>
                  <div className="relative w-full h-full">
                    <img 
                      src={subProject.image_url || '/placeholder.svg'} 
                      alt={subProject.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 group-hover:bg-black/50">
                      <h4 className="text-white text-lg font-light text-center px-4">{subProject.title}</h4>
                    </div>
                  </div>
                </AspectRatio>
              </Link>
            ))}
          </div>
        </HoverCardContent>
      )}
    </HoverCard>
  );
};

export default ProjectCard;
