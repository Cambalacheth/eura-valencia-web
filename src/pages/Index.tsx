
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import ServiceImages from '../components/ServiceImages';
import About from '../components/About';
import ServicesGrid from '../components/ServicesGrid';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <About />
      <div className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-light text-center mb-12">PROYECTOS</h2>
        <ServiceImages />
      </div>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-light text-center mb-12">SERVICIOS</h2>
          <ServicesGrid />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
