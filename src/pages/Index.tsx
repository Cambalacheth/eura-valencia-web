import Layout from '../components/Layout';
import Hero from '../components/Hero';
import About from '../components/About';
import ServicesGrid from '../components/ServicesGrid';
import { Link } from 'react-router-dom';
const Index = () => {
  const projects = [{
    title: "VIVIENDAS",
    image: "/lovable-uploads/7e74dff5-4261-4c40-8389-abd2fcf98334.png",
    link: "/proyectos/viviendas"
  }, {
    title: "REFORMAS RESTAURANTES Y OFICINAS",
    image: "/lovable-uploads/b600f3d3-5c4e-46f7-b60c-0d69701f9ab7.png",
    link: "/proyectos/reformas"
  }, {
    title: "COMUNIDADES DE PROPIETARIOS - ZAGUANES Y FACHADAS",
    image: "/lovable-uploads/9bf5854c-cc11-4207-9172-fd9d39f3645e.png",
    link: "/proyectos/comunidades"
  }];
  return <Layout>
      <Hero />
      <About />
      <div className="container mx-auto py-12 px-4 bg-slate-50">
        <h2 className="text-3xl font-light text-center mb-12">PROYECTOS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, index) => <Link to={project.link} key={index} className="block hover:opacity-90 transition-opacity">
              <div className="relative overflow-hidden rounded-lg">
                <img src={project.image} alt={project.title} className="w-full h-64 object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-light text-center px-4">
                    {project.title}
                  </h3>
                </div>
              </div>
            </Link>)}
        </div>
      </div>
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4 bg-slate-50">
          <h2 className="text-3xl font-light text-center mb-12 text-white">SERVICIOS</h2>
          <ServicesGrid />
        </div>
      </div>
    </Layout>;
};
export default Index;