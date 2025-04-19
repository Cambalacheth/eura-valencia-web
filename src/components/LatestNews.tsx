
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

interface News {
  id: string;
  title: string;
  formatted_content?: string;
  image_url?: string;
  published_at: string;
}

const LatestNews = () => {
  const [news, setNews] = useState<News[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(3);
        
        if (error) throw error;
        setNews(data || []);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Error al cargar las noticias',
          variant: 'destructive',
        });
      }
    };

    fetchLatestNews();
  }, [toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="py-12 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-light">Últimas Noticias</h2>
          <Link to="/noticias">
            <Button variant="outline">
              Ver todas las noticias <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item) => (
            <article key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {item.image_url && (
                <img 
                  src={item.image_url} 
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-light mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{formatDate(item.published_at)}</p>
                <Link 
                  to={`/noticias/${item.id}`}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm font-medium"
                >
                  Leer más <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
