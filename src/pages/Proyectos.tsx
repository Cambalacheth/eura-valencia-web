
import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';

const Proyectos = () => {
  const projects = [
    {
      title: "VIVIENDAS",
      image: "/lovable-uploads/7e74dff5-4261-4c40-8389-abd2fcf98334.png",
      link: "/proyectos/viviendas",
      category: "viviendas"
    },
    {
      title: "REFORMAS RESTAURANTES Y OFICINAS",
      image: "/lovable-uploads/b600f3d3-5c4e-46f7-b60c-0d69701f9ab7.png",
      link: "/proyectos/reformas",
      category: "reformas"
    },
    {
      title: "COMUNIDADES DE PROPIETARIOS - ZAGUANES Y FACHADAS",
      image: "/lovable-uploads/9bf5854c-cc11-4207-9172-fd9d39f3645e.png",
      link: "/proyectos/comunidades",
      category: "comunidades"
    }
  ];

  return (
    <Layout>
      <div className="w-full min-h-screen py-16">
        <div className="container mx-auto px-4 xl:px-8">
          <h1 className="text-5xl md:text-6xl font-light mb-16 text-center">Proyectos</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-12">
            {projects.map((project, index) => (
              <div key={index} className="h-full transform transition-all duration-300 hover:scale-[1.02]">
                <ProjectCard
                  title={project.title}
                  image={project.image}
                  link={project.link}
                  category={project.category}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Proyectos;
