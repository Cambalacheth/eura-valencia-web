
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { FolderOpen, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Administracion = () => {
  const { isAdmin } = useAuth();

  // Redirect to home if not admin
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-light mb-8">Panel de Administración</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Gestión de Proyectos
              </CardTitle>
              <CardDescription>
                Administra los proyectos mostrados en el sitio web
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Añade, edita o elimina proyectos de viviendas, reformas y comunidades
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/administracion/proyectos" className="w-full">
                <button className="bg-black text-white px-4 py-2 rounded w-full">
                  Gestionar Proyectos
                </button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Gestión de Noticias
              </CardTitle>
              <CardDescription>
                Administra las noticias y publicaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Añade, edita o elimina noticias y publicaciones del sitio web
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/administracion/noticias" className="w-full">
                <button className="bg-black text-white px-4 py-2 rounded w-full">
                  Gestionar Noticias
                </button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Administracion;
