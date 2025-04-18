
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import MDEditor from "@uiw/react-md-editor";

interface News {
  id: string;
  title: string;
  formatted_content?: string;
  image_url?: string;
  link_url?: string;
  published_at: string;
}

const Noticias = () => {
  const { toast } = useToast();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('published_at', { ascending: false });
        
        if (error) throw error;
        
        setNews(data || []);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: 'Error al cargar las noticias',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-light mb-12">Noticias y Actualizaciones</h1>

        {loading ? (
          <div className="text-center py-8">Cargando noticias...</div>
        ) : news.length === 0 ? (
          <div className="text-center py-8">
            No hay noticias disponibles en este momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <Card key={item.id} className="h-full flex flex-col">
                {item.image_url && (
                  <div className="w-full h-48 overflow-hidden">
                    <img 
                      src={item.image_url} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{formatDate(item.published_at)}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div data-color-mode="light">
                    <MDEditor.Markdown 
                      source={item.formatted_content} 
                      style={{ backgroundColor: 'transparent', padding: 0 }} 
                    />
                  </div>
                </CardContent>
                {item.link_url && (
                  <CardFooter>
                    <a 
                      href={item.link_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline"
                    >
                      Ver más
                    </a>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Noticias;
