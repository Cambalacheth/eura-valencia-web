
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface News {
  id: string;
  title: string;
  content?: string;
  image_url?: string;
  published_at: string;
  created_at: string;
}

const NewsForm = ({ 
  news, 
  onSubmit, 
  onCancel
}: { 
  news?: News, 
  onSubmit: (data: Omit<News, 'id' | 'created_at' | 'published_at'>) => void,
  onCancel: () => void 
}) => {
  const [title, setTitle] = useState(news?.title || '');
  const [content, setContent] = useState(news?.content || '');
  const [imageUrl, setImageUrl] = useState(news?.image_url || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      image_url: imageUrl
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
        <Label htmlFor="content">Contenido</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL de la Imagen</Label>
        <Input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {news ? 'Actualizar Noticia' : 'Crear Noticia'}
        </Button>
      </DialogFooter>
    </form>
  );
};

const NoticiasAdmin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentNews, setCurrentNews] = useState<News | undefined>(undefined);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<string | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Fetch news
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
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [toast]);

  const handleCreateNews = async (newsData: Omit<News, 'id' | 'created_at' | 'published_at'>) => {
    try {
      const { data, error } = await supabase
        .from('news')
        .insert([newsData])
        .select()
        .single();
      
      if (error) throw error;
      
      setNews((prev) => [data, ...prev]);
      setOpenDialog(false);
      
      toast({
        title: 'Éxito',
        description: 'Noticia creada correctamente',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleUpdateNews = async (newsData: Omit<News, 'id' | 'created_at' | 'published_at'>) => {
    if (!currentNews) return;
    
    try {
      const { data, error } = await supabase
        .from('news')
        .update(newsData)
        .eq('id', currentNews.id)
        .select()
        .single();
      
      if (error) throw error;
      
      setNews((prev) => 
        prev.map((n) => (n.id === currentNews.id ? data : n))
      );
      setOpenDialog(false);
      setCurrentNews(undefined);
      
      toast({
        title: 'Éxito',
        description: 'Noticia actualizada correctamente',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteNews = async () => {
    if (!newsToDelete) return;
    
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', newsToDelete);
      
      if (error) throw error;
      
      setNews((prev) => prev.filter((n) => n.id !== newsToDelete));
      setDeleteConfirmOpen(false);
      setNewsToDelete(null);
      
      toast({
        title: 'Éxito',
        description: 'Noticia eliminada correctamente',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (newsItem: News) => {
    setCurrentNews(newsItem);
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setCurrentNews(undefined);
  };

  const confirmDelete = (id: string) => {
    setNewsToDelete(id);
    setDeleteConfirmOpen(true);
  };

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-light">Gestión de Noticias</h1>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Nueva Noticia
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {currentNews ? 'Editar Noticia' : 'Crear Nueva Noticia'}
                </DialogTitle>
                <DialogDescription>
                  {currentNews 
                    ? 'Modifica los detalles de la noticia existente.' 
                    : 'Añade una nueva noticia al sitio web.'}
                </DialogDescription>
              </DialogHeader>
              <NewsForm 
                news={currentNews} 
                onSubmit={currentNews ? handleUpdateNews : handleCreateNews}
                onCancel={closeDialog}
              />
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-8">Cargando noticias...</div>
        ) : news.length === 0 ? (
          <div className="text-center py-8">
            No hay noticias. Crea la primera con el botón de arriba.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Fecha de Publicación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {news.map((newsItem) => (
                <TableRow key={newsItem.id}>
                  <TableCell className="font-medium">{newsItem.title}</TableCell>
                  <TableCell>{formatDate(newsItem.published_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => openEditDialog(newsItem)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => confirmDelete(newsItem.id)}
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
              ¿Estás seguro de que deseas eliminar esta noticia? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteNews}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default NoticiasAdmin;
