
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import Layout from '../../components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Maximize, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { VALID_PROJECT_CATEGORIES, type ProjectCategory } from '@/integrations/supabase/client';

interface ProjectDetailProps {
  category: ProjectCategory;
}

interface Project {
  id: string;
  title: string;
  category: string;
  location?: string;
  project?: string;
  construction?: string;
  completion?: string;
  website?: string;
}

interface ProjectImage {
  id: string;
  image_url: string;
  is_cover: boolean;
}

const ProjectDetail = ({ category }: ProjectDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullScreenMode, setFullScreenMode] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!id || !VALID_PROJECT_CATEGORIES.includes(category)) {
        navigate('/404');
        return;
      }

      setLoading(true);
      try {
        // Fetch project data
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .eq('category', category)
          .maybeSingle();
        
        if (projectError) throw projectError;
        if (!projectData) {
          navigate('/404');
          return;
        }
        
        // Fetch project images
        const { data: imagesData, error: imagesError } = await supabase
          .from('project_images')
          .select('*')
          .eq('project_id', id)
          .order('is_cover', { ascending: false });
        
        if (imagesError) throw imagesError;
        
        setProject(projectData);
        setImages(imagesData || []);
      } catch (error: any) {
        console.error('Error fetching project details:', error);
        toast({
          title: 'Error',
          description: error.message || 'Error al cargar el proyecto',
          variant: 'destructive',
        });
        navigate('/404');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id, category, navigate, toast]);

  // Handle keyboard navigation in fullscreen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!fullScreenMode) return;
      
      if (e.key === 'ArrowLeft') {
        setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Escape') {
        setFullScreenMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullScreenMode, images.length]);

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="space-y-8">
            <Skeleton className="h-12 w-3/4" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Skeleton className="h-[400px] w-full rounded-lg" />
              <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-light">{project.title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Main carousel */}
          <div className="w-full">
            {images.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={image.id}>
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="cursor-pointer">
                            <AspectRatio ratio={4/3} className="bg-gray-100 rounded-lg overflow-hidden">
                              <img 
                                src={image.image_url} 
                                alt={`${project.title} - Imagen ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                                <Maximize className="w-8 h-8 text-white" />
                              </div>
                            </AspectRatio>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl" onOpenAutoFocus={(e) => e.preventDefault()}>
                          <div className="relative pt-10">
                            <img 
                              src={image.image_url} 
                              alt={`${project.title} - Imagen ${index + 1}`}
                              className="w-full h-auto object-contain max-h-[70vh]"
                            />
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="absolute top-0 right-0"
                              onClick={() => {
                                setCurrentImageIndex(index);
                                setFullScreenMode(true);
                              }}
                            >
                              <Maximize className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-center text-sm text-gray-500 mt-2">
                            {index + 1} / {images.length}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </>
                )}
              </Carousel>
            ) : (
              <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No hay imágenes disponibles</p>
              </div>
            )}

            {/* Thumbnail gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2 mt-4">
                {images.slice(0, 5).map((image, index) => (
                  <div 
                    key={image.id} 
                    className="aspect-square cursor-pointer rounded-md overflow-hidden"
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setFullScreenMode(true);
                    }}
                  >
                    <img 
                      src={image.image_url} 
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                    />
                  </div>
                ))}
                {images.length > 5 && (
                  <div 
                    className="aspect-square cursor-pointer rounded-md overflow-hidden bg-gray-200 flex items-center justify-center"
                    onClick={() => setFullScreenMode(true)}
                  >
                    <span className="text-gray-600 font-medium">+{images.length - 5}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Project details */}
          <div className="space-y-4">
            {project.construction && (
              <div>
                <h3 className="text-sm text-gray-500 uppercase">Construcción</h3>
                <p className="text-lg">{project.construction}</p>
              </div>
            )}
            
            {project.location && (
              <div>
                <h3 className="text-sm text-gray-500 uppercase">Ubicación</h3>
                <p className="text-lg">{project.location}</p>
              </div>
            )}
            
            {project.project && (
              <div>
                <h3 className="text-sm text-gray-500 uppercase">Proyecto</h3>
                <p className="text-lg">{project.project}</p>
              </div>
            )}
            
            {project.completion && (
              <div>
                <h3 className="text-sm text-gray-500 uppercase">Finalización</h3>
                <p className="text-lg">{project.completion}</p>
              </div>
            )}
            
            {project.website && (
              <div>
                <h3 className="text-sm text-gray-500 uppercase">Website</h3>
                <a 
                  href={project.website.startsWith('http') ? project.website : `https://${project.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {project.website}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen image viewer */}
      {fullScreenMode && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="relative w-full h-full">
            <img 
              src={images[currentImageIndex].image_url} 
              alt={`${project.title} - Imagen a pantalla completa`}
              className="max-w-full max-h-full m-auto object-contain"
            />
            
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 border-none text-white"
              onClick={() => setFullScreenMode(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            
            <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-black/50 hover:bg-black/70 border-none text-white"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              
              <span className="text-white bg-black/50 px-4 py-2 rounded-md">
                {currentImageIndex + 1} / {images.length}
              </span>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-black/50 hover:bg-black/70 border-none text-white"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ProjectDetail;
