
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet';

interface News {
  id: string;
  title: string;
  formatted_content?: string;
  image_url?: string;
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

  const getExcerpt = (content?: string) => {
    if (!content) return '';
    // Remove markdown syntax and get first 150 characters
    const plainText = content.replace(/[#*`]/g, '');
    return plainText.length > 150 ? `${plainText.slice(0, 150)}...` : plainText;
  };

  return (
    <Layout>
      <Helmet>
        <title>Noticias y Actualizaciones - EURA</title>
        <meta name="description" content="Mantente informado sobre las últimas noticias y actualizaciones de EURA, empresa líder en arquitectura y construcción en Valencia." />
        <meta property="og:title" content="Noticias y Actualizaciones - EURA" />
        <meta property="og:description" content="Últimas noticias y actualizaciones de EURA" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://eura.es/noticias" />
      </Helmet>

      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-light mb-12">Noticias y Actualizaciones</h1>

        {loading ? (
          <div className="text-center py-8">Cargando noticias...</div>
        ) : news.length === 0 ? (
          <div className="text-center py-8">
            No hay noticias disponibles en este momento.
          </div>
        ) : (
          <div className="space-y-12">
            {news.map((item) => (
              <article key={item.id} className="flex flex-col md:flex-row gap-8">
                {item.image_url && (
                  <div className="md:w-1/3">
                    <img 
                      src={item.image_url} 
                      alt={item.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="md:w-2/3">
                  <h2 className="text-2xl font-light mb-2">{item.title}</h2>
                  <p className="text-gray-600 mb-4">{formatDate(item.published_at)}</p>
                  <p className="text-gray-700 mb-4">{getExcerpt(item.formatted_content)}</p>
                  <Link 
                    to={`/noticias/${item.id}`}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-2 font-medium"
                  >
                    Ver más <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Noticias;
