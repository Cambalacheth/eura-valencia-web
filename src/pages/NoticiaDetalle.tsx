
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import MDEditor from "@uiw/react-md-editor";

interface News {
  id: string;
  title: string;
  formatted_content?: string;
  image_url?: string;
  link_url?: string;
  published_at: string;
}

const NoticiaDetalle = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setNews(data);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: 'Error al cargar la noticia',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id, toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">Cargando...</div>
      </div>
    </Layout>
  );

  if (!news) return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">Noticia no encontrada</div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <article className="max-w-4xl mx-auto">
          {news.image_url && (
            <img 
              src={news.image_url} 
              alt={news.title}
              className="w-full h-[400px] object-cover rounded-lg mb-8"
            />
          )}
          <h1 className="text-4xl font-light mb-4">{news.title}</h1>
          <p className="text-gray-600 mb-6">{formatDate(news.published_at)}</p>
          
          <div className="prose max-w-none" data-color-mode="light">
            <MDEditor.Markdown 
              source={news.formatted_content} 
              style={{ backgroundColor: 'transparent', padding: 0 }} 
            />
          </div>

          {news.link_url && (
            <div className="mt-8">
              <a 
                href={news.link_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline flex items-center gap-2"
              >
                Ver sitio web relacionado
              </a>
            </div>
          )}
        </article>
      </div>
    </Layout>
  );
};

export default NoticiaDetalle;
