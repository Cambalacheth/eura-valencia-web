
import Layout from '../components/Layout';
import ServicesGrid from '../components/ServicesGrid';

const Servicios = () => {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-light text-center mb-12">SERVICIOS</h1>
        <ServicesGrid />
      </div>
    </Layout>
  );
};

export default Servicios;
